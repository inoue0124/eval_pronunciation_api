from api.infra.repository.db.learner_speech import LearnerSpeechTable
from api.domain.entity.learner_speech import LearnerSpeech


class LearnerSpeechConverter:
    def convert(self,
                learner_speech_table: LearnerSpeechTable) -> LearnerSpeech:
        return LearnerSpeech(
            id=learner_speech_table.id,
            learner_id=learner_speech_table.learner_id,
            unit_id=learner_speech_table.unit_id,
            teacher_speech_id=learner_speech_table.teacher_speech_id,
            type=learner_speech_table.type,
            object_key=learner_speech_table.object_key,
            gop_average=learner_speech_table.gop_average,
            dtw_average=learner_speech_table.dtw_average,
            gop_seq=learner_speech_table.gop_seq,
            pitch_seq=learner_speech_table.pitch_seq,
            created_at=learner_speech_table.created_at)

    def convert_from_list(
        self, learner_speech_tables: list[LearnerSpeechTable]
    ) -> list[LearnerSpeech]:
        learners = []
        for learner_speech_table in learner_speech_tables:
            learners.append(
                self.convert(learner_speech_table=learner_speech_table))

        return learners