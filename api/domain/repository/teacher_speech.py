from fastapi.datastructures import UploadFile
from api.domain.entity.teacher_speech import TeacherSpeech
from typing import Optional, Protocol, runtime_checkable


@runtime_checkable
class TeacherSpeechRepository(Protocol):
    def __init__(self, db, s3_client):
        ...

    def create(self, teacher_speech: TeacherSpeech,
               speech: UploadFile) -> TeacherSpeech:
        ...