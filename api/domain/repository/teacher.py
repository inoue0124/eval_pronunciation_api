from typing import Optional, Protocol, runtime_checkable
from api.domain.entity.teacher import Teacher


@runtime_checkable
class TeacherRepository(Protocol):
    def __init__(self, db):
        ...

    def create(self, teacher: Teacher) -> Teacher:
        ...

    def search(self, page: int, limit: int, search_query: Optional[str],
               is_asc: Optional[bool]) -> list[Teacher]:
        ...