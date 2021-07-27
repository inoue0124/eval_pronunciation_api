from datetime import date
from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class Teacher(BaseModel):
    user_id: Optional[int]
    name: Optional[str]
    gender: Optional[str]
    birth_date: Optional[date]
    birth_place: Optional[str]
    created_at: Optional[datetime]
