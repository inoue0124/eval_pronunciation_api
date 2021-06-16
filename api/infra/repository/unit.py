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
