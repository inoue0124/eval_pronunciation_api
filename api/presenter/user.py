from fastapi import Depends
from pydantic import BaseModel
from api.domain.repository.repository import Repository
from api.domain.entity.user import User
from api.factory import RepositoryFactory
from api.util.errors import DbError


class RegisterUserRequest(BaseModel):
    email: str
    password: str
    type: int


async def register(registerUserRequest: RegisterUserRequest,
                   repository: Repository = Depends(RepositoryFactory.create)):

    user = User(email=registerUserRequest.email, type=registerUserRequest.type)
    user.set_password(password=registerUserRequest.password)
    try:
        user = repository.User().create(user=user)
    except Exception as e:
        raise DbError(detail=str(e))

    return user
