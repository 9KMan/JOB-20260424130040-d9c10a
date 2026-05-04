from typing import List, Dict, Any
from datetime import datetime
import random


MOCK_TRENDS = [
    {"topic": "AI Tools 2024", "platform": "youtube", "volume_score": 95.0, "velocity": "rising"},
    {"topic": "Morning Routine Hacks", "platform": "tiktok", "volume_score": 88.0, "velocity": "rising"},
    {"topic": "Side Hustle Ideas", "platform": "instagram", "volume_score": 82.0, "velocity": "stable"},
    {"topic": "Productivity Tips", "platform": "youtube", "volume_score": 79.0, "velocity": "rising"},
    {"topic": "Day in My Life", "platform": "tiktok", "volume_score": 85.0, "velocity": "stable"},
    {"topic": "Budget Travel Tips", "platform": "youtube", "volume_score": 76.0, "velocity": "rising"},
    {"topic": "Meal Prep Ideas", "platform": "instagram", "volume_score": 73.0, "velocity": "declining"},
    {"topic": "Workout Routines", "platform": "tiktok", "volume_score": 81.0, "velocity": "stable"},
    {"topic": "Tech Reviews", "platform": "youtube", "volume_score": 78.0, "velocity": "rising"},
    {"topic": "Fashion Trends", "platform": "instagram", "volume_score": 74.0, "velocity": "stable"},
    {"topic": "Coding Tutorials", "platform": "youtube", "volume_score": 83.0, "velocity": "rising"},
    {"topic": "Mindfulness Tips", "platform": "instagram", "volume_score": 69.0, "velocity": "rising"},
    {"topic": "Recipe Quick Meals", "platform": "tiktok", "volume_score": 86.0, "velocity": "rising"},
    {"topic": "Fitness Challenge", "platform": "youtube", "volume_score": 71.0, "velocity": "stable"},
    {"topic": "Book Recommendations", "platform": "instagram", "volume_score": 67.0, "velocity": "declining"},
    {"topic": "Room Makeover", "platform": "tiktok", "volume_score": 80.0, "velocity": "rising"},
    {"topic": "Study Tips", "platform": "youtube", "volume_score": 75.0, "velocity": "stable"},
    {"topic": "Pet Videos", "platform": "tiktok", "volume_score": 89.0, "velocity": "rising"},
    {"topic": "DIY Projects", "platform": "youtube", "volume_score": 72.0, "velocity": "stable"},
    {"topic": "Career Advice", "platform": "linkedin", "volume_score": 68.0, "velocity": "rising"},
]


async def get_mock_trends(platform: str = None) -> List[Dict[str, Any]]:
    if platform:
        filtered = [t for t in MOCK_TRENDS if t["platform"] == platform]
        return filtered if filtered else MOCK_TRENDS[:5]
    return MOCK_TRENDS


async def refresh_trends() -> List[Dict[str, Any]]:
    updated_trends = []
    for trend in MOCK_TRENDS:
        updated_trend = trend.copy()
        updated_trend["volume_score"] = min(100, trend["volume_score"] + random.uniform(-5, 10))
        updated_trend["captured_at"] = datetime.utcnow().isoformat()
        velocities = ["rising", "stable", "declining"]
        updated_trend["velocity"] = random.choice(velocities)
        updated_trends.append(updated_trend)
    return updated_trends