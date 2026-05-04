from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import List
from uuid import UUID
from datetime import datetime
from models import User, ContentPiece, ContentStatus, Post
from schemas.content import (
    ContentPieceResponse, ContentPieceCreate, ContentPieceUpdate,
    ContentGenerateRequest, ContentGenerateResponse, ContentVariant
)
from utils.security import get_current_user
from database import get_db
from services import generate_content_variants, postiz_service

router = APIRouter()


@router.get("", response_model=List[ContentPieceResponse])
async def list_content_pieces(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ContentPiece)
        .where(ContentPiece.user_id == current_user.id)
        .order_by(ContentPiece.created_at.desc())
    )
    return result.scalars().all()


@router.post("/generate", response_model=ContentGenerateResponse)
async def generate_content(
    request: ContentGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    variants_data = await generate_content_variants(
        topic=request.topic,
        content_type=request.content_type.value,
        platforms=request.platforms,
        user_niche=request.user_niche
    )

    content_piece = ContentPiece(
        user_id=current_user.id,
        title=f"{request.topic} - AI Generated",
        content_type=request.content_type.value,
        status=ContentStatus.draft,
        platforms=request.platforms,
        generated_content={"variants": variants_data}
    )
    db.add(content_piece)
    await db.commit()
    await db.refresh(content_piece)

    variants = [
        ContentVariant(
            variant_id=v["variant_id"],
            script=v.get("full_content", ""),
            outline=None,
            captions=None,
            hashtags=v.get("hashtags", [])
        )
        for v in variants_data
    ]

    return ContentGenerateResponse(variants=variants)


@router.get("/{content_id}", response_model=ContentPieceResponse)
async def get_content_piece(
    content_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ContentPiece)
        .where(ContentPiece.id == content_id, ContentPiece.user_id == current_user.id)
    )
    piece = result.scalar_one_or_none()
    if not piece:
        raise HTTPException(status_code=404, detail="Content piece not found")
    return piece


@router.put("/{content_id}", response_model=ContentPieceResponse)
async def update_content_piece(
    content_id: UUID,
    update_data: ContentPieceUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ContentPiece)
        .where(ContentPiece.id == content_id, ContentPiece.user_id == current_user.id)
    )
    piece = result.scalar_one_or_none()
    if not piece:
        raise HTTPException(status_code=404, detail="Content piece not found")

    if update_data.title is not None:
        piece.title = update_data.title
    if update_data.description is not None:
        piece.description = update_data.description
    if update_data.status is not None:
        piece.status = ContentStatus(update_data.status.value)
    if update_data.scheduled_for is not None:
        piece.scheduled_for = update_data.scheduled_for

    piece.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(piece)
    return piece


@router.delete("/{content_id}")
async def delete_content_piece(
    content_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ContentPiece)
        .where(ContentPiece.id == content_id, ContentPiece.user_id == current_user.id)
    )
    piece = result.scalar_one_or_none()
    if not piece:
        raise HTTPException(status_code=404, detail="Content piece not found")

    piece.status = ContentStatus.archived
    await db.commit()
    return {"message": "Content piece archived"}


@router.post("/{content_id}/schedule")
async def schedule_content(
    content_id: UUID,
    platform: str,
    scheduled_for: str = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ContentPiece)
        .where(ContentPiece.id == content_id, ContentPiece.user_id == current_user.id)
    )
    piece = result.scalar_one_or_none()
    if not piece:
        raise HTTPException(status_code=404, detail="Content piece not found")

    content_json = piece.generated_content or {}
    variant = content_json.get("variants", [{}])[0] if content_json.get("variants") else {}
    content_text = variant.get("full_content", piece.title)

    schedule_result = await postiz_service.schedule_post(
        content=content_text,
        platform=platform,
        scheduled_for=scheduled_for
    )

    post = Post(
        content_piece_id=piece.id,
        platform=platform,
        platform_post_id=schedule_result.get("platform_post_id"),
        status="pending" if not scheduled_for else "pending"
    )
    db.add(post)

    piece.status = ContentStatus.scheduled
    if scheduled_for:
        piece.scheduled_for = datetime.fromisoformat(scheduled_for.replace("Z", "+00:00"))

    await db.commit()
    await db.refresh(piece)

    return {"message": "Content scheduled", "post_id": str(post.id), "result": schedule_result}