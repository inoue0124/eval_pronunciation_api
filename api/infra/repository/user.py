from api.util.jwt import create_access_token
from api.domain.entity.user import User
from api.infra.repository.converter.user import UserConverter
from .db.user import UserTable


class UserRepository:
    def __init__(self, db):
        self.db = db

    def create(self, user: User) -> User:
        user_table = UserTable()
        user_table.email = user.email
        user_table.password = user.password
        user_table.type = user.type

        self.db.add(user_table)
        try:
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e

        # データベースインサート後に確定した値を埋める
        user.id = user_table.id
        user.created_at = user_table.created_at

        # jwt tokenを発行
        token = create_access_token(data={"sub": str(user.id)})

        return user, token

    def get_by_id(self, user_id: int) -> User:
        # ユーザIDからテーブルモデルを取得
        user_table = self.db.query(UserTable).filter(
            UserTable.id == user_id).first()

        # ドメインモデルに変換
        return UserConverter().convert(user_table=user_table)
