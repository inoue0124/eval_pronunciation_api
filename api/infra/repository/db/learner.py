from sqlalchemy.orm import relationship
from .db import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from .mixin import TimestampMixin
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp


class LearnerTable(Base, TimestampMixin):
    __tablename__ = 'learners'
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(200), nullable=False)
    gender = Column(Integer)
    birth_date = Column(Timestamp, nullable=False)
    birth_place = Column(Integer)
    year_of_learning = Column(Integer)
    speeches = relationship("LearnerSpeechTable")