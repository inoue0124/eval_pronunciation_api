from typing import Optional, Protocol, runtime_checkable
from api.domain.entity.learner import Learner


@runtime_checkable
class LearnerRepository(Protocol):
    def __init__(self, db):
        ...

    def create(self, learner: Learner) -> Learner:
        ...

    def search(self,
               page: int,
               limit: int,
               search_query: Optional[str],
               is_asc: Optional[bool],
               teacher_id: Optional[int] = None) -> list[Learner]:
        ...

    def get_by_id(self, learner_id: int) -> Learner:
        ...