from .teacher_speech import TeacherSpeechRepository
from typing import Protocol, runtime_checkable
from .teacher import TeacherRepository
from .user import UserRepository
from .learner import LearnerRepository
from .session import SessionRepository


@runtime_checkable
class Repository(Protocol):
    def Session() -> SessionRepository:
        ...

    def User() -> UserRepository:
        ...

    def Teacher() -> TeacherRepository:
        ...

    def TeacherSpeech() -> TeacherSpeechRepository:
        ...

    def Learner() -> LearnerRepository:
        ...