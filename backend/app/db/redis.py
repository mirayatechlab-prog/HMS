"""Redis client factory."""

from redis.asyncio import Redis

from app.core.config import get_settings


def create_redis_client() -> Redis:
    """Create an async Redis client."""
    settings = get_settings()
    client: Redis = Redis.from_url(settings.REDIS_URL, decode_responses=True)
    return client
