from .teacher import TeacherRepository
from .user import UserRepository
from .db.db import session


class Repository:
    def __init__(self):
        self.userRepository = UserRepository(db=session)
        self.teacherRepository = TeacherRepository(db=session)

    def User(self) -> UserRepository:
        return self.userRepository

    def Teacher(self) -> TeacherRepository:
        return self.teacherRepository