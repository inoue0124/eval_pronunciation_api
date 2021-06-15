from .db import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from .mixin import TimestampMixin


class TeacherSpeechTable(Base, TimestampMixin):
    __tablename__ = 'teacher_speeches'
    id = Column(Integer, primary_key=True)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    text = Column(String(200), nullable=False)
    object_key = Column(String(200), nullable=False)