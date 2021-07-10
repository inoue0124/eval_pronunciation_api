from api.infra.repository.db.learner import LearnerTable
from api.domain.entity.learner import Learner
from typing import Optional
from api.infra.repository.converter.learner import LearnerConverter
from sqlalchemy import desc, asc


class LearnerRepository:
    def __init__(self, db):
        self.db = db

    def create(self, learner: Learner) -> Learner:
        learner_table = LearnerTable()
        learner_table.user_id = learner.user_id
        learner_table.teacher_id = learner.teacher_id
        learner_table.name = learner.name
        learner_table.gender = learner.gender
        learner_table.birth_date = learner.birth_date
        learner_table.birth_place = learner.birth_place
        learner_table.year_of_learning = learner.year_of_learning

        self.db.add(learner_table)
        try:
            self.db.commit()
        except Exception as e:
            self.db.rollback()
            raise e

        # データベースインサート語に確定した値を埋める
        learner.created_at = learner_table.created_at

        return learner

    def search(self,
               page: int,
               limit: int,
               search_query: Optional[str],
               is_asc: Optional[bool],
               teacher_id: Optional[int] = None) -> list[Learner]:
        offset: int = (page - 1) * limit

        query = self.db.query(LearnerTable)

        # 検索ワードがある場合はfilterを追加
        if search_query != None:
            query = query.filter(LearnerTable.name.like(f"%{search_query}%"))

        # teacher_idがある場合はfilterを追加
        if teacher_id != None:
            query = query.filter(LearnerTable.teacher_id == teacher_id)

        # 昇順と降順の切り替え
        if is_asc:
            query = query.order_by(asc(LearnerTable.created_at))
        else:
            query = query.order_by(desc(LearnerTable.created_at))

        learner_tables = query.offset(offset).limit(limit).offset(offset).all()
        count = query.count()

        return LearnerConverter().convert_from_list(
            learner_tables=learner_tables), count

    def get_by_id(self, learner_id: int) -> Learner:
        # ユニットIDからテーブルモデルを取得
        learner_table = self.db.query(LearnerTable).filter(
            LearnerTable.id == learner_id).first()

        # ドメインモデルに変換
        return LearnerConverter().convert(learner_table=learner_table)
