from api.util.jwt import create_access_token
from api.domain.repository.session import LoginRequest
from api.infra.repository.converter.user import UserConverter
from api.domain.entity.user import User
from .db.user import UserTable


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
        token = create_access_token(data={"sub": str(user.id)})

        return user, token