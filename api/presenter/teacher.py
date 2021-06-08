from datetime import date
from pydantic import BaseModel


class RegisterTeacherRequest(BaseModel):
    name: str
    gender: int
    birth_date: date
    birth_place: int


async def register(registerTeacherRequest: RegisterTeacherRequest):
    return None