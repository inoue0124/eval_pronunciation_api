from api.util.config import TOKEN_COOKIE_NAME
from starlette.responses import Response
from api.domain.repository.session import LoginRequest
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
                   response: Response,
                   repository: Repository = Depends(RepositoryFactory.create)):

    user = User(email=registerUserRequest.email, type=registerUserRequest.type)
    user.set_password(password=registerUserRequest.password)

    try:
        user, token = repository.User().create(user=user)
    except Exception as e:
        raise DbError(detail=str(e))

    # cookieにjwtを付与
    response.set_cookie(key=TOKEN_COOKIE_NAME,
                        value=token,
                        max_age=604800,
                        samesite='none',
                        secure=True)

    return user
