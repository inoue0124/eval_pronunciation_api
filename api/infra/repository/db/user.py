from .db import Base
from sqlalchemy import Column, Integer, String
from .mixin import TimestampMixin


class UserTable(Base, TimestampMixin):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String(100), nullable=False)
    password = Column(String(200), nullable=False)
    type = Column(Integer)