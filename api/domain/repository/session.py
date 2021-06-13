from typing import Protocol, runtime_checkable
from api.domain.entity.user import User
from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


@runtime_checkable
class SessionRepository(Protocol):
    def __init__(self, db):
        ...

    def create(self, loginRequest: LoginRequest) -> tuple[User, str]:
        ...
