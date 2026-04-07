"""Minimal migration helper – creates all tables if they don't exist."""

from __future__ import annotations

from sqlalchemy import inspect, text

from app.db.base import Base, engine
from app.db import models as _models  # noqa: F401 – register models with Base


def _table_column_names(table: str) -> set[str]:
    """Column names for SQLite and Postgres (avoids PRAGMA, which is SQLite-only)."""
    insp = inspect(engine)
    if not insp.has_table(table):
        return set()
    return {c["name"] for c in insp.get_columns(table)}


def create_tables() -> None:
    Base.metadata.create_all(bind=engine)
    _add_fingerprint_column()
    _add_product_type_column()
    _add_category_columns()
    _add_newsletter_confirmation_token()


def _add_newsletter_confirmation_token() -> None:
    """Add confirmation_token to newsletter_subscribers if it doesn't exist."""
    cols = _table_column_names("newsletter_subscribers")
    if not cols:
        return
    with engine.connect() as conn:
        if "confirmation_token" not in cols:
            conn.execute(text(
                "ALTER TABLE newsletter_subscribers ADD COLUMN confirmation_token VARCHAR(64)"
            ))
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS ix_newsletter_subscribers_confirmation_token "
                "ON newsletter_subscribers(confirmation_token)"
            ))
            conn.commit()


def _add_fingerprint_column() -> None:
    """Add the fingerprint column to product_offers if it doesn't exist yet."""
    cols = _table_column_names("product_offers")
    if not cols:
        return
    with engine.connect() as conn:
        if "fingerprint" not in cols:
            conn.execute(text(
                "ALTER TABLE product_offers ADD COLUMN fingerprint VARCHAR(500)"
            ))
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS ix_fingerprint ON product_offers(fingerprint)"
            ))
            conn.commit()


def _add_product_type_column() -> None:
    """Add product_type to product_offers if it doesn't exist."""
    cols = _table_column_names("product_offers")
    if not cols:
        return
    with engine.connect() as conn:
        if "product_type" not in cols:
            conn.execute(text(
                "ALTER TABLE product_offers ADD COLUMN product_type VARCHAR(100)"
            ))
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS ix_product_offers_product_type ON product_offers(product_type)"
            ))
            conn.commit()


def _add_category_columns() -> None:
    """Add category_path and category_root to product_offers if they don't exist."""
    cols = _table_column_names("product_offers")
    if not cols:
        return
    with engine.connect() as conn:
        if "category_path" not in cols:
            conn.execute(text(
                "ALTER TABLE product_offers ADD COLUMN category_path VARCHAR(500)"
            ))
            conn.commit()
        cols = _table_column_names("product_offers")
        if "category_root" not in cols:
            conn.execute(text(
                "ALTER TABLE product_offers ADD COLUMN category_root VARCHAR(200)"
            ))
            conn.execute(text(
                "CREATE INDEX IF NOT EXISTS ix_product_offers_category_root ON product_offers(category_root)"
            ))
            conn.commit()


def backfill_fingerprints(batch_size: int = 5000) -> int:
    """Compute fingerprints for all existing rows that lack one.

    Returns the number of rows updated.
    """
    from app.services.normalize import generate_fingerprint

    updated = 0
    with engine.connect() as conn:
        while True:
            rows = conn.execute(
                text(
                    "SELECT id, title, retailer_id, size_text "
                    "FROM product_offers "
                    "WHERE fingerprint IS NULL "
                    "LIMIT :limit"
                ),
                {"limit": batch_size},
            ).fetchall()

            if not rows:
                break

            for row_id, title, retailer_id, size_text in rows:
                fp = generate_fingerprint(title, retailer_id, size_text)
                conn.execute(
                    text("UPDATE product_offers SET fingerprint = :fp WHERE id = :id"),
                    {"fp": fp, "id": row_id},
                )

            conn.commit()
            updated += len(rows)

    return updated


def backfill_product_types(batch_size: int = 5000) -> int:
    """Set product_type for existing offers that have none. Returns number updated."""
    from app.services.product_type import detect_product_type

    updated = 0
    with engine.connect() as conn:
        while True:
            rows = conn.execute(
                text(
                    "SELECT id, title FROM product_offers WHERE product_type IS NULL LIMIT :limit"
                ),
                {"limit": batch_size},
            ).fetchall()
            if not rows:
                break
            for row_id, title in rows:
                pt = detect_product_type(title or "", None)
                conn.execute(
                    text("UPDATE product_offers SET product_type = :pt WHERE id = :id"),
                    {"pt": pt or None, "id": row_id},
                )
            conn.commit()
            updated += len(rows)
    return updated


if __name__ == "__main__":
    create_tables()
    print("Tables created successfully.")
    count = backfill_fingerprints()
    print(f"Backfilled {count} fingerprints.")
    count_pt = backfill_product_types()
    print(f"Backfilled {count_pt} product_type values.")
