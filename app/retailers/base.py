from __future__ import annotations

from abc import ABC, abstractmethod

from app.schemas.dto import OfferDTO, RetailerMeta


class RetailerAdapter(ABC):
    """Base class every retailer scraper must implement."""

    @abstractmethod
    def retailer_meta(self) -> RetailerMeta:
        """Return static metadata for this retailer."""
        ...

    @abstractmethod
    def fetch_offers(self) -> list[OfferDTO]:
        """Scrape / fetch current offers and return normalised DTOs."""
        ...
