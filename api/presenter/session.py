from api.domain.repository.session import LoginRequest
from api.util.errors import DbError
from api.factory import RepositoryFactory
from fastapi.param_functions import Depends
from api.domain.repository.repository import Repository
from fastapi import Response


async def login(loginRequest: LoginRequest,
                response: Response,
                repository: Repository = Depends(RepositoryFactory.create)):
    try:
        user, token = repository.Session().create(loginRequest=loginRequest)
    except Exception as e:
        raise DbError(detail=str(e))

    # cookieにjwtを付与
    response.set_cookie(key="token",
                        value=token,
                        max_age=604800,
                        secure=True,
                        httponly=True)
    return user


async def logout(response: Response):
    response.set_cookie(key="token",
                        value="",
                        max_age=0,
                        secure=True,
                        httponly=True)
    return None