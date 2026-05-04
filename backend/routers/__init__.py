from routers.auth import router as auth_router
from routers.content import router as content_router
from routers.trends import router as trends_router
from routers.instructions import router as instructions_router
from routers.analytics import router as analytics_router
from routers.workflows import router as workflows_router

__all__ = [
    "auth_router",
    "content_router",
    "trends_router",
    "instructions_router",
    "analytics_router",
    "workflows_router",
]