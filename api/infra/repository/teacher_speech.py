from datetime import datetime
from api.util.config import S3_BUCKET_NAME
from api.domain.entity.teacher_speech import TeacherSpeech
from api.infra.repository.db.teacher_speech import TeacherSpeechTable
from fastapi import UploadFile


class TeacherSpeechRepository:
    def __init__(self, db, s3_client):
        self.db = db
        self.s3_client = s3_client

    def create(self, teacher_speech: TeacherSpeech,
               speech: UploadFile) -> TeacherSpeech:

        # テーブルモデルを作成
        teacher_speech_table = TeacherSpeechTable()
        teacher_speech_table.teacher_id = teacher_speech.teacher_id
        teacher_speech_table.text = teacher_speech.text

        # idを得るためにテーブルモデルを一旦保存
        self.db.add(teacher_speech_table)
        try:
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e

        # テーブルモデルをインサート後に確定した値を埋める
        teacher_speech.id = teacher_speech_table.id
        teacher_speech.created_at = teacher_speech_table.created_at

        # 音声ファイルアップロード
        obj_key = f'teacher_speeches/T{teacher_speech.teacher_id:05}_{teacher_speech.id:05}_{datetime.now():%Y%m%d%H%M%S}.{speech.filename.split(".")[-1]}'
        response = self.s3_client.upload_fileobj(
            speech.file,
            S3_BUCKET_NAME,
            obj_key,
            ExtraArgs={'ContentType': speech.content_type})
        # アップロードに成功したらobj_keyを設定
        teacher_speech.object_key = obj_key
        teacher_speech_table.object_key = obj_key

        # テーブルをアップデート
        try:
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e

        return teacher_speech