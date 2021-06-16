from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class Unit(BaseModel):
    id: Optional[int]
    teacher_id: int
    name: str
    created_at: Optional[datetime]
