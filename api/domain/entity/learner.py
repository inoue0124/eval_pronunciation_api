from datetime import date, datetime
from typing import Optional
from pydantic.main import BaseModel


class Learner(BaseModel):
    user_id: Optional[int]
    teacher_id: Optional[int]
    name: Optional[str]
    gender: Optional[int]
    birth_date: Optional[date]
    birth_place: Optional[int]
    year_of_learning: Optional[int]
    created_at: Optional[datetime]