from typing import Optional, Protocol, runtime_checkable
from api.domain.entity.unit import Unit


@runtime_checkable
class UnitRepository(Protocol):
    def __init__(self, db):
        ...

    def create(self, unit: Unit) -> Unit:
        ...

    def search(self, page: int, limit: int, search_query: Optional[str],
               is_asc: Optional[bool]) -> list[Unit]:
        ...

    def update(self, unit: Unit, speech_ids: list[int]) -> Unit:
        ...

    def get_by_id(self, unit_id: int) -> Unit:
        ...
