from datetime import datetime
from pydantic import BaseModel


class User(BaseModel):
    id: int
    password: str
    type: int
    created_at: datetime