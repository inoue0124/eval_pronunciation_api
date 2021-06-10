import sys
from .db import Base
from sqlalchemy import Column, Integer, String
from .mixin import TimestampMixin


class UserTable(Base, TimestampMixin):
    __tablename__ = 'users'
    id = Column('id', Integer, primary_key=True)
    email = Column('email', String(100), nullable=False)
    password = Column('password', String(200), nullable=False)
    type = Column('type', Integer)