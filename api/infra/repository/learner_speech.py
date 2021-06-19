from api.infra.repository.converter.learner_speech import LearnerSpeechConverter
from datetime import datetime
from typing import Optional

from sqlalchemy.sql.expression import asc, desc
from api.util.config import S3_BUCKET_NAME
from api.domain.entity.learner_speech import LearnerSpeech
from api.infra.repository.db.learner_speech import LearnerSpeechTable
from fastapi import UploadFile


class LearnerSpeechRepository:
    def __init__(self, db, s3_client):
        self.db = db
        self.s3_client = s3_client

    def create(self, learner_speech: LearnerSpeech,
               speech: UploadFile) -> LearnerSpeech:

        # テーブルモデルを作成
        learner_speech_table = LearnerSpeechTable()
        learner_speech_table.learner_id = learner_speech.learner_id
        learner_speech_table.unit_id = learner_speech.unit_id
        learner_speech_table.teacher_speech_id = learner_speech.teacher_speech_id
        learner_speech_table.type = learner_speech.type

        # idを得るためにテーブルモデルを一旦保存
        self.db.add(learner_speech_table)
        try:
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e

        # テーブルモデルをインサート後に確定した値を埋める
        learner_speech.id = learner_speech_table.id
        learner_speech.created_at = learner_speech_table.created_at

        # 音声ファイルアップロード
        obj_key = f'learner_speeches/T{learner_speech.learner_id:05}_{learner_speech.id:05}_{datetime.now():%Y%m%d%H%M%S}.{speech.filename.split(".")[-1]}'
        response = self.s3_client.upload_fileobj(
            speech.file,
            S3_BUCKET_NAME,
            obj_key,
            ExtraArgs={'ContentType': speech.content_type})
        # アップロードに成功したらobj_keyを設定
        learner_speech.object_key = obj_key
        learner_speech_table.object_key = obj_key

        # テーブルをアップデート
        try:
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e

        return learner_speech

    def search(self,
               page: int,
               limit: int,
               search_query: Optional[str],
               is_asc: Optional[bool],
               learner_id: Optional[int] = None) -> list[LearnerSpeech]:
        offset: int = (page - 1) * limit

        query = self.db.query(LearnerSpeechTable)

        # 検索ワードがある場合はfilterを追加
        if search_query != None:
            query = query.filter(
                LearnerSpeechTable.object_key.like(f"%{search_query}%"))

        # learner_idがある場合はfilterを追加
        if learner_id != None:
            query = query.filter(LearnerSpeechTable.learner_id == learner_id)

        # 昇順と降順の切り替え
        if is_asc:
            query = query.order_by(asc(LearnerSpeechTable.created_at))
        else:
            query = query.order_by(desc(LearnerSpeechTable.created_at))

        learner_speech_tables = query.offset(offset).limit(limit).offset(
            offset).all()

        return LearnerSpeechConverter().convert_from_list(
            learner_speech_tables=learner_speech_tables)

    def get_by_id(self, learner_speech_id: int) -> LearnerSpeech:
        # ユニットIDからテーブルモデルを取得
        learner_speech_table = self.db.query(LearnerSpeechTable).filter(
            LearnerSpeechTable.id == learner_speech_id).first()

        # ドメインモデルに変換
        return LearnerSpeechConverter().convert(
            learner_speech_table=learner_speech_table)
