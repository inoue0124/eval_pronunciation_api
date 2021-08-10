import { useState, useEffect } from 'react'
import { TeacherSpeechListTable } from '../../../components/speech/TeacherSpeechListTable'
import { SideMenu } from '../../../layout/admin'
import { getCookie } from '../../../util/cookie'
import { User } from '../../../types/User'

const TeacherSpeechList: React.FC = () => {
  const [user, setUser] = useState<User>()
  useEffect(() => {
    setUser(JSON.parse(getCookie().logged_user))
  }, [])

  return (
    <SideMenu>{user && <TeacherSpeechListTable isAdmin={true} teacherId={user.id} />}</SideMenu>
  )
}

export default TeacherSpeechList
