from sqlalchemy.orm import relationship
from sqlalchemy.sql.schema import ForeignKey
from .db import Base
from sqlalchemy import Column, Integer, String
from .mixin import TimestampMixin
from .unit_teacher_speech import unit_teacher_speech_table


class UnitTable(Base, TimestampMixin):
    __tablename__ = 'units'
    id = Column(Integer, primary_key=True)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(200), nullable=False)
    teacher_speeches = relationship("TeacherSpeechTable",
                                    secondary=unit_teacher_speech_table,
                                    back_populates="units")
