from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from enum import Enum


class ContentTypeEnum(str, Enum):
    video = "video"
    post = "post"
    story = "story"
    article = "article"


class ContentStatusEnum(str, Enum):
    draft = "draft"
    scheduled = "scheduled"
    published = "published"
    archived = "archived"


class ContentGenerateRequest(BaseModel):
    topic: str
    content_type: ContentTypeEnum
    platforms: List[str]
    user_niche: Optional[str] = None


class ContentPieceResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str]
    content_type: str
    status: str
    generated_content: Optional[Dict[str, Any]]
    scheduled_for: Optional[datetime]
    platforms: List[str]
    performance_score: Optional[float]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ContentPieceCreate(BaseModel):
    title: str
    description: Optional[str] = None
    content_type: ContentTypeEnum
    platforms: List[str] = []


class ContentPieceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ContentStatusEnum] = None
    scheduled_for: Optional[datetime] = None


class ContentVariant(BaseModel):
    variant_id: int
    script: str
    outline: Optional[str]
    captions: Optional[str]
    hashtags: List[str]


class ContentGenerateResponse(BaseModel):
    variants: List[ContentVariant]
    trend_context: Optional[str] = None