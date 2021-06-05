from typing import Protocol, runtime_checkable


@runtime_checkable
class Evaluator(Protocol):
    def compute_gop() -> None:
        ...

    def compute_dtw() -> None:
        ...