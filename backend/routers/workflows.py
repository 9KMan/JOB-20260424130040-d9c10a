from fastapi import APIRouter, Depends
from typing import Dict, Any
from models import User
from utils.security import get_current_user
from services import n8n_service

router = APIRouter()


@router.post("/trigger/trend-alert")
async def trigger_trend_alert(
    trend_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    result = await n8n_service.trigger_trend_alert(trend_data)
    return result


@router.post("/trigger/publish")
async def trigger_publish(
    content_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    result = await n8n_service.trigger_publish_workflow(content_data)
    return result