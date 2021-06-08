from datetime import date
from api.domain.entity.user import User


class Teacher(User):
    name: str
    gender: int
    birth_date: date
    birth_place: int