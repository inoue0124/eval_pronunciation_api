from typing import Optional

from sqlalchemy.sql.expression import asc, desc
from api.infra.repository.db.teacher_speech import TeacherSpeechTable
from api.infra.repository.converter.unit import UnitConverter
from api.domain.entity.unit import Unit
from .db.unit import UnitTable


class UnitRepository:
    def __init__(self, db):
        self.db = db

    def create(self, unit: Unit) -> Unit:
        unit_table = UnitTable()
        unit_table.name = unit.name
        unit_table.teacher_id = unit.teacher_id

        self.db.add(unit_table)
        try:
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e

        # データベースインサート語に確定した値を埋める
        unit.id = unit_table.id
        unit.created_at = unit_table.created_at

        return unit

    def search(self,
               page: int,
               limit: int,
               search_query: Optional[str],
               is_asc: Optional[bool],
               teacher_id: Optional[int] = None) -> tuple[list[Unit], int]:
        offset: int = (page - 1) * limit

        query = self.db.query(UnitTable)

        # 検索ワードがある場合はfilterを追加
        if search_query != None:
            query = query.filter(UnitTable.name.like(f"%{search_query}%"))

        # teacher_idがある場合はfilterを追加
        if teacher_id != None:
            query = query.filter(UnitTable.teacher_id == teacher_id)

        # 昇順と降順の切り替え
        if is_asc:
            query = query.order_by(asc(UnitTable.created_at))
        else:
            query = query.order_by(desc(UnitTable.created_at))

        unit_tables = query.offset(offset).limit(limit).offset(offset).all()
        count = query.count()

        return UnitConverter().convert_from_list(unit_tables=unit_tables), count

    def update(self, unit: Unit, speech_ids: list[int]) -> Unit:

        # ユニットIDからテーブルモデルを取得
        unit_table: UnitTable = self.db.query(UnitTable).filter(
            UnitTable.id == unit.id).first()
        unit_table.name = unit.name
        teacher_speech_tables: list[TeacherSpeechTable] = self.db.query(
            TeacherSpeechTable).filter(
                TeacherSpeechTable.id.in_(speech_ids)).all()
        unit_table.teacher_speeches = teacher_speech_tables

        try:
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e

        unit = self.get_by_id(unit.id)

        return unit

    def get_by_id(self, unit_id: int) -> Unit:
        # ユニットIDからテーブルモデルを取得
        unit_table = self.db.query(UnitTable).filter(
            UnitTable.id == unit_id).first()

        # ドメインモデルに変換
        return UnitConverter().convert(unit_table=unit_table)
