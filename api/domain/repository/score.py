from typing import Protocol, runtime_checkable


@runtime_checkable
class Score(Protocol):
    def compute_gop() -> None:
        ...
