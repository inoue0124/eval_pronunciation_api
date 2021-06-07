from api.domain.entity.dtw import Dtw
from api.domain.entity.gop import Gop
from fastapi import FastAPI
from . import learner_speech


def add_routes(app: FastAPI) -> None:
    app.add_api_route("/learners/speeches/{speech_id}/gop",
                      learner_speech.get_gop,
                      methods=["GET"],
                      response_model=Gop)

    app.add_api_route("/learners/speeches/{speech_id}/dtw",
                      learner_speech.get_dtw,
                      methods=["GET"],
                      response_model=Dtw)
