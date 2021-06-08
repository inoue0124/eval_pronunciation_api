from api.domain.entity.user import User
from api.domain.entity.dtw import Dtw
from api.domain.entity.gop import Gop
from api.domain.entity.teacher import Teacher
from api.domain.entity.learner import Learner
from typing import Union
from fastapi import FastAPI
from api.presenter import learner_speech, session, user, teacher, learner


def add_routes(app: FastAPI) -> None:
    app.add_api_route("/session",
                      session.login,
                      methods=["POST"],
                      response_model=Union[Learner, Teacher],
                      tags=["session"])

    app.add_api_route("/session",
                      session.logout,
                      methods=["DELETE"],
                      response_model=Union[Learner, Teacher],
                      tags=["session"])

    app.add_api_route("/users",
                      user.register,
                      methods=["POST"],
                      response_model=User,
                      tags=["users"])

    app.add_api_route("/teachers",
                      teacher.register,
                      methods=["POST"],
                      response_model=Teacher,
                      tags=["teachers"])

    app.add_api_route("/laerners",
                      learner.register,
                      methods=["POST"],
                      response_model=Learner,
                      tags=["learners"])

    app.add_api_route("/scores/gop",
                      learner_speech.get_gop,
                      methods=["GET"],
                      response_model=Gop,
                      tags=["scores"])

    app.add_api_route("/scores/dtw",
                      learner_speech.get_dtw,
                      methods=["GET"],
                      response_model=Dtw,
                      tags=["scores"])
