import { SideMenu } from '../../../layout/teacher'
import { useRouter } from 'next/router'
import { LearnerSpeechListTable } from '../../../components/teacher/learner/LearnerSpeechListTable'
import { Breadcrumbs, Link, Typography } from '@material-ui/core'

const LearnerDetail: React.FC = () => {
  const router = useRouter()
  const learnerId = Number(router.query.id)
  return (
    <SideMenu>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/teacher/learner">
          学習者一覧
        </Link>
        <Typography color="textPrimary">{learnerId}</Typography>
      </Breadcrumbs>
      {router.isReady && <LearnerSpeechListTable learnerId={learnerId} />}
    </SideMenu>
  )
}

export default LearnerDetail
