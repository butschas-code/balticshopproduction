"""Weekly newsletter: cheapest retailer, avg basket, price drops, savings tip.

Runs every Sunday. Sends to confirmed subscribers (with weekly_report preference).
Uses basket_index and price_anomalies data.
"""

from __future__ import annotations

import smtplib
import time
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from sqlalchemy.orm import Session

from app.core import config
from app.core.logging import get_logger
from app.core.retailer_meta import get_retailer_info, is_basket_eligible
from app.db.models import BasketIndex, NewsletterSendLog, NewsletterSubscriber, PriceAnomaly

logger = get_logger(__name__)

SUBJECT = "Where groceries were cheapest this week"

SAVINGS_TIPS = [
    "Compare unit prices (€/kg, €/L) — bigger packs aren't always cheaper.",
    "Store-brand staples often match name brands for less.",
    "Check the basket total before you go — one retailer often wins the whole shop.",
]


def _last_7_dates() -> list[str]:
    """Last 7 calendar days (most recent first)."""
    today = datetime.now(timezone.utc).date()
    return [(today - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(7)]


def _build_cheapest_and_avg(db: Session, dates: list[str]) -> tuple[str, str, list[tuple[str, str]]]:
    """Return (cheapest_retailer_name, cheapest_avg_str, list of (retailer_name, avg_basket_str))."""
    rows = (
        db.query(BasketIndex.retailer_id, BasketIndex.basket_total, BasketIndex.date)
        .filter(BasketIndex.date.in_(dates), BasketIndex.items_found > 0)
        .all()
    )
    by_retailer: dict[str, list[float]] = {}
    for r in rows:
        if not is_basket_eligible(r.retailer_id):
            continue
        by_retailer.setdefault(r.retailer_id, []).append(r.basket_total)

    if not by_retailer:
        return "—", "—", []

    avg_by_retailer = [
        (rid, sum(totals) / len(totals))
        for rid, totals in by_retailer.items()
    ]
    avg_by_retailer.sort(key=lambda x: x[1])
    cheapest_rid, cheapest_avg = avg_by_retailer[0]
    cheapest_name = get_retailer_info(cheapest_rid).display_name

    lines = [
        (get_retailer_info(rid).display_name, f"{avg:.2f}€")
        for rid, avg in avg_by_retailer
    ]
    return cheapest_name, f"{cheapest_avg:.2f}€", lines


def _build_price_drops(db: Session, dates: list[str], limit: int = 5) -> list[tuple[str, str, float, float]]:
    """Biggest price drops in the period."""
    rows = (
        db.query(PriceAnomaly.retailer_id, PriceAnomaly.product, PriceAnomaly.old_price, PriceAnomaly.new_price)
        .filter(
            PriceAnomaly.date.in_(dates),
            PriceAnomaly.anomaly_type == "price_drop_50",
            PriceAnomaly.old_price.isnot(None),
            PriceAnomaly.new_price.isnot(None),
        )
        .all()
    )
    with_drop = [(r, (r.old_price or 0) - (r.new_price or 0)) for r in rows]
    with_drop.sort(key=lambda x: x[1], reverse=True)
    result = []
    seen: set[tuple[str, str]] = set()
    for r, _ in with_drop:
        key = (r.retailer_id, (r.product or "")[:80])
        if key in seen:
            continue
        seen.add(key)
        result.append((
            get_retailer_info(r.retailer_id).display_name,
            (r.product or "—")[:60],
            r.old_price or 0,
            r.new_price or 0,
        ))
        if len(result) >= limit:
            break
    return result


def build_newsletter_content(db: Session) -> tuple[str, str]:
    """Build subject and plain-text body. Uses last 7 days of data."""
    dates = _last_7_dates()
    cheapest_name, cheapest_avg_str, avg_lines = _build_cheapest_and_avg(db, dates)
    drops = _build_price_drops(db, dates)
    tip = SAVINGS_TIPS[0]

    lines = [
        "Where groceries were cheapest this week",
        "",
        "CHEAPEST THIS WEEK",
        f"  {cheapest_name} had the lowest average basket at {cheapest_avg_str}.",
        "",
        "AVERAGE BASKET PRICES (standard basket)",
    ]
    for name, avg_str in avg_lines:
        lines.append(f"  {name}: {avg_str}")
    lines.append("")

    if drops:
        lines.append("BIGGEST PRICE DROPS")
        for retailer, product, old_p, new_p in drops:
            lines.append(f"  {retailer}: {product} — {old_p:.2f}€ → {new_p:.2f}€")
        lines.append("")
    else:
        lines.append("(No large price drops recorded this week.)")
        lines.append("")

    lines.append("SAVINGS TIP")
    lines.append(f"  {tip}")
    lines.append("")
    lines.append("— LV Price Compare")
    body = "\n".join(lines)
    return SUBJECT, body


def get_confirmed_subscribers_for_weekly(db: Session) -> list[str]:
    """Emails of confirmed subscribers who have weekly_report preference True (default True)."""
    rows = (
        db.query(NewsletterSubscriber.email)
        .filter(NewsletterSubscriber.confirmed == True)
        .all()
    )
    out = []
    for (email,) in rows:
        sub = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.email == email).first()
        if not sub:
            continue
        prefs = sub.preferences or {}
        if prefs.get("weekly_report", True):
            out.append(email)
    return out


def send_weekly_newsletter(db: Session) -> dict[str, int]:
    """Build content, get confirmed subscribers, send one email each. Returns {"sent": n, "failed": n}."""
    if not config.SMTP_HOST:
        logger.warning("SMTP_HOST not set — cannot send weekly newsletter")
        return {"sent": 0, "failed": 0}

    subject, body = build_newsletter_content(db)
    recipients = get_confirmed_subscribers_for_weekly(db)
    if not recipients:
        logger.info("Weekly newsletter: no confirmed subscribers with weekly_report")
        return {"sent": 0, "failed": 0}

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = config.SMTP_FROM or config.SMTP_USER
    msg.set_content(body)

    sent = 0
    failed = 0
    for to in recipients:
        try:
            msg["To"] = to
            with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT, timeout=30) as srv:
                srv.ehlo()
                if config.SMTP_PORT != 25:
                    srv.starttls()
                if config.SMTP_USER:
                    srv.login(config.SMTP_USER, config.SMTP_PASS)
                srv.send_message(msg)
            sent += 1
            time.sleep(0.2)
        except Exception:
            logger.exception("Failed to send weekly newsletter to %s", to)
            failed += 1

    logger.info("Weekly newsletter: sent=%d failed=%d", sent, failed)
    run_date = datetime.now(timezone.utc).date().strftime("%Y-%m-%d")
    db.add(NewsletterSendLog(run_date=run_date, sent_count=sent, failed_count=failed))
    db.commit()
    return {"sent": sent, "failed": failed}
