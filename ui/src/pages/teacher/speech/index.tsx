import { TeacherSpeechListTable } from '../../../components/teacher/speech/TeacherSpeechListTable'
import { AddSpeechModal } from '../../../components/teacher/speech/AddSpeechModal'
import { SideMenu } from '../../../layout/teacher'

const SpeechList: React.FC = () => {
  return (
    <SideMenu>
      <div className="mb-1" style={{ textAlign: 'right' }}>
        <AddSpeechModal />
      </div>
      <TeacherSpeechListTable teacherId={18} />
    </SideMenu>
  )
}

export default SpeechList
