from api.infra.repository.db.learner import LearnerTable
from api.domain.entity.learner import Learner


class LearnerConverter:
    def convert(self, learnerTable: LearnerTable) -> Learner:
        return Learner(user_id=learnerTable.user_id,
                       teacher_id=learnerTable.teacher_id,
                       name=learnerTable.name,
                       gender=learnerTable.gender,
                       birth_date=learnerTable.birth_date,
                       birth_place=learnerTable.birth_place,
                       year_of_learning=learnerTable.year_of_learning,
                       created_at=learnerTable.created_at)

    def convert_from_list(self,
                          learnerTables: list[LearnerTable]) -> list[Learner]:
        learners = []
        for learnerTable in learnerTables:
            learners.append(self.convert(learnerTable=learnerTable))

        return learners