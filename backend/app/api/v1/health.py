"""Health and readiness endpoints (/api/v1/health/live and /api/v1/health/ready)."""

from typing import Literal

from fastapi import APIRouter, Response, status
from pydantic import BaseModel
from sqlalchemy import text

from app.db.redis import create_redis_client
from app.db.session import AsyncSessionLocal

router = APIRouter(prefix="/health", tags=["Health"])


class LivenessResponse(BaseModel):
    """Liveness response independent of external dependencies."""

    status: Literal["alive"]
    service: str


class ReadinessChecks(BaseModel):
    """Sanitized dependency statuses (never expose URLs or credentials)."""

    database: Literal["ok", "unavailable"]
    redis: Literal["ok", "unavailable"]


class ReadinessResponse(BaseModel):
    """Readiness response reflecting required backing services."""

    status: Literal["ready", "not_ready"]
    checks: ReadinessChecks


async def check_database_ready() -> bool:
    """Verify PostgreSQL connectivity with SELECT 1."""
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


async def check_redis_ready() -> bool:
    """Verify Redis connectivity with PING."""
    client = create_redis_client()
    try:
        pong = await client.ping()
        return bool(pong)
    except Exception:
        return False
    finally:
        await client.aclose()


@router.get("/live", response_model=LivenessResponse, status_code=status.HTTP_200_OK)
async def liveness() -> LivenessResponse:
    """Liveness probe — independent of external dependencies."""
    return LivenessResponse(status="alive", service="medicore-hms")


@router.get(
    "/ready",
    response_model=ReadinessResponse,
    responses={503: {"model": ReadinessResponse}},
)
async def readiness(response: Response) -> ReadinessResponse:
    """Readiness probe — verifies PostgreSQL and Redis availability."""
    db_ok = await check_database_ready()
    redis_ok = await check_redis_ready()
    all_ready = db_ok and redis_ok
    if not all_ready:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    return ReadinessResponse(
        status="ready" if all_ready else "not_ready",
        checks=ReadinessChecks(
            database="ok" if db_ok else "unavailable",
            redis="ok" if redis_ok else "unavailable",
        ),
    )
