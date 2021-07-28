from api.infra.repository.db.user import UserTable
from api.domain.entity.user import User


class UserConverter:
    def convert(self, user_table: UserTable) -> User:
        return User(id=user_table.id,
                    email=user_table.email,
                    password=user_table.password,
                    type=user_table.type,
                    created_at=user_table.created_at)

    def convert_from_list(self, user_tables: list[UserTable]) -> list[User]:
        users = []
        for user_table in user_tables:
            users.append(self.convert(user_table=user_table))

        return users