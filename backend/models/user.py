import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    openai_key = Column(Text, nullable=True)
    postiz_token = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    content_pieces = relationship("ContentPiece", back_populates="user", cascade="all, delete-orphan")
    creator_instructions = relationship("CreatorInstruction", back_populates="user", cascade="all, delete-orphan")