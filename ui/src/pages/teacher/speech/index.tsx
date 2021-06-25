import { SpeechListTable } from '../../../components/teacher/speech/SpeechListTable'
import { AddSpeechModal } from '../../../components/teacher/speech/AddSpeechModal'
import { SideMenu } from '../../../layout/teacher'

const SpeechList: React.FC = () => {
  return (
    <SideMenu>
      <div className="mb-1" style={{ textAlign: 'right' }}>
        <AddSpeechModal />
      </div>
      <SpeechListTable />
    </SideMenu>
  )
}

export default SpeechList
