from api.util.config import ALGORITHM, SECRET_KEY
from api.util.errors import AuthError
from fastapi import Depends
from fastapi.security.http import HTTPAuthorizationCredentials, HTTPBearer
from api.domain.entity.user import User
from api.infra.repository.db.user import UserTable
from api.infra.repository.converter.user import UserConverter
from jose import JWTError, jwt


def get_current_uid(cred: HTTPAuthorizationCredentials = Depends(
    HTTPBearer())) -> int:
    try:
        # tokenを検証
        payload = jwt.decode(cred.credentials,
                             SECRET_KEY,
                             algorithms=[ALGORITHM])

        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise AuthError(detail='the token is invalid')

    except JWTError:
        raise AuthError(detail='the token is invalid')

    return user_id
