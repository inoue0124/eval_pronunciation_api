from .teacher import TeacherRepository
from .user import UserRepository
from .learner import LearnerRepository
from .db.db import session


class Repository:
    def __init__(self):
        self.userRepository = UserRepository(db=session)
        self.teacherRepository = TeacherRepository(db=session)
        self.learnerRepository = LearnerRepository(db=session)

    def User(self) -> UserRepository:
        return self.userRepository

    def Teacher(self) -> TeacherRepository:
        return self.teacherRepository

    def Learner(self) -> LearnerRepository:
        return self.learnerRepository