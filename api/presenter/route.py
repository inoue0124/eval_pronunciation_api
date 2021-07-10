from api.presenter.response import SearchResponse
from api.domain.entity.learner_speech import LearnerSpeech
from api.domain.entity.unit import Unit
from api.domain.entity.teacher_speech import TeacherSpeech
from api.domain.entity.user import User
from api.domain.entity.dtw import Dtw
from api.domain.entity.gop import Gop
from api.domain.entity.teacher import Teacher
from api.domain.entity.learner import Learner
from fastapi import FastAPI
from api.presenter import learner_speech, session, user, teacher, learner, teacher_speech, unit
from api.util.errors import DbError, error_response


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

    # teacher-speeches
    app.add_api_route("/teacher-speeches",
                      teacher_speech.register,
                      methods=["POST"],
                      response_model=TeacherSpeech,
                      responses=error_response([DbError]),
                      tags=["teacher-speeches"])

    app.add_api_route("/teacher-speeches",
                      teacher_speech.search,
                      methods=["GET"],
                      response_model=SearchResponse[TeacherSpeech],
                      responses=error_response([DbError]),
                      tags=["teacher-speeches"])

    app.add_api_route("/teachers/{teacher_id}/teacher-speeches",
                      teacher_speech.search_by_teacher_id,
                      methods=["GET"],
                      response_model=SearchResponse[TeacherSpeech],
                      responses=error_response([DbError]),
                      tags=["teacher-speeches"])

    app.add_api_route("/teacher-speeches/archive",
                      teacher_speech.download,
                      methods=["POST"],
                      responses=error_response([DbError]),
                      tags=["teacher-speeches"])

    # unit
    app.add_api_route("/units",
                      unit.register,
                      methods=["POST"],
                      response_model=Unit,
                      responses=error_response([DbError]),
                      tags=["units"])

    app.add_api_route("/units",
                      unit.search,
                      methods=["GET"],
                      response_model=SearchResponse[Unit],
                      responses=error_response([DbError]),
                      tags=["units"])

    app.add_api_route("/units/{unit_id}",
                      unit.get_by_id,
                      methods=["GET"],
                      response_model=Unit,
                      responses=error_response([DbError]),
                      tags=["units"])

    app.add_api_route("/units/{unit_id}",
                      unit.update,
                      methods=["PUT"],
                      response_model=Unit,
                      responses=error_response([DbError]),
                      tags=["units"])

    app.add_api_route("/teachers/{teacher_id}/units",
                      unit.search_by_teacher_id,
                      methods=["GET"],
                      response_model=SearchResponse[Unit],
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
                      response_model=SearchResponse[Learner],
                      responses=error_response([DbError]),
                      tags=["learners"])

    app.add_api_route("/teachers/{teacher_id}/learners",
                      learner.search_by_teacher_id,
                      methods=["GET"],
                      response_model=SearchResponse[Learner],
                      responses=error_response([DbError]),
                      tags=["learners"])

    # learner-speeches
    app.add_api_route("/learner-speeches",
                      learner_speech.register,
                      methods=["POST"],
                      response_model=LearnerSpeech,
                      responses=error_response([DbError]),
                      tags=["learner-speeches"])

    app.add_api_route("/learner-speeches",
                      learner_speech.search,
                      methods=["GET"],
                      response_model=list[LearnerSpeech],
                      responses=error_response([DbError]),
                      tags=["learner-speeches"])

    app.add_api_route("/learners/{learner_id}/learner-speeches",
                      learner_speech.search_by_learner_id,
                      methods=["GET"],
                      response_model=list[LearnerSpeech],
                      responses=error_response([DbError]),
                      tags=["learner-speeches"])

    app.add_api_route("/learner-speeches/{learner_speech_id}",
                      learner_speech.get_by_id,
                      methods=["GET"],
                      response_model=LearnerSpeech,
                      responses=error_response([DbError]),
                      tags=["learner-speeches"])

    app.add_api_route("/learner-speeches/archive",
                      learner_speech.download,
                      methods=["POST"],
                      responses=error_response([DbError]),
                      tags=["learner-speeches"])

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
