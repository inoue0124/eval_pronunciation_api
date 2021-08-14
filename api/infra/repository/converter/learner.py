from api.infra.repository.db.learner import LearnerTable
from api.domain.entity.learner import Learner
from api.domain.entity.learner_speech import LearnerSpeech
from .learner_speech import LearnerSpeechConverter

class LearnerConverter:
    def convert(self, learner_table: LearnerTable) -> Learner:
        learner_speeches: list[LearnerSpeech] = LearnerSpeechConverter(
        ).convert_from_list(learner_speech_tables=learner_table.speeches)
        gop_list = [learner_speech.gop_average for learner_speech in learner_speeches if learner_speech.gop_average is not None]
        dtw_list = [learner_speech.dtw_average for learner_speech in learner_speeches if learner_speech.dtw_average is not None]
        gop_average: float = (sum(gop_list) / len(gop_list)) if len(gop_list) != 0 else None
        dtw_average: float = (sum(dtw_list) / len(dtw_list)) if len(gop_list) != 0 else None

        return Learner(user_id=learner_table.user_id,
                       teacher_id=learner_table.teacher_id,
                       name=learner_table.name,
                       gender=learner_table.gender,
                       birth_date=learner_table.birth_date,
                       birth_place=learner_table.birth_place,
                       year_of_learning=learner_table.year_of_learning,
                       created_at=learner_table.created_at,
                       speeches=learner_speeches,
                       gop_average=gop_average,
                       dtw_average=dtw_average)

    def convert_from_list(self,
                          learner_tables: list[LearnerTable]) -> list[Learner]:
        learners = []
        for learner_table in learner_tables:
            learners.append(self.convert(learner_table=learner_table))

        return learners