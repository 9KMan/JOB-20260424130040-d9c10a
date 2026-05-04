from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime


class TrendResponse(BaseModel):
    id: UUID
    topic: str
    platform: str
    volume_score: float
    velocity: str
    captured_at: datetime
    metadata: Dict[str, Any]

    class Config:
        from_attributes = True


class TrendRefreshResponse(BaseModel):
    trends: List[TrendResponse]
    refreshed_at: datetime