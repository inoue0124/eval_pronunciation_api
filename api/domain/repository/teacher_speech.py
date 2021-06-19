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

    def search(self,
               page: int,
               limit: int,
               search_query: Optional[str],
               is_asc: Optional[bool],
               teacher_id: Optional[int] = None) -> list[TeacherSpeech]:
        ...

    def list_by_ids(self,
                    teacher_speech_ids: list[int]) -> list[TeacherSpeech]:
        ...
