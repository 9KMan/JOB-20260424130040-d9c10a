from openai import AsyncOpenAI
from config import settings
from typing import List, Dict, Any, Optional

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY or "sk-dummy")


async def generate_content_variants(
    topic: str,
    content_type: str,
    platforms: List[str],
    user_niche: Optional[str] = None
) -> List[Dict[str, Any]]:
    platform_str = ", ".join(platforms)
    niche_context = f"User's niche: {user_niche}" if user_niche else "General content"

    prompt = f"""You are a viral content creator expert. Generate 3 unique content variants for:
Topic: {topic}
Content Type: {content_type}
Platforms: {platform_str}
{niche_context}

For each variant provide:
1. A catchy title
2. A full script/outline (detailed for videos, structured for posts)
3. Suggested captions (for social media)
4. 10-15 relevant hashtags
5. Best posting time recommendation

Format each variant clearly separated. Make each variant distinctly different in angle/approach."""

    response = await client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": "You are an expert viral content creator with deep knowledge of social media trends and audience engagement."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.9,
        max_tokens=4000
    )

    content = response.choices[0].message.content

    variants = []
    variant_sections = content.split("Variant")
    for i, section in enumerate(variant_sections[1:], 1):
        variants.append({
            "variant_id": i,
            "full_content": section.strip(),
            "title": f"{topic} - Variant {i}",
            "hashtags": extract_hashtags(section),
        })

    return variants[:3]


async def generate_trend_analysis(trends: List[Dict[str, Any]], user_niche: Optional[str] = None) -> str:
    trends_text = "\n".join([f"- {t['topic']} on {t['platform']} (volume: {t['volume_score']}, velocity: {t['velocity']})" for t in trends[:10]])

    prompt = f"""Analyze these trending topics and provide actionable insights for a content creator:

{trends_text}

{f'User niche: {user_niche}' if user_niche else 'General creator'}

Provide:
1. Top 3 trends to capitalize on NOW
2. Why these trends are performing well
3. Content angle recommendations
4. Platform-specific tips"""

    response = await client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": "You are a social media trend analyst with expertise in viral content patterns."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=2000
    )

    return response.choices[0].message.content


async def generate_creator_instructions(
    user_niche: Optional[str] = None,
    content_types: List[str] = [],
    recent_performance: Optional[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    niche_context = f"Creator niche: {user_niche}" if user_niche else "General content"
    perf_context = f"Recent performance data: {recent_performance}" if recent_performance else "No performance data yet"

    prompt = f"""Generate 5 actionable daily instructions for a content creator.

{niche_context}
{perf_context}
Preferred content types: {', '.join(content_types) if content_types else 'All types'}

For each instruction provide:
1. Clear action step (what to do)
2. Content type recommendation
3. Urgency level (urgent/high/medium/low)
4. Why this matters (context)
5. Expected outcome

Make instructions specific, actionable, and prioritized by urgency."""

    response = await client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": "You are an AI content strategy coach helping creators maximize their viral potential."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.8,
        max_tokens=3000
    )

    content = response.choices[0].message.content

    instructions = []
    urgency_levels = ["urgent", "high", "medium", "low"]
    for i, section in enumerate(content.split("\n\n")[:5]):
        urgency = urgency_levels[min(i, len(urgency_levels) - 1)]
        instructions.append({
            "instruction_text": section.strip(),
            "urgency": urgency,
            "content_type": content_types[i % len(content_types)] if content_types else "video",
            "context": {"source": "ai_generated", "niche": user_niche}
        })

    return instructions


async def generate_analytics_insights(analytics_data: Dict[str, Any]) -> str:
    prompt = f"""Analyze this content performance data and provide actionable insights:

{str(analytics_data)}

Provide:
1. Key performance highlights
2. Content types performing best
3. Optimal posting times
4. Platform-specific recommendations
5. One actionable tip to improve"""

    response = await client.chat.completions.create(
        model="gpt-4-turbo-preview",
        messages=[
            {"role": "system", "content": "You are a data-driven content strategy expert."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.6,
        max_tokens=1500
    )

    return response.choices[0].message.content


def extract_hashtags(text: str) -> List[str]:
    import re
    hashtags = re.findall(r'#\w+', text)
    return hashtags[:15]