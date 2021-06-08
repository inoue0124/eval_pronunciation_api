from datetime import datetime
from pydantic.main import BaseModel


class Gop(BaseModel):
    sequence: list[float]
    frame_based_mean: float
    created_at: datetime