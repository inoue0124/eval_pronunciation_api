from api.infra.repository.db.teacher_speech import TeacherSpeechTable
from api.domain.entity.teacher_speech import TeacherSpeech


class TeacherSpeechConverter:
    def convert(self,
                teacher_speech_table: TeacherSpeechTable) -> TeacherSpeech:
        return TeacherSpeech(id=teacher_speech_table.id,
                             teacher_id=teacher_speech_table.teacher_id,
                             text=teacher_speech_table.text,
                             object_key=teacher_speech_table.object_key,
                             created_at=teacher_speech_table.created_at)

    def convert_from_list(
        self, teacher_speech_tables: list[TeacherSpeechTable]
    ) -> list[TeacherSpeech]:
        teachers = []
        for teacher_speech_table in teacher_speech_tables:
            teachers.append(
                self.convert(teacher_speech_table=teacher_speech_table))

        return teachers