"""Vercel serverless entrypoint — exposes the FastAPI ASGI ``app`` instance."""

from app.main import app

__all__ = ["app"]
