import { useState, useEffect } from 'react'
import { LearnerSpeechListTable } from '../../../components/learner/LearnerSpeechListTable'
import { SideMenu } from '../../../layout/admin'
import { getCookie } from '../../../util/cookie'
import { User } from '../../../types/User'

const LearnerSpeechList: React.FC = () => {
  const [user, setUser] = useState<User>()
  useEffect(() => {
    setUser(JSON.parse(getCookie().logged_user))
  }, [])

  return <SideMenu>{user && <LearnerSpeechListTable isAdmin={true} />}</SideMenu>
}

export default LearnerSpeechList
