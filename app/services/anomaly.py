"""Post-ingestion price anomaly detection.

Compares the two most recent scrapes per retailer and flags:
  - ``price_drop_50``   — price fell >50 %
  - ``price_spike_70``  — price rose >70 %
  - ``price_zero``      — price is suddenly 0 (or null)
  - ``reappeared``      — product was absent in the previous scrape
                          but present in the one before *and* the current one

Anomalies are persisted to the ``price_anomalies`` table and logged.
"""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.db.models import PriceAnomaly, ProductOffer

logger = get_logger(__name__)

DROP_THRESHOLD = 0.50
SPIKE_THRESHOLD = 0.70


def detect_anomalies(db: Session) -> list[PriceAnomaly]:
    """Run all anomaly checks and persist results.  Returns the new rows."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    all_anomalies: list[PriceAnomaly] = []

    retailer_ids = [
        r[0] for r in
        db.query(ProductOffer.retailer_id).distinct().all()
    ]

    for rid in retailer_ids:
        timestamps = (
            db.query(ProductOffer.scraped_at)
            .filter(ProductOffer.retailer_id == rid)
            .group_by(ProductOffer.scraped_at)
            .order_by(ProductOffer.scraped_at.desc())
            .limit(3)
            .all()
        )
        ts_list = [t[0] for t in timestamps]
        if len(ts_list) < 2:
            continue

        latest_ts, prev_ts = ts_list[0], ts_list[1]
        third_ts = ts_list[2] if len(ts_list) >= 3 else None

        latest = _load_scrape(db, rid, latest_ts)
        prev = _load_scrape(db, rid, prev_ts)
        third = _load_scrape(db, rid, third_ts) if third_ts else {}

        anomalies = _compare(rid, today, latest, prev, third)
        all_anomalies.extend(anomalies)

    if all_anomalies:
        # Remove any existing anomalies for today (idempotent re-runs)
        db.query(PriceAnomaly).filter(PriceAnomaly.date == today).delete()
        for a in all_anomalies:
            db.add(a)
        db.commit()

    _log_summary(all_anomalies)
    return all_anomalies


def _load_scrape(
    db: Session, retailer_id: str, scraped_at: datetime,
) -> dict[str, tuple[str, float]]:
    """Return {fingerprint: (title, price)} for one scrape."""
    rows = (
        db.query(ProductOffer.fingerprint, ProductOffer.title, ProductOffer.price)
        .filter(
            ProductOffer.retailer_id == retailer_id,
            ProductOffer.scraped_at == scraped_at,
            ProductOffer.fingerprint.isnot(None),
        )
        .all()
    )
    result: dict[str, tuple[str, float]] = {}
    for fp, title, price in rows:
        result[fp] = (title, price)
    return result


def _compare(
    retailer_id: str,
    today: str,
    latest: dict[str, tuple[str, float]],
    prev: dict[str, tuple[str, float]],
    third: dict[str, tuple[str, float]],
) -> list[PriceAnomaly]:
    anomalies: list[PriceAnomaly] = []

    for fp, (title, new_price) in latest.items():
        old_entry = prev.get(fp)

        if old_entry is None:
            # Product not in previous scrape — check for reappearance
            if fp in third:
                anomalies.append(PriceAnomaly(
                    date=today,
                    retailer_id=retailer_id,
                    product=title,
                    fingerprint=fp,
                    old_price=third[fp][1],
                    new_price=new_price,
                    anomaly_type="reappeared",
                ))
            continue

        old_price = old_entry[1]

        # Price suddenly zero
        if (new_price is None or new_price == 0) and old_price and old_price > 0:
            anomalies.append(PriceAnomaly(
                date=today,
                retailer_id=retailer_id,
                product=title,
                fingerprint=fp,
                old_price=old_price,
                new_price=new_price or 0.0,
                anomaly_type="price_zero",
            ))
            continue

        if not old_price or old_price <= 0:
            continue

        change = (new_price - old_price) / old_price

        # Price drop >50%
        if change < -DROP_THRESHOLD:
            anomalies.append(PriceAnomaly(
                date=today,
                retailer_id=retailer_id,
                product=title,
                fingerprint=fp,
                old_price=old_price,
                new_price=new_price,
                anomaly_type="price_drop_50",
            ))

        # Price spike >70%
        elif change > SPIKE_THRESHOLD:
            anomalies.append(PriceAnomaly(
                date=today,
                retailer_id=retailer_id,
                product=title,
                fingerprint=fp,
                old_price=old_price,
                new_price=new_price,
                anomaly_type="price_spike_70",
            ))

    return anomalies


def _log_summary(anomalies: list[PriceAnomaly]) -> None:
    if not anomalies:
        logger.info("Anomaly detection: no anomalies found")
        return

    by_type: dict[str, int] = {}
    for a in anomalies:
        by_type[a.anomaly_type] = by_type.get(a.anomaly_type, 0) + 1

    parts = ", ".join(f"{t}={c}" for t, c in sorted(by_type.items()))
    logger.warning("Anomaly detection: %d anomalies found — %s", len(anomalies), parts)

    for a in anomalies[:20]:
        logger.warning(
            "  [%s] %s | %s | %.2f → %.2f",
            a.anomaly_type, a.retailer_id, a.product[:60],
            a.old_price or 0, a.new_price or 0,
        )
    if len(anomalies) > 20:
        logger.warning("  ... and %d more", len(anomalies) - 20)
