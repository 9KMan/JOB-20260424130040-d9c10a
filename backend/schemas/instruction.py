from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime
from enum import Enum


class UrgencyEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"


class InstructionResponse(BaseModel):
    id: UUID
    instruction_text: str
    content_type: Optional[str]
    context: Dict[str, Any]
    urgency: str
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True


class InstructionGenerateRequest(BaseModel):
    user_niche: Optional[str] = None
    content_types: List[str] = []


class InstructionGenerateResponse(BaseModel):
    instructions: List[InstructionResponse]
    generated_at: datetime