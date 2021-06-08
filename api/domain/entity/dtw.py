from datetime import datetime
from pydantic.main import BaseModel


class Dtw(BaseModel):
    frame_based_mean: float
    created_at: datetime