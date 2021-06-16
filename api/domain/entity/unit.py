from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from .teacher_speech import TeacherSpeech


class Unit(BaseModel):
    id: Optional[int]
    teacher_id: int
    name: str
    teacher_speeches: Optional[list[TeacherSpeech]]
    created_at: Optional[datetime]
