from typing import Protocol, runtime_checkable
from .user import UserRepository
from .db.db import session


class Repository:
    def __init__(self):
        self.userRepository = UserRepository(db=session)

    def User(self) -> UserRepository:
        return self.userRepository