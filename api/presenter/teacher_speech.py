from api.domain.entity.teacher_speech import TeacherSpeech
from api.util.config import AWS_ACCESS_KEY, AWS_REGION, AWS_SECRET_KEY, S3_BUCKET_NAME
from fastapi import Depends, File, UploadFile
from api.domain.repository.repository import Repository
from api.presenter.request import get_current_uid
from api.factory import RepositoryFactory
from api.util.errors import DbError


async def register_speech(text: str = File(...),
                          speech: UploadFile = File(...),
                          repository: Repository = Depends(
                              RepositoryFactory.create),
                          current_uid=Depends(get_current_uid)):

    teacher_speech: TeacherSpeech = TeacherSpeech(teacher_id=current_uid,
                                                  text=text)
    try:
        teacher_speech = repository.TeacherSpeech().create(
            teacher_speech=teacher_speech, speech=speech)
    except Exception as e:
        raise DbError(detail=str(e))

    return teacher_speech