from sqlalchemy.sql.expression import text
from sqlalchemy.sql.schema import Table
from .db import Base
from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.dialects.mysql import TIMESTAMP as Timestamp

unit_teacher_speech_table = Table(
    'units_teacher_speeches', Base.metadata,
    Column('unit_id', Integer, ForeignKey("units.id"), nullable=False),
    Column('teacher_speech_id',
           Integer,
           ForeignKey("teacher_speeches.id"),
           nullable=False),
    Column('created_at',
           Timestamp,
           nullable=False,
           server_default=text('current_timestamp')))
