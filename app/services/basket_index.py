"""Daily basket price index — tracks a fixed household basket across retailers.

Called automatically after each ingestion run.  Stores one row per
(date, retailer) in the ``basket_index`` table.  Provides
``get_price_index_history()`` for querying the time-series.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.core.retailer_meta import is_basket_eligible
from app.db.models import BasketIndex
from app.services.pricing import compute_basket

logger = get_logger(__name__)

# Standard household basket — the fixed list of items tracked daily.
STANDARD_BASKET: list[str] = [
    "piens",      # milk
    "maize",      # bread
    "sviests",    # butter
    "olas",       # eggs
    "vista",      # chicken
    "rīsi",       # rice
    "siers",      # cheese
    "jogurts",    # yogurt
    "banāni",     # bananas
    "kartupeļi",  # potatoes
    "cukurs",     # sugar
    "makaroni",   # pasta
]


@dataclass
class DayIndex:
    date: str
    retailer_id: str
    retailer_name: str
    basket_total: float
    items_found: int
    items_total: int
    is_cheapest: bool = False


@dataclass
class IndexHistory:
    basket_items: list[str]
    days: list[str]
    series: dict[str, list[float | None]] = field(default_factory=dict)
    cheapest_by_day: dict[str, str] = field(default_factory=dict)


# ------------------------------------------------------------------
# Compute & store
# ------------------------------------------------------------------

def update_basket_index(db: Session) -> list[DayIndex]:
    """Compute today's basket totals and upsert into ``basket_index``.

    Returns the DayIndex rows that were written so callers can log them.
    """
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    results = compute_basket(db, STANDARD_BASKET)
    if not results:
        logger.warning("Basket index: no retailer results — skipping")
        return []

    entries: list[DayIndex] = []
    for br in results:
        if not is_basket_eligible(br.retailer_id):
            logger.info(
                "  Basket index: skipping %s (catalog_type=%s)",
                br.retailer_id, br.catalog_type,
            )
            continue

        entry = DayIndex(
            date=today,
            retailer_id=br.retailer_id,
            retailer_name=br.retailer_name,
            basket_total=br.total,
            items_found=br.found_count,
            items_total=len(STANDARD_BASKET),
        )
        entries.append(entry)

        existing = (
            db.query(BasketIndex)
            .filter(
                BasketIndex.date == today,
                BasketIndex.retailer_id == br.retailer_id,
            )
            .first()
        )
        if existing:
            existing.basket_total = br.total
            existing.items_found = br.found_count
            existing.items_total = len(STANDARD_BASKET)
        else:
            db.add(BasketIndex(
                date=today,
                retailer_id=br.retailer_id,
                basket_total=br.total,
                items_found=br.found_count,
                items_total=len(STANDARD_BASKET),
            ))

    db.commit()

    # Mark cheapest
    valid = [e for e in entries if e.items_found > 0]
    if valid:
        cheapest = min(valid, key=lambda e: e.basket_total)
        cheapest.is_cheapest = True

    for e in entries:
        tag = " ← cheapest" if e.is_cheapest else ""
        logger.info(
            "  Basket index %s %s: %.2f€ (%d/%d items)%s",
            e.date, e.retailer_id, e.basket_total,
            e.items_found, e.items_total, tag,
        )

    return entries


# ------------------------------------------------------------------
# Query
# ------------------------------------------------------------------

def get_price_index_history(db: Session, days: int = 90) -> IndexHistory:
    """Return basket index time-series for all retailers over the last *days* days."""
    rows = (
        db.query(BasketIndex)
        .order_by(BasketIndex.date.asc())
        .all()
    )

    all_dates: list[str] = sorted({r.date for r in rows})
    if len(all_dates) > days:
        all_dates = all_dates[-days:]
    date_set = set(all_dates)

    retailer_ids: list[str] = sorted({r.retailer_id for r in rows})

    lookup: dict[tuple[str, str], BasketIndex] = {
        (r.date, r.retailer_id): r for r in rows if r.date in date_set
    }

    series: dict[str, list[float | None]] = {}
    for rid in retailer_ids:
        series[rid] = [
            round(lookup[(d, rid)].basket_total, 2) if (d, rid) in lookup else None
            for d in all_dates
        ]

    cheapest_by_day: dict[str, str] = {}
    for d in all_dates:
        day_entries = [
            (rid, lookup[(d, rid)].basket_total)
            for rid in retailer_ids
            if (d, rid) in lookup and lookup[(d, rid)].items_found > 0
        ]
        if day_entries:
            cheapest_by_day[d] = min(day_entries, key=lambda x: x[1])[0]

    return IndexHistory(
        basket_items=list(STANDARD_BASKET),
        days=all_dates,
        series=series,
        cheapest_by_day=cheapest_by_day,
    )


def get_cheapest_retailer_of_day(
    db: Session, date: str | None = None,
) -> tuple[str, float] | None:
    """Return (retailer_id, basket_total) for the cheapest retailer on *date*."""
    if date is None:
        date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    row = (
        db.query(BasketIndex.retailer_id, BasketIndex.basket_total)
        .filter(BasketIndex.date == date, BasketIndex.items_found > 0)
        .order_by(BasketIndex.basket_total.asc())
        .first()
    )
    return (row[0], round(row[1], 2)) if row else None


def get_today_basket_for_home(
    db: Session, date: str | None = None,
) -> tuple[
    list[tuple[str, str, float]],  # (retailer_id, display_name, basket_total)
    tuple[str, float] | None,       # cheapest (retailer_id, total)
    float,                           # savings (max - min)
]:
    """Return today's basket totals for homepage hero.  Rows are (retailer_id, retailer_id, total);
    view resolves display_name from retailer_meta.
    """
    if date is None:
        date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    rows = (
        db.query(BasketIndex.retailer_id, BasketIndex.basket_total)
        .filter(BasketIndex.date == date, BasketIndex.items_found > 0)
        .order_by(BasketIndex.basket_total.asc())
        .all()
    )

    if not rows:
        return [], None, 0.0

    totals = [(r[0], r[0], round(r[1], 2)) for r in rows]
    cheapest = (rows[0][0], round(rows[0][1], 2))
    savings = round(rows[-1][1] - rows[0][1], 2) if len(rows) > 1 else 0.0

    return totals, cheapest, savings
