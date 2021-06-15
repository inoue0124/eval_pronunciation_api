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
        self.password: str = bcrypt.hashpw(
            password.encode(), bcrypt.gensalt(rounds=10,
                                              prefix=b'2a')).decode()

    def check_password(self, password: str) -> bool:
        return self.password == bcrypt.hashpw(password.encode(),
                                              self.password.encode()).decode()
