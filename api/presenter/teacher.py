from fastapi import Depends
from datetime import date
from pydantic import BaseModel
from api.domain.repository.repository import Repository
from api.domain.entity.teacher import Teacher
from api.factory import RepositoryFactory
from api.util.errors import DbError


async def register(registerTeacherRequest: Teacher,
                   repository: Repository = Depends(RepositoryFactory.create)):
    try:
        teacher = repository.Teacher().create(teacher=registerTeacherRequest)
    except Exception as e:
        raise DbError(detail=str(e))
    return teacher