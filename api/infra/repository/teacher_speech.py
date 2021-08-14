from typing import Optional

from sqlalchemy.sql.expression import asc, desc, or_
from api.infra.repository.converter.teacher_speech import TeacherSpeechConverter
from datetime import datetime
from api.util.config import BUCKET_ENDOPOINT, S3_BUCKET_NAME
from api.domain.entity.teacher_speech import TeacherSpeech
from api.infra.repository.db.teacher_speech import TeacherSpeechTable
from fastapi import UploadFile


class TeacherSpeechRepository:
    def __init__(self, db, s3_client):
        self.db = db
        self.s3_client = s3_client

    def create(self, teacher_speech: TeacherSpeech,
               speech_path: str) -> TeacherSpeech:

        # テーブルモデルを作成
        teacher_speech_table = TeacherSpeechTable()
        teacher_speech_table.teacher_id = teacher_speech.teacher_id
        teacher_speech_table.text = teacher_speech.text
        teacher_speech_table.pitch_seq = teacher_speech.pitch_seq

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
        with open(speech_path, 'rb') as speech:
            obj_key = f'teacher_speeches/T{teacher_speech.teacher_id:05}_{teacher_speech.id:05}_{datetime.now():%Y%m%d%H%M%S}.{speech.name.split(".")[-1]}'
            response = self.s3_client.upload_fileobj(
                speech,
                S3_BUCKET_NAME,
                obj_key,
                ExtraArgs={'ContentType': 'audio/mpeg', 'ACL':'public-read'})
        # アップロードに成功したらobj_keyを設定
        teacher_speech.object_key = BUCKET_ENDOPOINT + obj_key
        teacher_speech_table.object_key = BUCKET_ENDOPOINT + obj_key

        # テーブルをアップデート
        try:
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e

        return teacher_speech

    def search(self,
               page: int,
               limit: int,
               search_query: Optional[str],
               is_asc: Optional[bool],
               teacher_id: Optional[int] = None) -> tuple[list[TeacherSpeech], int]:
        offset: int = (page - 1) * limit

        query = self.db.query(TeacherSpeechTable)

        # 検索ワードがある場合はfilterを追加
        if search_query != None:
            query = query.filter(or_(
                TeacherSpeechTable.text.like(f"%{search_query}%"),TeacherSpeechTable.object_key.like(f"%{search_query}%")))

        # teacher_idがある場合はfilterを追加
        if teacher_id != None:
            query = query.filter(TeacherSpeechTable.teacher_id == teacher_id)

        # 昇順と降順の切り替え
        if is_asc:
            query = query.order_by(asc(TeacherSpeechTable.created_at))
        else:
            query = query.order_by(desc(TeacherSpeechTable.created_at))

        teacher_speech_tables = query.offset(offset).limit(limit).offset(
            offset).all()
        count = query.count()

        return TeacherSpeechConverter().convert_from_list(
            teacher_speech_tables=teacher_speech_tables), count

    def list_by_ids(self,
                    teacher_speech_ids: list[int]) -> list[TeacherSpeech]:
        # ユニットIDからテーブルモデルを取得
        teacher_speech_tables = self.db.query(TeacherSpeechTable).filter(
            TeacherSpeechTable.id.in_(teacher_speech_ids)).all()

        # ドメインモデルに変換
        return TeacherSpeechConverter().convert_from_list(
            teacher_speech_tables=teacher_speech_tables)
