from typing import Protocol, runtime_checkable
from api.domain.entity.teacher import Teacher


@runtime_checkable
class TeacherRepository(Protocol):
    def __init__(self, db):
        ...

    def create(self, teacher: Teacher) -> Teacher:
        ...