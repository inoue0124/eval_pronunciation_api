from fastapi import Depends
from pydantic import BaseModel
from api.domain.repository.repository import Repository
from api.domain.entity.unit import Unit
from api.factory import RepositoryFactory
from api.util.errors import DbError


class RegisterUnitRequest(BaseModel):
    teacher_id: int
    name: str


async def register(registerUnitRequest: RegisterUnitRequest,
                   repository: Repository = Depends(RepositoryFactory.create)):

    unit = Unit(teacher_id=registerUnitRequest.teacher_id,
                name=registerUnitRequest.name)
    try:
        unit = repository.Unit().create(unit=unit)
    except Exception as e:
        raise DbError(detail=str(e))

    return unit
