import httpx
from typing import Optional, Dict, Any
from config import settings


class N8NService:
    def __init__(self, webhook_url: Optional[str] = None):
        self.webhook_url = webhook_url or settings.N8N_WEBHOOK_URL

    async def trigger_trend_alert(self, trend_data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.webhook_url:
            return {
                "success": True,
                "mock": True,
                "message": "n8n webhook not configured, would trigger trend alert workflow"
            }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.webhook_url,
                    json={
                        "workflow": "trend-alert",
                        "data": trend_data
                    },
                    timeout=10.0
                )
                return {"success": True, "response": response.json()}
            except Exception as e:
                return {"success": False, "error": str(e)}

    async def trigger_publish_workflow(self, content_data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.webhook_url:
            return {
                "success": True,
                "mock": True,
                "message": "n8n webhook not configured, would trigger publish workflow"
            }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.webhook_url,
                    json={
                        "workflow": "publish",
                        "data": content_data
                    },
                    timeout=10.0
                )
                return {"success": True, "response": response.json()}
            except Exception as e:
                return {"success": False, "error": str(e)}


n8n_service = N8NService()