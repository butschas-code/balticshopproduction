"""HTTP smoke tests for the FastAPI app."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient


def test_health_ok(client: TestClient) -> None:
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_root_redirect(client: TestClient) -> None:
    r = client.get("/", follow_redirects=False)
    assert r.status_code == 302
    assert r.headers.get("location") == "/lv/"


def test_home_renders(client: TestClient) -> None:
    r = client.get("/lv/")
    assert r.status_code == 200
    assert "text/html" in r.headers.get("content-type", "")


def test_api_products_search_empty_query(client: TestClient) -> None:
    r = client.get("/api/products/search")
    assert r.status_code == 200
    data = r.json()
    assert data.get("query") == ""
    assert data.get("groups") == []


def test_admin_open_when_insecure_allowed(client: TestClient) -> None:
    r = client.get("/lv/admin")
    assert r.status_code == 200


def test_admin_denied_without_credentials_when_secret_set(
    client: TestClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr("app.core.config.ADMIN_SECRET", "s3cret")
    monkeypatch.setattr("app.core.config.ALLOW_INSECURE_ADMIN", False)
    r = client.get("/lv/admin")
    assert r.status_code == 401


def test_admin_ok_with_bearer_when_secret_set(
    client: TestClient, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr("app.core.config.ADMIN_SECRET", "s3cret")
    monkeypatch.setattr("app.core.config.ALLOW_INSECURE_ADMIN", False)
    r = client.get("/lv/admin", headers={"Authorization": "Bearer s3cret"})
    assert r.status_code == 200
