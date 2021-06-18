from api.domain.entity.teacher_speech import TeacherSpeech
from api.infra.repository.db.unit import UnitTable
from api.domain.entity.unit import Unit
from .teacher_speech import TeacherSpeechConverter


class UnitConverter:
    def convert(self, unit_table: UnitTable) -> Unit:
        teacher_speeches: list[TeacherSpeech] = TeacherSpeechConverter(
        ).convert_from_list(teacher_speech_tables=unit_table.teacher_speeches)

        return Unit(id=unit_table.id,
                    teacher_id=unit_table.teacher_id,
                    name=unit_table.name,
                    teacher_speeches=teacher_speeches,
                    created_at=unit_table.created_at)

    def convert_from_list(self, unit_tables: list[UnitTable]) -> list[Unit]:
        units = []
        for unit_table in unit_tables:
            units.append(self.convert(unit_table=unit_table))

        return units
