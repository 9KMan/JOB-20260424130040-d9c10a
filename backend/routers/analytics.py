from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Dict, Any
from uuid import UUID
from models import User, ContentPiece, Post
from utils.security import get_current_user
from database import get_db
from services import generate_analytics_insights

router = APIRouter()


@router.get("/overview")
async def get_analytics_overview(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    content_result = await db.execute(
        select(ContentPiece).where(ContentPiece.user_id == current_user.id)
    )
    content_pieces = content_result.scalars().all()

    total_pieces = len(content_pieces)
    published = sum(1 for p in content_pieces if p.status == "published")
    scheduled = sum(1 for p in content_pieces if p.status == "scheduled")
    drafts = sum(1 for p in content_pieces if p.status == "draft")

    posts_result = await db.execute(
        select(Post).join(ContentPiece).where(ContentPiece.user_id == current_user.id)
    )
    posts = posts_result.scalars().all()

    total_views = sum(p.engagement.get("views", 0) for p in posts if p.engagement)
    total_likes = sum(p.engagement.get("likes", 0) for p in posts if p.engagement)
    total_shares = sum(p.engagement.get("shares", 0) for p in posts if p.engagement)

    avg_performance = sum(
        p.performance_score or 0 for p in content_pieces if p.performance_score
    ) / max(total_pieces, 1)

    data = {
        "total_content_pieces": total_pieces,
        "published": published,
        "scheduled": scheduled,
        "drafts": drafts,
        "total_posts": len(posts),
        "total_views": total_views,
        "total_likes": total_likes,
        "total_shares": total_shares,
        "average_performance_score": round(avg_performance, 2),
        "top_performing_piece": max(
            (p.title for p in content_pieces if p.performance_score),
            default=None,
            key=lambda x: x.performance_score or 0
        ) if content_pieces else None
    }

    insights = await generate_analytics_insights(data)
    data["ai_insights"] = insights

    return data


@router.get("/content/{content_id}")
async def get_content_analytics(
    content_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    result = await db.execute(
        select(ContentPiece).where(
            ContentPiece.id == content_id,
            ContentPiece.user_id == current_user.id
        )
    )
    piece = result.scalar_one_or_none()
    if not piece:
        return {"error": "Content piece not found"}

    posts_result = await db.execute(
        select(Post).where(Post.content_piece_id == content_id)
    )
    posts = posts_result.scalars().all()

    engagement_data = {
        "total_views": sum(p.engagement.get("views", 0) for p in posts if p.engagement),
        "total_likes": sum(p.engagement.get("likes", 0) for p in posts if p.engagement),
        "total_shares": sum(p.engagement.get("shares", 0) for p in posts if p.engagement),
        "total_comments": sum(p.engagement.get("comments", 0) for p in posts if p.engagement),
    }

    return {
        "content_piece": {
            "id": str(piece.id),
            "title": piece.title,
            "content_type": piece.content_type,
            "status": piece.status.value if hasattr(piece.status, 'value') else piece.status,
            "performance_score": piece.performance_score,
            "created_at": piece.created_at.isoformat() if piece.created_at else None,
        },
        "posts": [
            {
                "platform": p.platform,
                "status": p.status.value if hasattr(p.status, 'value') else p.status,
                "engagement": p.engagement,
                "published_at": p.published_at.isoformat() if p.published_at else None,
            }
            for p in posts
        ],
        "engagement": engagement_data
    }


@router.get("/platforms")
async def get_platform_breakdown(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    posts_result = await db.execute(
        select(Post).join(ContentPiece).where(ContentPiece.user_id == current_user.id)
    )
    posts = posts_result.scalars().all()

    platform_stats = {}
    for post in posts:
        platform = post.platform
        if platform not in platform_stats:
            platform_stats[platform] = {
                "total_posts": 0,
                "published": 0,
                "pending": 0,
                "failed": 0,
                "total_views": 0,
                "total_likes": 0,
                "total_shares": 0
            }
        platform_stats[platform]["total_posts"] += 1
        status_key = post.status.value if hasattr(post.status, 'value') else post.status
        if status_key in platform_stats[platform]:
            platform_stats[platform][status_key] += 1
        if post.engagement:
            platform_stats[platform]["total_views"] += post.engagement.get("views", 0)
            platform_stats[platform]["total_likes"] += post.engagement.get("likes", 0)
            platform_stats[platform]["total_shares"] += post.engagement.get("shares", 0)

    return {"platforms": platform_stats}