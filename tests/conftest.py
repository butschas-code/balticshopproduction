"""Pytest fixtures: bypass admin auth and use an isolated SQLite DB per session."""

from __future__ import annotations

import os

# Force test settings before any `app` import (overrides .env for pytest runs).
os.environ["ALLOW_INSECURE_ADMIN"] = "1"
os.environ["APP_DEBUG"] = "false"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def client() -> TestClient:
    from app.db.migrate import create_tables
    from app.main import app

    create_tables()
    with TestClient(app) as c:
        yield c
