from __future__ import annotations

from app.retailers.base import RetailerAdapter
from app.retailers.lidl_lv import LidlLvAdapter
from app.retailers.maxima_lv import MaximaLvAdapter
from app.retailers.rimi_lv import RimiLvAdapter
from app.retailers.top_lv import TopLvAdapter

ALL_ADAPTERS: list[type[RetailerAdapter]] = [
    RimiLvAdapter,
    MaximaLvAdapter,
    TopLvAdapter,
    LidlLvAdapter,
]


def get_all_adapters() -> list[RetailerAdapter]:
    return [cls() for cls in ALL_ADAPTERS]
