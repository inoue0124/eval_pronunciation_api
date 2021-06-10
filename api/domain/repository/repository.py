from typing import Protocol, runtime_checkable
from .user import UserRepository


@runtime_checkable
class Repository(Protocol):
    def User() -> UserRepository:
        ...