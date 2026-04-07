"""Newsletter signup — email capture only, no account/login.

Collects emails for:
- price drop alerts
- weekly cheapest basket
- shopping savings insights
"""

from __future__ import annotations

import re
import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from typing import Any

from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core import config
from app.core.logging import get_logger
from app.db.models import NewsletterSendLog, NewsletterSubscriber

logger = get_logger(__name__)

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
VALID_SOURCES = frozenset({"homepage", "basket", "popup"})
DEFAULT_PREFERENCES = {
    "weekly_report": True,
    "price_alerts": True,
    "big_price_drops": True,
}


def send_confirmation_email(to_email: str, token: str) -> bool:
    """Send confirmation email with link. Uses existing SMTP from config. Returns True on success."""
    if not config.SMTP_HOST:
        logger.warning("SMTP_HOST not set — skipping confirmation email")
        return False
    confirm_url = f"{config.BASE_URL}/newsletter/confirm?token={token}"
    subject = "Confirm your grocery savings alerts"
    body = (
        "Click to confirm you want weekly price updates and savings alerts.\n\n"
        f"{confirm_url}\n"
    )
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = config.SMTP_FROM or config.SMTP_USER
    msg["To"] = to_email
    msg.set_content(body)
    try:
        with smtplib.SMTP(config.SMTP_HOST, config.SMTP_PORT, timeout=30) as srv:
            srv.ehlo()
            if config.SMTP_PORT != 25:
                srv.starttls()
            if config.SMTP_USER:
                srv.login(config.SMTP_USER, config.SMTP_PASS)
            srv.send_message(msg)
        logger.info("Confirmation email sent to %s", to_email)
        return True
    except Exception:
        logger.exception("Failed to send confirmation email to %s", to_email)
        return False


def subscribe(
    db: Session,
    email: str,
    source: str = "homepage",
    preferences: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Add a newsletter subscriber. No account, no login.

    Args:
        db: DB session.
        email: Email address (will be lowercased and stripped).
        source: One of homepage | basket | popup.
        preferences: Optional dict e.g. {"weekly_report": true, "price_alerts": true, "big_price_drops": true}.

    Returns:
        {"status": "subscribed"} or {"status": "already_subscribed"} or {"status": "error", "message": "..."}.
    """
    raw = (email or "").strip().lower()
    if not raw:
        return {"status": "error", "message": "Email is required."}
    if not EMAIL_RE.match(raw):
        return {"status": "error", "message": "Invalid email address."}

    src = source.strip().lower() if source else "homepage"
    if src not in VALID_SOURCES:
        src = "homepage"

    prefs = dict(DEFAULT_PREFERENCES)
    if isinstance(preferences, dict):
        for k, v in preferences.items():
            if k in prefs and isinstance(v, bool):
                prefs[k] = v

    token = secrets.token_urlsafe(32)
    try:
        row = NewsletterSubscriber(
            email=raw,
            source=src,
            confirmed=False,
            confirmation_token=token,
            preferences=prefs,
        )
        db.add(row)
        db.commit()
        send_confirmation_email(raw, token)
        return {"status": "subscribed"}
    except IntegrityError:
        db.rollback()
        return {"status": "already_subscribed"}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}


def confirm_subscriber(db: Session, token: str) -> bool:
    """Find subscriber by confirmation_token, set confirmed=True, clear token. Returns True if confirmed."""
    if not (token or "").strip():
        return False
    row = (
        db.query(NewsletterSubscriber)
        .filter(NewsletterSubscriber.confirmation_token == token.strip())
        .first()
    )
    if not row:
        return False
    row.confirmed = True
    row.confirmation_token = None
    db.commit()
    return True


def get_newsletter_admin_stats(db: Session) -> dict[str, Any]:
    """Stats for admin newsletter panel: total, new this week, confirmation rate, emails sent, top source."""
    total = db.query(func.count(NewsletterSubscriber.id)).scalar() or 0
    week_start = datetime.now(timezone.utc) - timedelta(days=7)
    new_this_week = (
        db.query(func.count(NewsletterSubscriber.id))
        .filter(NewsletterSubscriber.created_at >= week_start)
        .scalar()
        or 0
    )
    confirmed_count = (
        db.query(func.count(NewsletterSubscriber.id))
        .filter(NewsletterSubscriber.confirmed == True)
        .scalar()
        or 0
    )
    confirmation_rate = f"{100 * confirmed_count / total:.0f}%" if total else "—"
    emails_sent = int(
        db.query(func.sum(NewsletterSendLog.sent_count)).scalar() or 0
    )
    top_sources = (
        db.query(NewsletterSubscriber.source, func.count(NewsletterSubscriber.id))
        .group_by(NewsletterSubscriber.source)
        .order_by(func.count(NewsletterSubscriber.id).desc())
        .all()
    )
    return {
        "total_subscribers": total,
        "new_this_week": new_this_week,
        "confirmation_rate": confirmation_rate,
        "emails_sent": int(emails_sent),
        "top_signup_source": top_sources,
    }
