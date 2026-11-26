"""Strict environment-validated application configuration."""

from functools import lru_cache
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    APP_NAME: str = "MediCore HMS"
    APP_ENV: Literal["development", "test", "staging", "production"] = "development"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"
    LOG_FORMAT: Literal["json", "console"] = "json"

    SECRET_KEY: str = Field(..., min_length=32)
    CORS_ORIGINS: str = "http://localhost:5173"

    DATABASE_URL: str = Field(..., min_length=10)
    DATABASE_MIGRATION_URL: str = Field(..., min_length=10)
    REDIS_URL: str = Field(..., min_length=6)

    S3_ENDPOINT_URL: str = "http://minio:9000"
    S3_ACCESS_KEY_ID: str = "medicore_minio_dev"
    S3_SECRET_ACCESS_KEY: str = "medicore_minio_dev_secret"
    S3_BUCKET_NAME: str = "medicore-private-docs"
    S3_REGION: str = "ap-south-1"
    S3_USE_SSL: bool = False

    DEFAULT_TIMEZONE: str = "Asia/Kolkata"
    DEFAULT_CURRENCY: str = "INR"
    DEFAULT_LOCALE: str = "en-IN"

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_async_database_url(cls, value: str) -> str:
        """Ensure runtime database URL uses an async PostgreSQL driver."""
        if not value.startswith("postgresql+asyncpg://"):
            raise ValueError("DATABASE_URL must use postgresql+asyncpg://")
        return value

    @field_validator("DATABASE_MIGRATION_URL")
    @classmethod
    def validate_migration_database_url(cls, value: str) -> str:
        """Ensure migration database URL uses psycopg."""
        if not value.startswith("postgresql+psycopg://"):
            raise ValueError("DATABASE_MIGRATION_URL must use postgresql+psycopg://")
        return value

    @field_validator("REDIS_URL")
    @classmethod
    def validate_redis_url(cls, value: str) -> str:
        """Ensure Redis URL uses redis:// or rediss://."""
        if not value.startswith(("redis://", "rediss://")):
            raise ValueError("REDIS_URL must start with redis:// or rediss://")
        return value

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key_for_env(cls, value: str, info: object) -> str:
        """Reject known insecure placeholder keys outside development/test."""
        env = getattr(info, "data", {}).get("APP_ENV", "development")
        if env in ("staging", "production") and "dev-only-insecure" in value:
            raise ValueError("Insecure default SECRET_KEY is forbidden in staging/production")
        return value

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a clean list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings instance."""
    return Settings()
