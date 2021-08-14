import { useState, useEffect } from 'react'
import { TeacherSpeechListTable } from '../../../components/speech/TeacherSpeechListTable'
import dynamic from 'next/dynamic'
const AddSpeechModal = dynamic<any>(
  () =>
    import('../../../components/speech/AddSpeechModal').then((modules) => modules.AddSpeechModal),
  { ssr: false },
)
import { SideMenu } from '../../../layout/teacher'
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
      {user && <TeacherSpeechListTable isAdmin={false} teacherId={user.id} />}
    </SideMenu>
  )
}

export default SpeechList
