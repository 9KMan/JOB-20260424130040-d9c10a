from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List
from uuid import UUID
from datetime import datetime
from models import User, CreatorInstruction
from schemas.instruction import (
    InstructionResponse, InstructionGenerateRequest, InstructionGenerateResponse
)
from utils.security import get_current_user
from database import get_db
from services import generate_creator_instructions

router = APIRouter()


@router.get("", response_model=List[InstructionResponse])
async def list_instructions(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(CreatorInstruction)
        .where(CreatorInstruction.user_id == current_user.id)
        .order_by(CreatorInstruction.created_at.desc())
    )
    return result.scalars().all()


@router.post("/generate", response_model=InstructionGenerateResponse)
async def generate_instructions(
    request: InstructionGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    instructions_data = await generate_creator_instructions(
        user_niche=request.user_niche,
        content_types=request.content_types
    )

    instructions = []
    for inst_data in instructions_data:
        instruction = CreatorInstruction(
            user_id=current_user.id,
            instruction_text=inst_data["instruction_text"],
            content_type=inst_data.get("content_type"),
            context=inst_data.get("context", {}),
            urgency=inst_data.get("urgency", "medium")
        )
        db.add(instruction)
        instructions.append(instruction)

    await db.commit()

    return InstructionGenerateResponse(
        instructions=instructions,
        generated_at=datetime.utcnow()
    )


@router.put("/{instruction_id}/read")
async def mark_instruction_read(
    instruction_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(CreatorInstruction)
        .where(
            CreatorInstruction.id == instruction_id,
            CreatorInstruction.user_id == current_user.id
        )
    )
    instruction = result.scalar_one_or_none()
    if not instruction:
        return {"error": "Instruction not found"}

    instruction.read = True
    await db.commit()
    return {"message": "Instruction marked as read"}


@router.put("/{instruction_id}/done")
async def mark_instruction_done(
    instruction_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(CreatorInstruction)
        .where(
            CreatorInstruction.id == instruction_id,
            CreatorInstruction.user_id == current_user.id
        )
    )
    instruction = result.scalar_one_or_none()
    if not instruction:
        return {"error": "Instruction not found"}

    await db.delete(instruction)
    await db.commit()
    return {"message": "Instruction marked as done and removed"}