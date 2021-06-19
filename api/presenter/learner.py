from api.presenter.request import get_current_uid
from datetime import date
from typing import Optional
from fastapi import Depends
from pydantic.main import BaseModel
from api.domain.repository.repository import Repository
from api.domain.entity.learner import Learner
from api.factory import RepositoryFactory
from api.util.errors import AuthError, DbError


class RegisterLearnerRequest(BaseModel):
    teacher_id: int
    name: str
    gender: int
    birth_date: date
    birth_place: int
    year_of_learning: int


async def register(registerLearnerRequest: RegisterLearnerRequest,
                   repository: Repository = Depends(RepositoryFactory.create),
                   current_uid=Depends(get_current_uid)):
    # learnerエンティティを作成
    learner: Learner = Learner(
        user_id=current_uid,
        teacher_id=registerLearnerRequest.teacher_id,
        name=registerLearnerRequest.name,
        gender=registerLearnerRequest.gender,
        birth_date=registerLearnerRequest.birth_date,
        birth_place=registerLearnerRequest.birth_place,
        year_of_learning=registerLearnerRequest.year_of_learning)

    try:
        learner = repository.Learner().create(learner=learner)
    except Exception as e:
        raise DbError(detail=str(e))
    return learner


async def search(page: int,
                 limit: int,
                 search_query: Optional[str] = None,
                 is_asc: Optional[bool] = True,
                 repository: Repository = Depends(RepositoryFactory.create),
                 _=Depends(get_current_uid)):
    try:
        learners = repository.Learner().search(page=page,
                                               limit=limit,
                                               search_query=search_query,
                                               is_asc=is_asc)
    except Exception as e:
        raise DbError(detail=str(e))

    return learners


async def search_by_teacher_id(teacher_id: int,
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
        units: list[Learner] = repository.Learner().search(
            page=page,
            limit=limit,
            search_query=search_query,
            is_asc=is_asc,
            teacher_id=teacher_id)
    except Exception as e:
        raise DbError(detail=str(e))

    return units