from typing import Generic
from pydantic.fields import T
from pydantic.generics import GenericModel


class SearchResponse(GenericModel, Generic[T]):
    data: list[T]
    count: int