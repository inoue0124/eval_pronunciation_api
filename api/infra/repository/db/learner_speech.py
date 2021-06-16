from api.infra.repository.db.unit import UnitTable
from .db import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Float
from .mixin import TimestampMixin


class LearnerSpeechTable(Base, TimestampMixin):
    __tablename__ = 'learner_speeches'
    id = Column(Integer, primary_key=True)
    learner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    teacher_speech_id = Column(Integer,
                               ForeignKey("teacher_speeches.id"),
                               nullable=False)
    type = Column(Integer, nullable=False)
    object_key = Column(String(200))
    gop_average = Column(Float)
    gop_file_key = Column(String(200))
    dtw_average = Column(Float)
    dtw_file_key = Column(String(200))