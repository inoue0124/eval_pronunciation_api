import { TeacherSpeechListTable } from '../../../components/teacher/speech/TeacherSpeechListTable'
import { AddSpeechModal } from '../../../components/teacher/speech/AddSpeechModal'
import { SideMenu } from '../../../layout/teacher'
import { getCookie } from '../../../util/cookie'

const SpeechList: React.FC = () => {
  const user = JSON.parse(getCookie().logged_user)
  return (
    <SideMenu>
      <div className="mb-1" style={{ textAlign: 'right' }}>
        <AddSpeechModal />
      </div>
      <TeacherSpeechListTable teacherId={user.id} />
    </SideMenu>
  )
}

export default SpeechList
