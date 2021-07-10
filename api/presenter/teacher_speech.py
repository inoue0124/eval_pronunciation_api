from concurrent import futures
import os
import shutil

from starlette.responses import StreamingResponse
from api.util.config import TMP_DOWNLOAD_DIR
from typing import Optional

from pydantic.main import BaseModel
from api.domain.entity.teacher_speech import TeacherSpeech
from api.domain.repository.repository import Repository
from api.presenter.request import get_current_uid
from api.util.errors import AuthError, DbError
from api.factory import RepositoryFactory
from fastapi import Depends, File, UploadFile
from fastapi.param_functions import Form


class DownloadTeacherSpeechRequest(BaseModel):
    teacher_speech_ids: Optional[list[int]]


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
        teacher_speeches, count = repository.TeacherSpeech(
        ).search(page=page,
                 limit=limit,
                 search_query=search_query,
                 is_asc=is_asc)
    except Exception as e:
        raise DbError(detail=str(e))

    return {"data": teacher_speeches, "count": count}


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
        teacher_speeches, count = repository.TeacherSpeech(
        ).search(page=page,
                 limit=limit,
                 search_query=search_query,
                 is_asc=is_asc,
                 teacher_id=teacher_id)
    except Exception as e:
        raise DbError(detail=str(e))

    return {"data": teacher_speeches, "count": count}


async def download(downloadTeacherSpeechRequest: DownloadTeacherSpeechRequest,
                   repository: Repository = Depends(RepositoryFactory.create),
                   current_uid=Depends(get_current_uid)):

    download_dir = f'{TMP_DOWNLOAD_DIR}/{current_uid}/teacher_speech'
    os.makedirs(download_dir, exist_ok=True)

    # downloadリクエスト対象のTeacherSpeechを取得
    try:
        teacher_speechs: list[TeacherSpeech] = repository.TeacherSpeech(
        ).list_by_ids(
            teacher_speech_ids=downloadTeacherSpeechRequest.teacher_speech_ids)
    except Exception as e:
        raise e

    # 一つずつ権限のチェック
    for teacher_speech in teacher_speechs:
        if teacher_speech.teacher_id != current_uid:
            raise AuthError

    # 並列でアーカイブの処理をしていく
    future_list = []
    with futures.ThreadPoolExecutor() as executor:
        for teacher_speech in teacher_speechs:
            if teacher_speech.object_key == None:
                continue

            dest_file = download_dir + '/' + teacher_speech.object_key.split(
                '/')[-1]
            future = executor.submit(repository.File().download,
                                     object_key=teacher_speech.object_key,
                                     dest_file=dest_file)
            future_list.append(future)

        futures.as_completed(fs=future_list)

    # zip化する
    repository.File().create_zip(zipfile_name=download_dir,
                                 src_dir=download_dir)

    shutil.rmtree(download_dir)
    zipfile = open(download_dir + '.zip', mode='rb')
    return StreamingResponse(zipfile, media_type='application/zip')
