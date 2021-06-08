from datetime import date
from api.domain.entity.user import User


class Learner(User):
    name: str
    gender: int
    birth_date: date
    birth_place: int
    year_of_learning: int