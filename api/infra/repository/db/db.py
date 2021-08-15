from api.util.config import MYSQL_DATABASE, MYSQL_HOST, MYSQL_PASSWORD, MYSQL_USER
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import scoped_session, sessionmaker

DATABASE = 'mysql://%s:%s@%s/%s?charset=utf8mb4' % (
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_HOST,
    MYSQL_DATABASE,
)
engine = create_engine(DATABASE, encoding="utf-8", echo=True, isolation_level="READ UNCOMMITTED")
session = scoped_session(
    sessionmaker(autocommit=True, autoflush=False, bind=engine))
Base = declarative_base()
Base.query = session.query_property()
