from typing import Optional
from fastapi import Depends
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


async def search(page: int,
                 limit: int,
                 search_query: Optional[str] = None,
                 is_asc: Optional[bool] = True,
                 repository: Repository = Depends(RepositoryFactory.create)):
    try:
        teachers = repository.Teacher().search(page=page,
                                               limit=limit,
                                               search_query=search_query,
                                               is_asc=is_asc)
    except Exception as e:
        raise DbError(detail=str(e))

    return teachers