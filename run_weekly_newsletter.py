#!/usr/bin/env python3
"""Send the weekly newsletter (cheapest retailer, avg basket, price drops, savings tip).

Intended to run every Sunday, e.g. after the morning ingest.
Sends only to confirmed newsletter subscribers (with weekly_report preference).

Usage:
    python run_weekly_newsletter.py
    crontab (e.g. Sunday 9:00):  0 9 * * 0  cd /path/to/project && .venv/bin/python run_weekly_newsletter.py

Logs to stdout and optionally to logs/weekly_newsletter.log if that file handler is added.
"""

from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(PROJECT_ROOT))

from dotenv import load_dotenv  # noqa: E402
load_dotenv(PROJECT_ROOT / ".env")

from app.core.logging import add_file_handler, get_logger  # noqa: E402
from app.db.migrate import create_tables  # noqa: E402
from app.db.session import get_db_ctx  # noqa: E402
from app.services.weekly_newsletter import send_weekly_newsletter  # noqa: E402

LOG_FILE = PROJECT_ROOT / "logs" / "weekly_newsletter.log"
add_file_handler(LOG_FILE)

logger = get_logger("weekly_newsletter")


def main() -> int:
    logger.info("Weekly newsletter run started")
    create_tables()
    try:
        with get_db_ctx() as db:
            result = send_weekly_newsletter(db)
    except Exception:
        logger.exception("Weekly newsletter run failed")
        return 1
    sent = result.get("sent", 0)
    failed = result.get("failed", 0)
    logger.info("Weekly newsletter finished — sent=%d failed=%d", sent, failed)
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
