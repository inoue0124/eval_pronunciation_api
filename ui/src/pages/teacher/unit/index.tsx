import { UnitListTable } from '../../../components/teacher/unit/UnitListTable'
import { AddSpeechModal } from '../../../components/teacher/speech/AddSpeechModal'
import { SideMenu } from '../../../layout/teacher'

const UnitList: React.FC = () => {
  return (
    <SideMenu>
      <div className="mb-1" style={{ textAlign: 'right' }}>
        <AddSpeechModal />
      </div>
      <UnitListTable />
    </SideMenu>
  )
}

export default UnitList
