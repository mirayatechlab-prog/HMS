"""Hospital tenant root model (Phase 0 foundation)."""

from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDMixin


class Hospital(UUIDMixin, TimestampMixin, Base):
    """Hospital tenant master record.

    Note: Capacity (bed count) is NEVER stored as an editable column here;
    it is always derived from individual bed records.
    """

    __tablename__ = "hospitals"

    code: Mapped[str] = mapped_column(String(32), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    timezone: Mapped[str] = mapped_column(String(64), nullable=False, default="Asia/Kolkata")
    currency: Mapped[str] = mapped_column(String(3), nullable=False, default="INR")
    locale: Mapped[str] = mapped_column(String(16), nullable=False, default="en-IN")
    fiscal_year_start_month: Mapped[int] = mapped_column(Integer, nullable=False, default=4)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_onboarding_complete: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
