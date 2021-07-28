from sqlalchemy.orm import relationship
from .db import Base
from sqlalchemy import Column, Integer, Float, String, ForeignKey
from .mixin import TimestampMixin
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp


class LearnerTable(Base, TimestampMixin):
    __tablename__ = 'learners'
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(200), nullable=False)
    gender = Column(String(200))
    birth_date = Column(Timestamp, nullable=False)
    birth_place = Column(String(200))
    year_of_learning = Column(Float)
    speeches = relationship("LearnerSpeechTable")