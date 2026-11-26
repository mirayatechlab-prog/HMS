"""MediCore HMS FastAPI application entrypoint."""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_v1_router
from app.core.config import Settings, get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging
from app.core.middleware import CorrelationIdMiddleware, SecurityHeadersMiddleware
from app.db.session import engine

logger = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncGenerator[None]:
    """Manage application startup and shutdown lifecycle."""
    settings = get_settings()
    logger.info("medicore_hms_starting", env=settings.APP_ENV)
    yield
    await engine.dispose()
    logger.info("medicore_hms_stopped")


def create_app(settings: Settings | None = None) -> FastAPI:
    """Create and configure the MediCore HMS FastAPI application."""
    resolved_settings = settings or get_settings()
    configure_logging(
        log_level=resolved_settings.LOG_LEVEL,
        log_format=resolved_settings.LOG_FORMAT,
    )

    app = FastAPI(
        title=resolved_settings.APP_NAME,
        version="0.1.0",
        docs_url="/docs" if resolved_settings.APP_ENV != "production" else None,
        redoc_url="/redoc" if resolved_settings.APP_ENV != "production" else None,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=resolved_settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Authorization", "Content-Type", "X-Correlation-ID"],
    )
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(CorrelationIdMiddleware)

    register_exception_handlers(app)
    app.include_router(api_v1_router, prefix=resolved_settings.API_V1_PREFIX)
    return app


app = create_app()
