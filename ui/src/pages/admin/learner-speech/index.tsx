import { useState, useEffect } from 'react'
import { LearnerSpeechListTable } from '../../../components/learner/LearnerSpeechListTable'
import { SideMenu } from '../../../layout/admin'
import { getCookie } from '../../../util/cookie'
import { User } from '../../../types/User'
import { UserType } from '../../../types/UserType'

const LearnerSpeechList: React.FC = () => {
  const [user, setUser] = useState<User>()
  useEffect(() => {
    setUser(JSON.parse(getCookie().logged_user))
  }, [])

  return <SideMenu>{user && <LearnerSpeechListTable userType={UserType.Admin} />}</SideMenu>
}

export default LearnerSpeechList
