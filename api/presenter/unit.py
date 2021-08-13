from api.domain.entity.user import User
from api.presenter.request import get_current_uid
from typing import Optional
from fastapi import Depends
from pydantic import BaseModel
from api.domain.repository.repository import Repository
from api.domain.entity.unit import Unit
from api.domain.entity.learner import Learner
from api.factory import RepositoryFactory
from api.util.errors import AuthError, DbError


class RegisterUnitRequest(BaseModel):
    name: str
    speech_ids: Optional[list[int]]


class UpdateUnitRequest(BaseModel):
    name: Optional[str]
    speech_ids: Optional[list[int]]


async def register(registerUnitRequest: RegisterUnitRequest,
                   repository: Repository = Depends(RepositoryFactory.create),
                   current_uid=Depends(get_current_uid)):

    unit = Unit(teacher_id=current_uid, name=registerUnitRequest.name)
    try:
        unit = repository.Unit().create(unit=unit, speech_ids=registerUnitRequest.speech_ids)
    except Exception as e:
        raise DbError(detail=str(e))

    return unit


async def search(page: int,
                 limit: int,
                 search_query: Optional[str] = None,
                 is_asc: Optional[bool] = True,
                 repository: Repository = Depends(RepositoryFactory.create),
                 _=Depends(get_current_uid)):
    try:
        units, count = repository.Unit().search(page=page,
                                                limit=limit,
                                                search_query=search_query,
                                                is_asc=is_asc)
    except Exception as e:
        raise DbError(detail=str(e))

    return {"data": units, "count": count}


async def update(unit_id: int,
                 updateUnitRequest: UpdateUnitRequest,
                 repository: Repository = Depends(RepositoryFactory.create),
                 current_uid=Depends(get_current_uid)):

    try:
        unit: Unit = repository.Unit().get_by_id(unit_id=unit_id)
    except Exception as e:
        raise DbError(detail=str(e))
    # 自分のteacher_id以外だったらエラー
    if unit.teacher_id != current_uid:
        raise AuthError

    # 変更内容を設定
    unit.name = updateUnitRequest.name

    try:
        unit: Unit = repository.Unit().update(
            unit=unit, speech_ids=updateUnitRequest.speech_ids)
    except Exception as e:
        raise DbError(detail=str(e))

    return unit


async def get_by_id(unit_id: int,
                    repository: Repository = Depends(RepositoryFactory.create),
                    current_uid=Depends(get_current_uid)):

    try:
        unit: Unit = repository.Unit().get_by_id(unit_id=unit_id)
    except Exception as e:
        raise e

    # 教師ユーザの場合自分のユニットかどうか、学習者ユーザの場合は自分の教師のユニットかどうかチェック
    user: User = repository.User().get_by_id(user_id=current_uid)
    if user.type == 1:
        if unit.teacher_id != current_uid:
            raise AuthError
    if user.type == 2:
        learner: Learner = repository.Learner().get_by_id(learner_id=current_uid)
        if unit.teacher_id != learner.teacher_id:
            raise AuthError

    return unit


async def search_by_teacher_id(teacher_id: int,
                               page: int,
                               limit: int,
                               search_query: Optional[str] = None,
                               is_asc: Optional[bool] = True,
                               repository: Repository = Depends(
                                   RepositoryFactory.create),
                               current_uid=Depends(get_current_uid)):

    # 自分のteacher_id以外だったらエラー
    user: User = repository.User().get_by_id(user_id=current_uid)
    learner: Learner = repository.Learner().get_by_id(learner_id=current_uid)
    if teacher_id != current_uid and teacher_id != learner.teacher_id and user.type != 0:
        raise AuthError

    try:
        units, count = repository.Unit().search(page=page,
                                                limit=limit,
                                                search_query=search_query,
                                                is_asc=is_asc,
                                                teacher_id=teacher_id)
    except Exception as e:
        raise DbError(detail=str(e))

    return {"data": units, "count": count}