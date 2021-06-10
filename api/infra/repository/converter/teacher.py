from api.infra.repository.db.teacher import TeacherTable
from api.domain.entity.teacher import Teacher


class TeacherConverter:
    def convert(self, teacherTable: TeacherTable) -> Teacher:
        return Teacher(user_id=teacherTable.user_id,
                       name=teacherTable.name,
                       gender=teacherTable.gender,
                       birth_date=teacherTable.birth_date,
                       birth_place=teacherTable.birth_place,
                       created_at=teacherTable.created_at)

    def convert_from_list(self,
                          teacherTables: list[TeacherTable]) -> list[Teacher]:
        teachers = []
        for teacherTable in teacherTables:
            teachers.append(self.convert(teacherTable=teacherTable))

        return teachers