from api.domain.entity.dtw import Dtw
from api.domain.entity.gop import Gop
from fastapi import Depends
from api.domain.evaluator import Evaluator
from api.factory import EvaluatorFactory


async def get_gop(evaluator: Evaluator = Depends(EvaluatorFactory.create)):
    gop: Gop = evaluator.compute_gop()
    return gop


async def get_dtw(evaluator: Evaluator = Depends(EvaluatorFactory.create)):
    dtw: Dtw = evaluator.compute_dtw()
    return dtw
