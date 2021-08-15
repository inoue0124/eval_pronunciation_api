from sqlalchemy.orm import relationship
from .db import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.dialects.mysql import MEDIUMTEXT
from .mixin import TimestampMixin


class LearnerSpeechTable(Base, TimestampMixin):
    __tablename__ = 'learner_speeches'
    id = Column(Integer, primary_key=True)
    learner_id = Column(Integer, ForeignKey("learners.user_id"))
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    teacher_speech_id = Column(Integer,
                               ForeignKey("teacher_speeches.id"),
                               nullable=False)
    type = Column(Integer, nullable=False)
    object_key = Column(String(200))
    gop_average = Column(Float)
    dtw_average = Column(Float)
    gop_seq = Column(MEDIUMTEXT)
    pitch_seq = Column(MEDIUMTEXT)