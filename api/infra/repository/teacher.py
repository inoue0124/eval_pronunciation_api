from api.infra.repository.db.teacher import TeacherTable
from pydantic.utils import T
from api.domain.entity.teacher import Teacher


class TeacherRepository:
    def __init__(self, db):
        self.db = db

    def create(self, teacher: Teacher) -> Teacher:
        teacher_table = TeacherTable()
        teacher_table.user_id = teacher.user_id
        teacher_table.name = teacher.name
        teacher_table.gender = teacher.gender
        teacher_table.birth_date = teacher.birth_date
        teacher_table.birth_place = teacher.birth_place

        self.db.add(teacher_table)
        try:
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e

        # データベースインサート語に確定した値を埋める
        teacher.created_at = teacher_table.created_at

        return teacher
