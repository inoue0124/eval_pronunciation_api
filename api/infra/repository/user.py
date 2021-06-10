from api.domain.entity.user import User
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

        # データベースインサート語に確定した値を埋める
        user.id = user_table.id
        user.created_at = user_table.created_at

        return user
