from typing import Protocol, runtime_checkable
from api.domain.entity.user import User


@runtime_checkable
class UserRepository(Protocol):
    def __init__(self, db):
        ...

    def create(self, user: User) -> User:
        ...