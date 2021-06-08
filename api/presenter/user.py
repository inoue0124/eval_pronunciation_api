from pydantic import BaseModel


class RegisterUserRequest(BaseModel):
    email: str
    password: str


async def register(registerUserRequest: RegisterUserRequest):
    return None