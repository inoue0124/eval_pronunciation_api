from api.presenter.request import get_current_uid
from typing import Optional
from fastapi import Depends
from pydantic import BaseModel
from api.domain.repository.repository import Repository
from api.domain.entity.unit import Unit
from api.factory import RepositoryFactory
from api.util.errors import AuthError, DbError


class RegisterUnitRequest(BaseModel):
    name: str


class UpdateUnitRequest(BaseModel):
    name: Optional[str]
    speech_ids: Optional[list[int]]


async def register(registerUnitRequest: RegisterUnitRequest,
                   repository: Repository = Depends(RepositoryFactory.create),
                   current_uid=Depends(get_current_uid)):

    unit = Unit(teacher_id=current_uid, name=registerUnitRequest.name)
    try:
        unit = repository.Unit().create(unit=unit)
    except Exception as e:
        raise DbError(detail=str(e))

    return unit


async def update(unit_id: int,
                 updateUnitRequest: UpdateUnitRequest,
                 repository: Repository = Depends(RepositoryFactory.create),
                 current_uid=Depends(get_current_uid)):

    # try:
    unit: Unit = repository.Unit().get_by_id(unit_id=unit_id)
    # 自分のteacher_id以外だったらエラー
    # if unit.teacher_id != current_uid:
    #     raise AuthError

    unit.name = updateUnitRequest.name

    unit: Unit = repository.Unit().update(
        unit=unit, speech_ids=updateUnitRequest.speech_ids)
    # except Exception as e:
    #     raise DbError(detail=str(e))

    return unit
