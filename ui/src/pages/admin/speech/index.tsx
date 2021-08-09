import { useState, useEffect } from 'react'
import { TeacherSpeechListTable } from '../../../components/teacher/speech/TeacherSpeechListTable'
import { AddSpeechModal } from '../../../components/teacher/speech/AddSpeechModal'
import { SideMenu } from '../../../layout/admin'
import { getCookie } from '../../../util/cookie'
import { User } from '../../../types/User'

const SpeechList: React.FC = () => {
  const [user, setUser] = useState<User>()
  useEffect(() => {
    setUser(JSON.parse(getCookie().logged_user))
  }, [])

  return (
    <SideMenu>
      <div className="mb-1" style={{ textAlign: 'right' }}>
        <AddSpeechModal />
      </div>
      {user && <TeacherSpeechListTable isAdmin={true} teacherId={user.id} />}
    </SideMenu>
  )
}

export default SpeechList
