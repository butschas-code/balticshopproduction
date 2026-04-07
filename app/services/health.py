"""Post-ingestion data health monitoring.

After every ingestion run, verifies:
  1. Product counts per retailer vs 7-day average (flag >30% deviation).
  2. Basket index created for today (critical if missing for eligible retailers).
  3. Price history updated — new ProductOffer rows exist for today.

Results are logged to ``logs/health.log`` in a structured format and
CRITICAL issues are escalated to ``logs/alerts.log``.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.core.retailer_meta import get_all_retailer_info, is_basket_eligible
from app.db.models import BasketIndex, IngestLog, ProductOffer

logger = get_logger(__name__)

_PROJECT_ROOT = Path(__file__).resolve().parents[2]
_HEALTH_LOG = _PROJECT_ROOT / "logs" / "health.log"
_ALERTS_LOG = _PROJECT_ROOT / "logs" / "alerts.log"

_CRITICAL_BANNER = (
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n"
    "!! CRITICAL: {headline:<50s}!!\n"
    "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
)


@dataclass
class HealthEntry:
    date: str
    retailer_id: str
    product_count: int
    price_changes: int
    status: str  # OK | WARNING | CRITICAL
    details: str = ""


@dataclass
class HealthReport:
    entries: list[HealthEntry] = field(default_factory=list)
    basket_ok: bool = True
    history_ok: bool = True
    global_status: str = "OK"

    def worst_status(self) -> str:
        statuses = [e.status for e in self.entries]
        if not self.basket_ok:
            statuses.append("CRITICAL")
        if not self.history_ok:
            statuses.append("CRITICAL")
        if "CRITICAL" in statuses:
            return "CRITICAL"
        if "WARNING" in statuses:
            return "WARNING"
        return "OK"


def run_health_checks(
    db: Session,
    summary: dict[str, dict],
    count_deviation_pct: float = 0.30,
    lookback_days: int = 7,
) -> HealthReport:
    """Execute all health checks and return a structured report.

    Call this after ingestion + basket index update have completed.
    """
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    report = HealthReport()

    # ── CHECK 1: Product counts vs 7-day average ────────────────
    for info in get_all_retailer_info():
        rid = info.retailer_id
        today_count = summary.get(rid, {}).get("count", 0)
        status_str = summary.get(rid, {}).get("status", "missing")

        if status_str == "error":
            report.entries.append(HealthEntry(
                date=today, retailer_id=rid,
                product_count=0, price_changes=0,
                status="CRITICAL",
                details="Ingestion failed for this retailer",
            ))
            continue

        if status_str == "missing":
            report.entries.append(HealthEntry(
                date=today, retailer_id=rid,
                product_count=0, price_changes=0,
                status="WARNING",
                details="Retailer not in ingestion summary (adapter may be disabled)",
            ))
            continue

        # 7-day average from IngestLog
        past_rows = (
            db.query(IngestLog.product_count)
            .filter(
                IngestLog.retailer_id == rid,
                IngestLog.date < today,
            )
            .order_by(IngestLog.date.desc())
            .limit(lookback_days)
            .all()
        )
        past_counts = [r[0] for r in past_rows if r[0] is not None]

        # Count price changes: distinct fingerprints today that had a
        # different price in the previous scrape
        price_changes = _count_price_changes(db, rid)

        entry = HealthEntry(
            date=today,
            retailer_id=rid,
            product_count=today_count,
            price_changes=price_changes,
            status="OK",
        )

        if len(past_counts) >= 2:
            avg = sum(past_counts) / len(past_counts)
            if avg > 0:
                deviation = abs(today_count - avg) / avg
                if deviation > count_deviation_pct:
                    direction = "fewer" if today_count < avg else "more"
                    entry.status = "WARNING"
                    entry.details = (
                        f"Product count {direction} than 7-day avg: "
                        f"{today_count} vs {avg:.0f} ({deviation:.0%} deviation)"
                    )

        report.entries.append(entry)

    # ── CHECK 2: Basket index created for today ─────────────────
    basket_rows = (
        db.query(BasketIndex.retailer_id)
        .filter(BasketIndex.date == today)
        .all()
    )
    basket_retailers = {r[0] for r in basket_rows}

    eligible = [
        info.retailer_id
        for info in get_all_retailer_info()
        if is_basket_eligible(info.retailer_id)
    ]
    missing_basket = [rid for rid in eligible if rid not in basket_retailers]

    if missing_basket:
        report.basket_ok = False
        for rid in missing_basket:
            for entry in report.entries:
                if entry.retailer_id == rid:
                    entry.status = "CRITICAL"
                    entry.details += (
                        f"{'; ' if entry.details else ''}"
                        f"Basket index NOT created for {rid} today"
                    )

    # ── CHECK 3: Price history updated (new rows exist) ─────────
    today_start = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0,
    )
    new_rows_count: int = (
        db.query(func.count(ProductOffer.id))
        .filter(ProductOffer.scraped_at >= today_start)
        .scalar() or 0
    )

    if new_rows_count == 0:
        report.history_ok = False
        for entry in report.entries:
            entry.status = "CRITICAL"
            entry.details += (
                f"{'; ' if entry.details else ''}"
                "No new ProductOffer rows for today"
            )

    report.global_status = report.worst_status()

    # ── Log everything ──────────────────────────────────────────
    _write_health_log(report)
    if report.global_status == "CRITICAL":
        _write_alerts(report)

    return report


def _count_price_changes(db: Session, retailer_id: str) -> int:
    """Count fingerprints whose price changed between the two most recent scrapes."""
    timestamps = (
        db.query(ProductOffer.scraped_at)
        .filter(ProductOffer.retailer_id == retailer_id)
        .group_by(ProductOffer.scraped_at)
        .order_by(ProductOffer.scraped_at.desc())
        .limit(2)
        .all()
    )
    if len(timestamps) < 2:
        return 0

    latest_ts, prev_ts = timestamps[0][0], timestamps[1][0]

    # Build fingerprint→price maps for each scrape
    latest_prices: dict[str, float] = {}
    for fp, price in (
        db.query(ProductOffer.fingerprint, ProductOffer.price)
        .filter(
            ProductOffer.retailer_id == retailer_id,
            ProductOffer.scraped_at == latest_ts,
            ProductOffer.fingerprint.isnot(None),
        )
        .all()
    ):
        latest_prices[fp] = price

    changed = 0
    for fp, price in (
        db.query(ProductOffer.fingerprint, ProductOffer.price)
        .filter(
            ProductOffer.retailer_id == retailer_id,
            ProductOffer.scraped_at == prev_ts,
            ProductOffer.fingerprint.isnot(None),
        )
        .all()
    ):
        if fp in latest_prices and abs(latest_prices[fp] - price) > 0.001:
            changed += 1

    return changed


# ── Logging helpers ──────────────────────────────────────────────

def _get_health_logger() -> logging.Logger:
    """Lazily create a file logger for health.log."""
    health_logger = logging.getLogger("health_file")
    resolved = str(_HEALTH_LOG.resolve())
    if not any(
        isinstance(h, logging.FileHandler) and h.baseFilename == resolved
        for h in health_logger.handlers
    ):
        _HEALTH_LOG.parent.mkdir(parents=True, exist_ok=True)
        fh = logging.FileHandler(str(_HEALTH_LOG), encoding="utf-8")
        fh.setFormatter(logging.Formatter("%(message)s"))
        health_logger.addHandler(fh)
        health_logger.setLevel(logging.INFO)
    return health_logger


def _write_health_log(report: HealthReport) -> None:
    hl = _get_health_logger()

    hl.info("=" * 72)
    hl.info("HEALTH CHECK  %s  global_status=%s", report.entries[0].date if report.entries else "?", report.global_status)
    hl.info("-" * 72)
    hl.info("%-14s %-12s %8s %8s  %s", "date", "retailer", "products", "Δ prices", "status")
    hl.info("-" * 72)

    for e in report.entries:
        line = "%-14s %-12s %8d %8d  %s" % (
            e.date, e.retailer_id, e.product_count, e.price_changes, e.status,
        )
        hl.info(line)
        if e.details:
            hl.info("    → %s", e.details)

    if not report.basket_ok:
        hl.info("BASKET INDEX: MISSING for eligible retailers")
    if not report.history_ok:
        hl.info("PRICE HISTORY: No new rows added today")

    hl.info("=" * 72)

    # Also emit to main logger
    logger.info(
        "Health check complete: %s (%d retailers)",
        report.global_status,
        len(report.entries),
    )


def _write_alerts(report: HealthReport) -> None:
    """Write CRITICAL entries to alerts.log with prominent markers."""
    _ALERTS_LOG.parent.mkdir(parents=True, exist_ok=True)
    alert_logger = logging.getLogger("alerts_file")
    resolved = str(_ALERTS_LOG.resolve())
    if not any(
        isinstance(h, logging.FileHandler) and h.baseFilename == resolved
        for h in alert_logger.handlers
    ):
        fh = logging.FileHandler(str(_ALERTS_LOG), encoding="utf-8")
        fh.setFormatter(logging.Formatter("%(message)s"))
        alert_logger.addHandler(fh)
        alert_logger.setLevel(logging.WARNING)

    ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    for e in report.entries:
        if e.status == "CRITICAL":
            headline = f"{e.retailer_id}: {e.details[:50]}"
            banner = _CRITICAL_BANNER.format(headline=headline)
            alert_logger.error("\n%s", banner)
            alert_logger.error(
                "[%s] CRITICAL | %s | products=%d | %s",
                ts, e.retailer_id, e.product_count, e.details,
            )

    if not report.basket_ok:
        banner = _CRITICAL_BANNER.format(headline="Basket index missing for today")
        alert_logger.error("\n%s", banner)
        alert_logger.error("[%s] CRITICAL | basket_index | Missing for eligible retailers", ts)

    if not report.history_ok:
        banner = _CRITICAL_BANNER.format(headline="No new price rows added today")
        alert_logger.error("\n%s", banner)
        alert_logger.error("[%s] CRITICAL | price_history | Zero new ProductOffer rows", ts)
