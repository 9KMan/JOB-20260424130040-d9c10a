import httpx
from typing import Optional, Dict, Any
from config import settings


class PostizService:
    def __init__(self, token: Optional[str] = None):
        self.base_url = settings.POSTIZ_API_URL
        self.token = token or settings.POSTIZ_TOKEN

    async def schedule_post(
        self,
        content: str,
        platform: str,
        scheduled_for: Optional[str] = None
    ) -> Dict[str, Any]:
        if not self.token:
            return {
                "success": False,
                "error": "Postiz token not configured",
                "mock": True,
                "platform_post_id": f"mock_{platform}_{hash(content) % 10000}"
            }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/api/posts",
                    json={
                        "content": content,
                        "platform": platform,
                        "scheduled_for": scheduled_for
                    },
                    headers={"Authorization": f"Bearer {self.token}"},
                    timeout=10.0
                )
                return response.json()
            except Exception as e:
                return {"success": False, "error": str(e)}

    async def get_post_status(self, platform_post_id: str) -> Dict[str, Any]:
        if not self.token:
            return {
                "success": True,
                "mock": True,
                "status": "published",
                "engagement": {"views": 0, "likes": 0, "shares": 0}
            }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/api/posts/{platform_post_id}",
                    headers={"Authorization": f"Bearer {self.token}"},
                    timeout=10.0
                )
                return response.json()
            except Exception as e:
                return {"success": False, "error": str(e)}

    async def delete_post(self, platform_post_id: str) -> bool:
        if not self.token:
            return True

        async with httpx.AsyncClient() as client:
            try:
                response = await client.delete(
                    f"{self.base_url}/api/posts/{platform_post_id}",
                    headers={"Authorization": f"Bearer {self.token}"},
                    timeout=10.0
                )
                return response.status_code == 200
            except Exception:
                return False


postiz_service = PostizService()