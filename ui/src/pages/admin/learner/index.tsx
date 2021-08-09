import { LearnerListTable } from '../../../components/teacher/learner/LearnerListTable'
import { SideMenu } from '../../../layout/admin'

const LearnerList: React.FC = () => {
  return (
    <SideMenu>
      <LearnerListTable isAdmin={true} />
    </SideMenu>
  )
}

export default LearnerList
