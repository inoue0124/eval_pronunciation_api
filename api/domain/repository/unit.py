from typing import Protocol, runtime_checkable
from api.domain.entity.unit import Unit


@runtime_checkable
class UnitRepository(Protocol):
    def __init__(self, db):
        ...

    def create(self, unit: Unit) -> Unit:
        ...