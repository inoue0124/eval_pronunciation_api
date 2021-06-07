from api.domain.entity.dtw import Dtw
from api.domain.entity.gop import Gop
from typing import Protocol, runtime_checkable


@runtime_checkable
class Evaluator(Protocol):
    def compute_gop() -> Gop:
        ...

    def compute_dtw() -> Dtw:
        ...