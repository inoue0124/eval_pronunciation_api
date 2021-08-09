import { LearnerListTable } from '../../../components/learner/LearnerListTable'
import { SideMenu } from '../../../layout/teacher'

const LearnerList: React.FC = () => {
  return (
    <SideMenu>
      <LearnerListTable isAdmin={false} />
    </SideMenu>
  )
}

export default LearnerList
