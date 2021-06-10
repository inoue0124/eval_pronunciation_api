from typing import Protocol, runtime_checkable
from .teacher import TeacherRepository
from .user import UserRepository
from .learner import LearnerRepository


@runtime_checkable
class Repository(Protocol):
    def User() -> UserRepository:
        ...

    def Teacher() -> TeacherRepository:
        ...

    def Learner() -> LearnerRepository:
        ...