from api.infra.repository.db.teacher import TeacherTable
from api.domain.entity.teacher import Teacher
from typing import Optional
from api.infra.repository.converter.teacher import TeacherConverter
from sqlalchemy import desc, asc


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

    def search(self, page: int, limit: int, search_query: Optional[str],
               is_asc: Optional[bool]) -> list[Teacher]:
        offset: int = (page - 1) * limit

        query = self.db.query(TeacherTable)

        # 検索ワードがある場合はfilterを追加
        if search_query != None:
            query = query.filter(TeacherTable.name.like(f"%{search_query}%"))

        # 昇順と降順の切り替え
        if is_asc:
            query = query.order_by(asc(TeacherTable.created_at))
        else:
            query = query.order_by(desc(TeacherTable.created_at))

        teacherTables = query.offset(offset).limit(limit).offset(offset).all()

        return TeacherConverter().convert_from_list(
            teacherTables=teacherTables)
