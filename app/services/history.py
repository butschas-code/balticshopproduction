"""Price history intelligence — read-only queries over historical ProductOffer rows.

Groups products by ``fingerprint`` when available (stable across minor title
changes).  Falls back to exact ``(retailer_id, title)`` matching for rows
that predate the fingerprint column.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from sqlalchemy import or_, func
from sqlalchemy.orm import Session

from app.db.models import ProductOffer, Retailer
from app.schemas.dto import PricePoint, PriceStats
from app.services.normalize import generate_fingerprint


def _build_history_filter(anchor: ProductOffer):
    """Return a SQLAlchemy filter that finds all rows belonging to the same product.

    If the anchor has a fingerprint, match on fingerprint (covers rows where
    the title changed slightly).  Also include exact-title rows whose
    fingerprint is NULL (legacy data).
    """
    if anchor.fingerprint:
        return (
            ProductOffer.retailer_id == anchor.retailer_id,
            or_(
                ProductOffer.fingerprint == anchor.fingerprint,
                (ProductOffer.fingerprint.is_(None))
                & (ProductOffer.title == anchor.title),
            ),
        )
    return (
        ProductOffer.retailer_id == anchor.retailer_id,
        ProductOffer.title == anchor.title,
    )


def get_price_history(
    db: Session,
    offer_id: int,
) -> list[PricePoint]:
    """Return chronological daily price observations for the product."""
    anchor = db.get(ProductOffer, offer_id)
    if not anchor:
        return []

    flt = _build_history_filter(anchor)

    rows = (
        db.query(
            func.date(ProductOffer.scraped_at).label("day"),
            func.min(ProductOffer.price).label("price"),
            func.min(ProductOffer.unit_price).label("unit_price"),
        )
        .filter(*flt)
        .group_by(func.date(ProductOffer.scraped_at))
        .order_by("day")
        .all()
    )

    return [
        PricePoint(
            date=str(row.day),
            price=round(row.price, 2),
            unit_price=round(row.unit_price, 2) if row.unit_price else None,
        )
        for row in rows
    ]


def get_price_stats(
    db: Session,
    offer_id: int,
) -> PriceStats | None:
    """Compute price intelligence for the product identified by *offer_id*."""
    anchor = db.get(ProductOffer, offer_id)
    if not anchor:
        return None

    retailer = db.get(Retailer, anchor.retailer_id)
    retailer_name = retailer.name if retailer else anchor.retailer_id

    history = get_price_history(db, offer_id)
    if not history:
        return None

    prices = [p.price for p in history]
    lowest = min(prices)
    highest = max(prices)

    now = datetime.now(timezone.utc)
    cutoff_30d = (now - timedelta(days=30)).strftime("%Y-%m-%d")
    recent = [p.price for p in history if p.date >= cutoff_30d]
    avg_30d = round(sum(recent) / len(recent), 2) if recent else None

    last_change = _find_last_change(history)
    trend = _compute_trend(history)

    return PriceStats(
        offer_id=offer_id,
        retailer_id=anchor.retailer_id,
        retailer_name=retailer_name,
        title=anchor.title,
        current_price=history[-1].price,
        lowest_price=lowest,
        highest_price=highest,
        avg_price_30d=avg_30d,
        price_range=round(highest - lowest, 2),
        observation_count=len(history),
        first_seen=history[0].date,
        last_seen=history[-1].date,
        last_price_change=last_change,
        price_trend=trend,
        history=history,
    )


def get_price_stats_by_title(
    db: Session,
    retailer_id: str,
    title: str,
) -> PriceStats | None:
    """Look up stats by (retailer_id, title) — resolves fingerprint automatically."""
    fp = generate_fingerprint(title, retailer_id)
    row = (
        db.query(ProductOffer.id)
        .filter(
            ProductOffer.retailer_id == retailer_id,
            or_(
                ProductOffer.fingerprint == fp,
                ProductOffer.title == title,
            ),
        )
        .order_by(ProductOffer.scraped_at.desc())
        .first()
    )
    if not row:
        return None
    return get_price_stats(db, row.id)


# ------------------------------------------------------------------
# Internal helpers
# ------------------------------------------------------------------


def _find_last_change(history: list[PricePoint]) -> str | None:
    """Walk backwards to find the most recent date the price differed from its predecessor."""
    if len(history) < 2:
        return None
    for i in range(len(history) - 1, 0, -1):
        if abs(history[i].price - history[i - 1].price) >= 0.005:
            return history[i].date
    return None


def _compute_trend(history: list[PricePoint]) -> str:
    if len(history) < 2:
        return "new"

    current = history[-1].price
    previous = history[-2].price
    delta = current - previous

    if abs(delta) < 0.005:
        if len(history) >= 3:
            first = history[0].price
            long_delta = current - first
            if long_delta > 0.05:
                return "rising"
            if long_delta < -0.05:
                return "falling"
        return "stable"
    return "rising" if delta > 0 else "falling"
