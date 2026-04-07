"""Gate admin HTML pages and POST /admin/run-ingest behind a shared secret."""

from __future__ import annotations

import base64
import secrets

from fastapi import HTTPException, Request, status

from app.core import config


def verify_admin_request(request: Request) -> None:
    """Require ADMIN_SECRET via Bearer token, X-Admin-Secret, or Basic (admin / secret).

    If ADMIN_SECRET is unset: allow only when ALLOW_INSECURE_ADMIN is true; otherwise 503.
    """
    if not config.ADMIN_SECRET:
        if config.ALLOW_INSECURE_ADMIN:
            return
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Admin is disabled. Set ADMIN_SECRET for production, or "
                "ALLOW_INSECURE_ADMIN=1 for local development only."
            ),
        )

    secret = config.ADMIN_SECRET
    x = (request.headers.get("X-Admin-Secret") or "").strip()
    if x and secrets.compare_digest(x, secret):
        return

    auth = request.headers.get("Authorization") or ""
    if auth.startswith("Bearer "):
        tok = auth[7:].strip()
        if tok and secrets.compare_digest(tok, secret):
            return

    if auth.startswith("Basic "):
        try:
            raw = base64.b64decode(auth[6:].strip()).decode("utf-8")
            user, _, pwd = raw.partition(":")
            if (
                secrets.compare_digest(user, "admin")
                and pwd
                and secrets.compare_digest(pwd, secret)
            ):
                return
        except (ValueError, UnicodeDecodeError):
            pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing admin credentials",
        headers={"WWW-Authenticate": 'Basic realm="Admin"'},
    )


def require_admin(request: Request) -> None:
    verify_admin_request(request)
