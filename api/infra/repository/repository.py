from .unit import UnitRepository
from .learner_speech import LearnerSpeechRepository
from .teacher_speech import TeacherSpeechRepository
from .session import SessionRepository
from .teacher import TeacherRepository
from .user import UserRepository
from .learner import LearnerRepository
from .db.db import session
from .aws.s3 import s3_client


class Repository:
    def __init__(self):
        self.sessionRepository = SessionRepository(db=session)
        self.userRepository = UserRepository(db=session)
        self.teacherRepository = TeacherRepository(db=session)
        self.teacherSpeechRepository = TeacherSpeechRepository(
            db=session, s3_client=s3_client)
        self.learnerRepository = LearnerRepository(db=session)
        self.learnerSpeechRepository = LearnerSpeechRepository(
            db=session, s3_client=s3_client)
        self.unitRepository = UnitRepository(db=session)

    def Session(self) -> SessionRepository:
        return self.sessionRepository

    def User(self) -> UserRepository:
        return self.userRepository

    def Teacher(self) -> TeacherRepository:
        return self.teacherRepository

    def TeacherSpeech(self) -> TeacherSpeechRepository:
        return self.teacherSpeechRepository

    def Learner(self) -> LearnerRepository:
        return self.learnerRepository

    def LearnerSpeech(self) -> LearnerSpeechRepository:
        return self.learnerSpeechRepository

    def Unit(self) -> UnitRepository:
        return self.unitRepository