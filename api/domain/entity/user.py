from datetime import datetime
from pydantic import BaseModel
from typing import Optional
import bcrypt


class User(BaseModel):
    id: Optional[int]
    email: str
    password: Optional[str]
    type: int
    created_at: Optional[datetime]

    def set_password(self, password: str) -> None:
        self.password: str = self._generate_hashed_password(password=password)

    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(
            self.password.encode(),
            self._generate_hashed_password(password=password))

    def _generate_hashed_password(self, password: str) -> str:
        return bcrypt.hashpw(password.encode(),
                             bcrypt.gensalt(rounds=10, prefix=b'2a'))
