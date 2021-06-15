from datetime import date
from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class TeacherSpeech(BaseModel):
    id: Optional[int]
    teacher_id: int
    text: str
    object_key: Optional[str]
    created_at: Optional[datetime]
