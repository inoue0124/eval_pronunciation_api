from typing import Optional
from fastapi import Depends, HTTPException, status
from datetime import datetime, timedelta
from api.domain.repository.session import LoginRequest
from api.infra.repository.converter.user import UserConverter
from api.domain.entity.user import User
from .db.user import UserTable
from jose import JWTError, jwt

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 7


class SessionRepository():
    def __init__(self, db):
        self.db = db

    def create(self, loginRequest: LoginRequest) -> tuple[User, str]:
        # emailからユーザを取得
        userTable = self.db.query(UserTable).filter(
            UserTable.email == loginRequest.email).first()
        user = UserConverter().convert(userTable=userTable)

        # パスワードが正しいかチェック
        if not user.check_password(loginRequest.password):
            raise ValueError("the password is not correct")

        # jwt tokenを発行
        token = self._create_access_token(data={"sub": user.id})

        return user, token

    def _create_access_token(self, data: dict):
        expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
        data.update({"exp": expire})
        encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt