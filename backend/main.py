from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import settings
from database import engine, Base
from routers import auth, content, trends, instructions, analytics, workflows


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_V1_PREFIX, tags=["auth"])
app.include_router(content.router, prefix=settings.API_V1_PREFIX, tags=["content"])
app.include_router(trends.router, prefix=settings.API_V1_PREFIX, tags=["trends"])
app.include_router(instructions.router, prefix=settings.API_V1_PREFIX, tags=["instructions"])
app.include_router(analytics.router, prefix=settings.API_V1_PREFIX, tags=["analytics"])
app.include_router(workflows.router, prefix=settings.API_V1_PREFIX, tags=["workflows"])


@app.get("/")
async def root():
    return {"message": "Content Factory API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}