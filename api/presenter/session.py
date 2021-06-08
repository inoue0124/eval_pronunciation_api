from api.domain.entity.user import User
from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


async def create_session(loginRequest: LoginRequest):
    return None
