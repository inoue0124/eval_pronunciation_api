from api.domain.repository.score import Score


class Gop:
    def __init__(self, score: Score):
        self.score = score

    def get_gop(self):
        self.score.compute_gop()
