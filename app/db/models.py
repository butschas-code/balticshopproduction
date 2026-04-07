from datetime import datetime
from typing import Any, Optional

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Index, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Retailer(Base):
    __tablename__ = "retailers"

    id: Mapped[str] = mapped_column(String(50), primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    country: Mapped[str] = mapped_column(String(10))
    currency: Mapped[str] = mapped_column(String(10))
    base_url: Mapped[str] = mapped_column(String(500))

    offers: Mapped[list["ProductOffer"]] = relationship(back_populates="retailer")


class ProductOffer(Base):
    __tablename__ = "product_offers"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    retailer_id: Mapped[str] = mapped_column(
        String(50), ForeignKey("retailers.id"), nullable=False
    )
    scraped_at: Mapped[datetime] = mapped_column(DateTime, index=True)
    title: Mapped[str] = mapped_column(String(500))
    brand: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    size_text: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    price: Mapped[float] = mapped_column(Float)
    unit_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    unit: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    url: Mapped[str] = mapped_column(String(1000))
    raw_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source: Mapped[str] = mapped_column(String(20))  # "api" | "html" | "playwright"
    fingerprint: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    product_type: Mapped[Optional[str]] = mapped_column(String(100), index=True, nullable=True)
    category_path: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    category_root: Mapped[Optional[str]] = mapped_column(String(200), nullable=True, index=True)

    retailer: Mapped["Retailer"] = relationship(back_populates="offers")

    __table_args__ = (
        Index("ix_retailer_scraped", "retailer_id", "scraped_at"),
        Index("ix_title", "title"),
        Index("ix_fingerprint", "fingerprint"),
    )


class BasketIndex(Base):
    """Daily basket price index — one row per (date, retailer)."""

    __tablename__ = "basket_index"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(String(10), nullable=False)  # YYYY-MM-DD
    retailer_id: Mapped[str] = mapped_column(
        String(50), ForeignKey("retailers.id"), nullable=False,
    )
    basket_total: Mapped[float] = mapped_column(Float, nullable=False)
    items_found: Mapped[int] = mapped_column(nullable=False)
    items_total: Mapped[int] = mapped_column(nullable=False)

    __table_args__ = (
        Index("ix_basket_date_retailer", "date", "retailer_id", unique=True),
    )


class IngestLog(Base):
    """Per-retailer ingestion timing — one row per (date, retailer)."""

    __tablename__ = "ingest_log"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(String(10), nullable=False)  # YYYY-MM-DD
    retailer_id: Mapped[str] = mapped_column(
        String(50), ForeignKey("retailers.id"), nullable=False,
    )
    duration_seconds: Mapped[float] = mapped_column(Float, nullable=False)
    product_count: Mapped[int] = mapped_column(nullable=False)

    __table_args__ = (
        Index("ix_ingest_log_date_retailer", "date", "retailer_id", unique=True),
    )


class PriceAnomaly(Base):
    """Detected price anomalies — written after each ingestion run."""

    __tablename__ = "price_anomalies"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    date: Mapped[str] = mapped_column(String(10), nullable=False)
    retailer_id: Mapped[str] = mapped_column(
        String(50), ForeignKey("retailers.id"), nullable=False,
    )
    product: Mapped[str] = mapped_column(String(500), nullable=False)
    fingerprint: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    old_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    new_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    anomaly_type: Mapped[str] = mapped_column(String(50), nullable=False)

    __table_args__ = (
        Index("ix_anomaly_date_retailer", "date", "retailer_id"),
        Index("ix_anomaly_type", "anomaly_type"),
    )


class CanonicalProduct(Base):
    """Future use: for cross-retailer product matching."""

    __tablename__ = "canonical_products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(500))
    normalized_name: Mapped[str] = mapped_column(String(500), index=True)
    category: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)


class NewsletterSubscriber(Base):
    """Email capture for price alerts, weekly basket, savings insights. No account/login."""

    __tablename__ = "newsletter_subscribers"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    source: Mapped[str] = mapped_column(String(50), nullable=False)  # homepage | basket | popup
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    confirmed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    confirmation_token: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, index=True)
    preferences: Mapped[Optional[dict[str, Any]]] = mapped_column(JSON, nullable=True)
    # preferences example: {"weekly_report": true, "price_alerts": true, "big_price_drops": true}

    __table_args__ = (Index("ix_newsletter_email", "email"),)


class NewsletterSendLog(Base):
    """One row per weekly newsletter run — for admin 'emails sent' total."""

    __tablename__ = "newsletter_send_log"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    run_date: Mapped[str] = mapped_column(String(10), nullable=False)  # YYYY-MM-DD
    sent_count: Mapped[int] = mapped_column(nullable=False, default=0)
    failed_count: Mapped[int] = mapped_column(nullable=False, default=0)
