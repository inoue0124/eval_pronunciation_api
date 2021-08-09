import { TeacherListTable } from '../../../components/teacher/TeacherListTable'
import { SideMenu } from '../../../layout/admin'

const TeacherList: React.FC = () => {
  return (
    <SideMenu>
      <TeacherListTable />
    </SideMenu>
  )
}

export default TeacherList
