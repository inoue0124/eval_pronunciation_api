from typing import Optional
from api.domain.entity.teacher_speech import TeacherSpeech
from api.domain.repository.repository import Repository
from api.presenter.request import get_current_uid
from api.util.errors import AuthError, DbError
from api.factory import RepositoryFactory
from fastapi import Depends, File, UploadFile
from fastapi.param_functions import Form


async def register(text: str = Form(...),
                   speech: UploadFile = File(...),
                   repository: Repository = Depends(RepositoryFactory.create),
                   current_uid=Depends(get_current_uid)):

    teacher_speech: TeacherSpeech = TeacherSpeech(teacher_id=current_uid,
                                                  text=text)
    try:
        teacher_speech = repository.TeacherSpeech().create(
            teacher_speech=teacher_speech, speech=speech)
    except Exception as e:
        raise DbError(detail=str(e))

    return teacher_speech


async def search(page: int,
                 limit: int,
                 search_query: Optional[str] = None,
                 is_asc: Optional[bool] = True,
                 repository: Repository = Depends(RepositoryFactory.create),
                 _=Depends(get_current_uid)):
    try:
        teacher_speeches: list[TeacherSpeech] = repository.TeacherSpeech(
        ).search(page=page,
                 limit=limit,
                 search_query=search_query,
                 is_asc=is_asc)
    except Exception as e:
        raise DbError(detail=str(e))

    return teacher_speeches


async def search_by_teacher_id(teacher_id: int,
                               page: int,
                               limit: int,
                               search_query: Optional[str] = None,
                               is_asc: Optional[bool] = True,
                               repository: Repository = Depends(
                                   RepositoryFactory.create),
                               current_uid=Depends(get_current_uid)):

    # 自分のlearner_id or teacher_id以外だったらエラー TODO:バリデーション
    if teacher_id != current_uid:
        raise AuthError

    try:
        teacher_speeches: list[TeacherSpeech] = repository.TeacherSpeech(
        ).search(page=page,
                 limit=limit,
                 search_query=search_query,
                 is_asc=is_asc,
                 teacher_id=teacher_id)
    except Exception as e:
        raise DbError(detail=str(e))

    return teacher_speeches