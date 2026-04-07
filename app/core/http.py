import random
import time

import requests
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import (
    RATE_LIMIT_MAX,
    RATE_LIMIT_MIN,
    REQUEST_TIMEOUT,
    RETRY_COUNT,
    USER_AGENT,
)
from app.core.logging import get_logger

logger = get_logger(__name__)


def get_session() -> requests.Session:
    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": USER_AGENT,
            "Accept-Language": "lv-LV,lv;q=0.9,en;q=0.8",
            "Accept": (
                "text/html,application/xhtml+xml,application/xml;"
                "q=0.9,image/avif,image/webp,*/*;q=0.8"
            ),
        }
    )
    return session


@retry(
    stop=stop_after_attempt(RETRY_COUNT),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)
def fetch_url(session: requests.Session, url: str) -> requests.Response:
    """Fetch *url* with rate-limit jitter, timeout and retries."""
    time.sleep(random.uniform(RATE_LIMIT_MIN, RATE_LIMIT_MAX))
    logger.debug("GET %s", url)
    response = session.get(url, timeout=REQUEST_TIMEOUT)
    response.raise_for_status()
    return response


def fetch_json(session: requests.Session, url: str, **kwargs: object) -> dict:
    """Convenience wrapper that returns parsed JSON."""
    time.sleep(random.uniform(RATE_LIMIT_MIN, RATE_LIMIT_MAX))
    logger.debug("GET (json) %s", url)
    resp = session.get(url, timeout=REQUEST_TIMEOUT, **kwargs)  # type: ignore[arg-type]
    resp.raise_for_status()
    return resp.json()  # type: ignore[no-any-return]
