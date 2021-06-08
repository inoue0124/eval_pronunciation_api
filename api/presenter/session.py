from api.domain.entity.user import User
from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


async def login(loginRequest: LoginRequest):
    return None


async def logout():
    return None