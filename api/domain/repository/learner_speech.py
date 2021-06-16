from fastapi.datastructures import UploadFile
from api.domain.entity.learner_speech import LearnerSpeech
from typing import Protocol, runtime_checkable


@runtime_checkable
class LearnerSpeechRepository(Protocol):
    def __init__(self, db, s3_client):
        ...

    def create(self, learner_speech: LearnerSpeech,
               speech: UploadFile) -> LearnerSpeech:
        ...