from api.domain.entity.learner_speech import LearnerSpeech
from api.util.errors import DbError
from api.domain.entity.teacher_speech import TeacherSpeech
from api.presenter.request import get_current_uid
from api.domain.repository.repository import Repository
from fastapi.datastructures import UploadFile
from fastapi.param_functions import File, Form
from api.domain.entity.dtw import Dtw
from api.domain.entity.gop import Gop
from fastapi import Depends
from api.domain.evaluator import Evaluator
from api.factory import EvaluatorFactory, RepositoryFactory


async def get_gop(evaluator: Evaluator = Depends(EvaluatorFactory.create)):
    gop: Gop = evaluator.compute_gop()
    return gop


async def get_dtw(evaluator: Evaluator = Depends(EvaluatorFactory.create)):
    dtw: Dtw = evaluator.compute_dtw()
    return dtw


async def register_speech(unit_id: int = Form(...),
                          teacher_speech_id: int = Form(...),
                          type: int = Form(...),
                          speech: UploadFile = File(...),
                          repository: Repository = Depends(
                              RepositoryFactory.create),
                          current_uid=Depends(get_current_uid)):

    learner_speech: LearnerSpeech = LearnerSpeech(
        learner_id=current_uid,
        unit_id=unit_id,
        teacher_speech_id=teacher_speech_id,
        type=type)
    try:
        learner_speech = repository.LearnerSpeech().create(
            learner_speech=learner_speech, speech=speech)
    except Exception as e:
        raise DbError(detail=str(e))

    return learner_speech