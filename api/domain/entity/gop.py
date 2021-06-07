import dataclasses


@dataclasses.dataclass
class Gop:
    sequence: list[float]
    frame_based_mean: float