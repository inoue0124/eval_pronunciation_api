from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class LearnerSpeech(BaseModel):
    id: Optional[int]
    learner_id: int
    unit_id: int
    teacher_speech_id: int
    type: int
    object_key: Optional[str]
    gop_average: Optional[float]
    gop_file_key: Optional[str]
    dtw_average: Optional[float]
    dtw_file_key: Optional[str]
    created_at: Optional[datetime]
