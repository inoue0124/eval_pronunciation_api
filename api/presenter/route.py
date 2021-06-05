from fastapi import FastAPI
from . import learner_speech


def add_routes(app: FastAPI) -> None:
    app.add_api_route("/learners/speeches/{speech_id}/gop",
                      learner_speech.get_gop,
                      methods=["GET"],
                      responses=None)
