from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List, Optional
from datetime import datetime
from models import User, Trend
from schemas.trend import TrendResponse, TrendRefreshResponse
from utils.security import get_current_user
from database import get_db
from services import get_mock_trends, refresh_trends

router = APIRouter()


@router.get("", response_model=List[TrendResponse])
async def list_trends(
    platform: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    trends_data = await get_mock_trends(platform=platform)
    trends_data = trends_data[:limit]

    trends = []
    for t_data in trends_data:
        trend = Trend(
            topic=t_data["topic"],
            platform=t_data["platform"],
            volume_score=t_data["volume_score"],
            velocity=t_data["velocity"],
            captured_at=datetime.utcnow(),
            metadata=t_data
        )
        db.add(trend)
        trends.append(trend)

    await db.commit()

    result = await db.execute(
        select(Trend)
        .order_by(Trend.volume_score.desc())
        .limit(limit)
    )
    return result.scalars().all()


@router.post("/refresh", response_model=TrendRefreshResponse)
async def refresh_trend_data(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    await db.execute(delete(Trend))
    await db.commit()

    refreshed_trends = await refresh_trends()

    trends = []
    for t_data in refreshed_trends:
        trend = Trend(
            topic=t_data["topic"],
            platform=t_data["platform"],
            volume_score=t_data["volume_score"],
            velocity=t_data["velocity"],
            captured_at=datetime.utcnow(),
            metadata=t_data
        )
        db.add(trend)
        trends.append(trend)

    await db.commit()

    return TrendRefreshResponse(trends=trends, refreshed_at=datetime.utcnow())