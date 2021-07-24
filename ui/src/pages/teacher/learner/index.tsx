import { LearnerListTable } from '../../../components/teacher/learner/LearnerListTable'
import { SideMenu } from '../../../layout/teacher'

const LearnerList: React.FC = () => {
  return (
    <SideMenu>
      <LearnerListTable />
    </SideMenu>
  )
}

export default LearnerList
