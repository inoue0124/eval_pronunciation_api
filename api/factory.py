from api.infra.evaluator.evaluator import Evaluator
from api.infra.repository.repository import Repository


class EvaluatorFactory:
    def create() -> Evaluator:
        return Evaluator()


class RepositoryFactory:
    def create() -> Repository:
        return Repository()