from api.domain.entity.dtw import Dtw
from api.domain.entity.gop import Gop
from api.domain.entity.teacher import Teacher
from api.domain.entity.learner import Learner
from typing import Union
from fastapi import FastAPI
from api.presenter import learner_speech, session


def add_routes(app: FastAPI) -> None:
    app.add_api_route("/session",
                      session.create_session,
                      methods=["POST"],
                      response_model=Union[Learner, Teacher],
                      tags=["session"])

    app.add_api_route("/learners/speeches/{speech_id}/gop",
                      learner_speech.get_gop,
                      methods=["GET"],
                      response_model=Gop,
                      tags=["scores"])

    app.add_api_route("/learners/speeches/{speech_id}/dtw",
                      learner_speech.get_dtw,
                      methods=["GET"],
                      response_model=Dtw,
                      tags=["scores"])
