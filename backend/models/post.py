import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import enum
from database import Base


class PostStatus(str, enum.Enum):
    pending = "pending"
    published = "published"
    failed = "failed"


class Post(Base):
    __tablename__ = "posts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content_piece_id = Column(UUID(as_uuid=True), ForeignKey("content_pieces.id"), nullable=False)
    platform = Column(String(50), nullable=False)
    platform_post_id = Column(String(255), nullable=True)
    status = Column(SQLEnum(PostStatus), default=PostStatus.pending)
    scheduled_at = Column(DateTime, nullable=True)
    published_at = Column(DateTime, nullable=True)
    engagement = Column(JSON, default=dict)

    content_piece = relationship("ContentPiece", back_populates="posts")