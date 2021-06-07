from fastapi import Depends
from api.domain.evaluator import Evaluator
from api.factory import EvaluatorFactory


async def get_gop(evaluator: Evaluator = Depends(EvaluatorFactory.create)):
    gop: float = evaluator.compute_gop()
    return {"gop": gop}
