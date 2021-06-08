from datetime import date
from pydantic import BaseModel


class RegisterLearnerRequest(BaseModel):
    name: str
    gender: int
    birth_date: date
    birth_place: int
    year_of_learning: int


async def register(registerLearnerRequest: RegisterLearnerRequest):
    return None