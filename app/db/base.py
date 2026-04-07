from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import StaticPool

from app.core.config import DATABASE_URL

_URL = str(DATABASE_URL)
_is_sqlite = _URL.startswith("sqlite")
_is_sqlite_memory = _is_sqlite and ":memory:" in _URL


def _engine_kwargs() -> dict:
    kw: dict = {"echo": False}
    if _is_sqlite:
        kw["connect_args"] = {"check_same_thread": False}
        if _is_sqlite_memory:
            kw["poolclass"] = StaticPool
    else:
        kw["pool_pre_ping"] = True
        kw["pool_size"] = 5
        kw["max_overflow"] = 10
    return kw


engine = create_engine(DATABASE_URL, **_engine_kwargs())


@event.listens_for(engine, "connect")
def _sqlite_wal(dbapi_conn, connection_record) -> None:
    """Reduce lock contention when the API and ingestion share one SQLite file."""
    if not _is_sqlite:
        return
    cursor = dbapi_conn.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA synchronous=NORMAL")
    cursor.close()


class Base(DeclarativeBase):
    pass
