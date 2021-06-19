from fastapi.datastructures import UploadFile
from api.domain.entity.learner_speech import LearnerSpeech
from typing import Optional, Protocol, runtime_checkable


@runtime_checkable
class LearnerSpeechRepository(Protocol):
    def __init__(self, db, s3_client):
        ...

    def create(self, learner_speech: LearnerSpeech,
               speech: UploadFile) -> LearnerSpeech:
        ...

    def search(self,
               page: int,
               limit: int,
               search_query: Optional[str],
               is_asc: Optional[bool],
               learner_id: Optional[int] = None) -> list[LearnerSpeech]:
        ...

    def get_by_id(self, learner_speech_id: int) -> LearnerSpeech:
        ...

    def download(self, learner_speech: LearnerSpeech, dest_file: str):
        ...