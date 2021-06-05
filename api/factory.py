from api.infra.evaluator import Evaluator


class EvaluatorFactory:
    def create() -> Evaluator:
        return Evaluator()
