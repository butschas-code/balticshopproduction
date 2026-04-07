import logging
import os
import sys
from pathlib import Path

from app.core.config import LOG_LEVEL

_FMT = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
_DATEFMT = "%Y-%m-%d %H:%M:%S"


def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(logging.Formatter(_FMT, datefmt=_DATEFMT))
        logger.addHandler(handler)
    logger.setLevel(getattr(logging, LOG_LEVEL.upper(), logging.INFO))
    return logger


def add_file_handler(log_path: str | Path) -> None:
    """Attach a file handler to the root logger so *all* modules log to file."""
    log_path = Path(log_path)
    log_path.parent.mkdir(parents=True, exist_ok=True)

    root = logging.getLogger()
    if any(
        isinstance(h, logging.FileHandler) and h.baseFilename == str(log_path.resolve())
        for h in root.handlers
    ):
        return

    fh = logging.FileHandler(str(log_path), encoding="utf-8")
    fh.setFormatter(logging.Formatter(_FMT, datefmt=_DATEFMT))
    fh.setLevel(logging.INFO)
    root.addHandler(fh)
    root.setLevel(logging.INFO)
