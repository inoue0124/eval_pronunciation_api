from typing import Generic
from pydantic.fields import T
from pydantic.generics import GenericModel
from pydantic.main import BaseModel
from api.domain.entity.user import User


class SearchResponse(GenericModel, Generic[T]):
    data: list[T]
    count: int

class SessionResponse(BaseModel):
    user: User
    token: str