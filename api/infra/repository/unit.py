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
