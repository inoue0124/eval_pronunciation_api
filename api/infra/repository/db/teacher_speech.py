from sqlalchemy.orm import relationship
from .db import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from .mixin import TimestampMixin
from .unit_teacher_speech import unit_teacher_speech_table


class TeacherSpeechTable(Base, TimestampMixin):
    __tablename__ = 'teacher_speeches'
    id = Column(Integer, primary_key=True)
    teacher_id = Column(Integer, ForeignKey("users.id"))
    text = Column(String(200), nullable=False)
    pitch_seq = Column(MEDIUMTEXT)
    object_key = Column(String(200), nullable=False)
    units = relationship("UnitTable",
                         secondary=unit_teacher_speech_table,
                         back_populates="teacher_speeches")
