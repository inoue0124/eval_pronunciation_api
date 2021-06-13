from api.infra.repository.db.user import UserTable
from api.domain.entity.user import User


class UserConverter:
    def convert(self, userTable: UserTable) -> User:
        return User(id=userTable.id,
                    email=userTable.email,
                    password=userTable.password,
                    type=userTable.type,
                    created_at=userTable.created_at)

    def convert_from_list(self, userTables: list[UserTable]) -> list[User]:
        users = []
        for userTable in userTables:
            users.append(self.convert(userTable=userTable))

        return users