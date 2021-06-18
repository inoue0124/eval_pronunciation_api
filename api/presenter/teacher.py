from api.domain.entity.unit import Unit
from datetime import date
from pydantic.main import BaseModel
from api.presenter.request import get_current_uid
from typing import Optional
from fastapi import Depends
from api.domain.repository.repository import Repository
from api.domain.entity.teacher import Teacher
from api.factory import RepositoryFactory
from api.util.errors import AuthError, DbError


class RegisterTeacherRequest(BaseModel):
    name: str
    gender: int
    birth_date: date
    birth_place: int


async def register(registerTeacherRequest: RegisterTeacherRequest,
                   repository: Repository = Depends(RepositoryFactory.create),
                   current_uid=Depends(get_current_uid)):

    # teacherエンティティを作成
    teacher: Teacher = Teacher(user_id=current_uid,
                               name=registerTeacherRequest.name,
                               gender=registerTeacherRequest.gender,
                               birth_date=registerTeacherRequest.birth_date,
                               birth_place=registerTeacherRequest.birth_place)

    try:
        teacher = repository.Teacher().create(teacher=teacher)
    except Exception as e:
        raise DbError(detail=str(e))
    return teacher


async def search(page: int,
                 limit: int,
                 search_query: Optional[str] = None,
                 is_asc: Optional[bool] = True,
                 repository: Repository = Depends(RepositoryFactory.create),
                 _=Depends(get_current_uid)):
    try:
        teachers = repository.Teacher().search(page=page,
                                               limit=limit,
                                               search_query=search_query,
                                               is_asc=is_asc)
    except Exception as e:
        raise DbError(detail=str(e))

    return teachers


async def search_units(teacher_id: int,
                       page: int,
                       limit: int,
                       search_query: Optional[str] = None,
                       is_asc: Optional[bool] = True,
                       repository: Repository = Depends(
                           RepositoryFactory.create),
                       current_uid=Depends(get_current_uid)):

    # 自分のteacher_id以外だったらエラー
    if teacher_id != current_uid:
        raise AuthError

    try:
        units: list[Unit] = repository.Unit().search(page=page,
                                                     limit=limit,
                                                     search_query=search_query,
                                                     is_asc=is_asc,
                                                     teacher_id=teacher_id)
    except Exception as e:
        raise DbError(detail=str(e))

    return units