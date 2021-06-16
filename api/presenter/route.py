from api.domain.entity.user import User
from api.domain.entity.dtw import Dtw
from api.domain.entity.gop import Gop
from api.domain.entity.teacher import Teacher
from api.domain.entity.learner import Learner
from fastapi import FastAPI
from api.presenter import learner_speech, session, user, teacher, learner, teacher_speech, unit
from api.util.errors import DbError, KaldiError, error_response


def add_routes(app: FastAPI) -> None:
    # session
    app.add_api_route("/session",
                      session.login,
                      methods=["POST"],
                      response_model=User,
                      tags=["session"])

    app.add_api_route("/session",
                      session.logout,
                      methods=["DELETE"],
                      response_model=User,
                      tags=["session"])

    # user
    app.add_api_route("/users",
                      user.register,
                      methods=["POST"],
                      response_model=User,
                      responses=error_response([DbError]),
                      tags=["users"])

    # teacher
    app.add_api_route("/teachers",
                      teacher.register,
                      methods=["POST"],
                      response_model=Teacher,
                      responses=error_response([DbError]),
                      tags=["teachers"])

    app.add_api_route("/teachers",
                      teacher.search,
                      methods=["GET"],
                      response_model=list[Teacher],
                      responses=error_response([DbError]),
                      tags=["teachers"])

    app.add_api_route("/teachers/speeches",
                      teacher_speech.register_speech,
                      methods=["POST"],
                      response_model=None,
                      responses=error_response([DbError]),
                      tags=["teachers"])

    # unit
    app.add_api_route("/units",
                      unit.register,
                      methods=["POST"],
                      response_model=None,
                      responses=error_response([DbError]),
                      tags=["units"])

    # learner
    app.add_api_route("/learners",
                      learner.register,
                      methods=["POST"],
                      response_model=Learner,
                      responses=error_response([DbError]),
                      tags=["learners"])

    app.add_api_route("/learners",
                      learner.search,
                      methods=["GET"],
                      response_model=list[Learner],
                      responses=error_response([DbError]),
                      tags=["learners"])

    app.add_api_route("/learners/speeches",
                      learner_speech.register_speech,
                      methods=["POST"],
                      response_model=None,
                      responses=error_response([DbError]),
                      tags=["learners"])

    # score
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
