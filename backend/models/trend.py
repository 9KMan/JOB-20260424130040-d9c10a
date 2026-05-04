import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Float, JSON
from sqlalchemy.dialects.postgresql import UUID
from database import Base


class Trend(Base):
    __tablename__ = "trends"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    topic = Column(String(500), nullable=False)
    platform = Column(String(50), nullable=False)
    volume_score = Column(Float, default=0.0)
    velocity = Column(String(20), default="stable")
    captured_at = Column(DateTime, default=datetime.utcnow)
    metadata = Column(JSON, default=dict)