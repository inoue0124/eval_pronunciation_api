import os, shutil, ffmpeg
from api.util.config import TMP_DOWNLOAD_DIR
from pydantic.main import BaseModel
from typing import Optional
from api.domain.entity.learner_speech import LearnerSpeech
from api.domain.entity.learner import Learner
from api.util.errors import AuthError, DbError, KaldiError
from api.presenter.request import get_current_uid
from api.domain.repository.repository import Repository
from fastapi.datastructures import UploadFile
from fastapi.param_functions import File, Form
from api.domain.entity.dtw import Dtw
from api.domain.entity.gop import Gop
from fastapi import Depends
from api.domain.evaluator import Evaluator
from api.factory import EvaluatorFactory, RepositoryFactory
from concurrent import futures
from fastapi.responses import StreamingResponse
from api.util.config import TMP_DOWNLOAD_DIR
from pathlib import Path
from tempfile import NamedTemporaryFile

class DownloadLearnerSpeechRequest(BaseModel):
    learner_speech_ids: Optional[list[int]]


async def get_gop(evaluator: Evaluator = Depends(EvaluatorFactory.create),
                  text: str = Form(...),
                  speech: UploadFile = File(...)):

    suffix = Path(speech.filename).suffix
    with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(speech.file, tmp)
        stream = ffmpeg.input(tmp.name)
        stream = ffmpeg.output(stream, tmp.name+'.mp3')
        ffmpeg.run(stream)

    try:
        gop: Gop = evaluator.compute_gop(text=text, speech_path=tmp.name+'.mp3')
    except Exception as e:
        raise KaldiError(detail=str(e))

    return gop


async def get_dtw(evaluator: Evaluator = Depends(EvaluatorFactory.create),
                  ref_speech: UploadFile = File(...),
                  speech: UploadFile = File(...)):

    ref_suffix = Path(ref_speech.filename).suffix
    with NamedTemporaryFile(delete=False, suffix=ref_suffix) as ref_tmp:
        shutil.copyfileobj(ref_speech.file, ref_tmp)
        stream = ffmpeg.input(ref_tmp.name)
        stream = ffmpeg.output(stream, ref_tmp.name+'.mp3')
        ffmpeg.run(stream)

    suffix = Path(speech.filename).suffix
    with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        shutil.copyfileobj(speech.file, tmp)
        stream = ffmpeg.input(tmp.name)
        stream = ffmpeg.output(stream, tmp.name+'.mp3')
        ffmpeg.run(stream)

    dtw: Dtw = evaluator.compute_dtw(ref_speech_path=ref_tmp.name+'.mp3', speech_path=tmp.name+'.mp3')
    return dtw


async def register(unit_id: int = Form(...),
                   teacher_speech_id: int = Form(...),
                   type: int = Form(...),
                   speech: UploadFile = File(...),
                   repository: Repository = Depends(RepositoryFactory.create),
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


async def search(page: int,
                 limit: int,
                 search_query: Optional[str] = None,
                 is_asc: Optional[bool] = True,
                 repository: Repository = Depends(RepositoryFactory.create),
                 _=Depends(get_current_uid)):
    try:
        learner_speeches, count = repository.LearnerSpeech(
        ).search(page=page,
                 limit=limit,
                 search_query=search_query,
                 is_asc=is_asc)
    except Exception as e:
        raise DbError(detail=str(e))

    return {"data": learner_speeches, "count": count}


async def search_by_learner_id(learner_id: int,
                               page: int,
                               limit: int,
                               search_query: Optional[str] = None,
                               is_asc: Optional[bool] = True,
                               repository: Repository = Depends(
                                   RepositoryFactory.create),
                               current_uid=Depends(get_current_uid)):

    # 自分のlearner_id or teacher_id以外だったらエラー TODO:バリデーション
    learner: Learner = repository.Learner().get_by_id(learner_id=learner_id)
    if learner.user_id != current_uid and learner.teacher_id != current_uid:
        raise AuthError

    try:
        learner_speeches, count = repository.LearnerSpeech(
        ).search(page=page,
                 limit=limit,
                 search_query=search_query,
                 is_asc=is_asc,
                 learner_id=learner_id)
    except Exception as e:
        raise DbError(detail=str(e))

    return {"data": learner_speeches, "count": count}


async def get_by_id(learner_speech_id: int,
                    repository: Repository = Depends(RepositoryFactory.create),
                    current_uid=Depends(get_current_uid)):

    try:
        learner_speech: LearnerSpeech = repository.LearnerSpeech().get_by_id(
            learner_speech_id=learner_speech_id)
    except Exception as e:
        raise e

    # 自分のlearner_id以外だったらエラー TODO:バリデーション
    if learner_speech.learner_id != current_uid:
        raise AuthError

    return learner_speech


async def download(downloadLearnerSpeechRequest: DownloadLearnerSpeechRequest,
                   repository: Repository = Depends(RepositoryFactory.create),
                   current_uid=Depends(get_current_uid)):

    download_dir = f'{TMP_DOWNLOAD_DIR}/{current_uid}/learner_speech'
    os.makedirs(download_dir, exist_ok=True)

    # downloadリクエスト対象のLearnerSpeechを取得
    try:
        learner_speechs: list[LearnerSpeech] = repository.LearnerSpeech(
        ).list_by_ids(
            learner_speech_ids=downloadLearnerSpeechRequest.learner_speech_ids)
    except Exception as e:
        raise e

    # 一つずつ権限のチェック
    for learner_speech in learner_speechs:
        if learner_speech.learner_id != current_uid:
            raise AuthError

    # 並列でアーカイブの処理をしていく
    future_list = []
    with futures.ThreadPoolExecutor() as executor:
        for learner_speech in learner_speechs:
            if learner_speech.object_key == None:
                continue

            dest_file = download_dir + '/' + learner_speech.object_key.split(
                '/')[-1]
            future = executor.submit(repository.File().download,
                                     object_key=learner_speech.object_key,
                                     dest_file=dest_file)
            future_list.append(future)

        futures.as_completed(fs=future_list)

    # zip化する
    repository.File().create_zip(zipfile_name=download_dir,
                                 src_dir=download_dir)

    shutil.rmtree(download_dir)
    zipfile = open(download_dir + '.zip', mode='rb')
    return StreamingResponse(zipfile, media_type='application/zip')
