from .db import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from .mixin import TimestampMixin
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp


class TeacherTable(Base, TimestampMixin):
    __tablename__ = 'teachers'
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    name = Column(String(200), nullable=False)
    gender = Column(Integer)
    birth_date = Column(Timestamp, nullable=False)
    birth_place = Column(Integer)