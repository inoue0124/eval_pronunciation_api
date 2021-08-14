import { UserType } from '../types/UserType'
import { getCookie } from './cookie'

export const validateAuth = (userType: number) => {
  try {
    getCookie().EVAL_SPEECH_SESSION
    const user = JSON.parse(getCookie().logged_user)
    if (user.type !== userType) return false
    if (userType === UserType.Teacher) {
      JSON.parse(getCookie().teacher)
    }
    if (userType === UserType.Learner) {
      JSON.parse(getCookie().learner)
    }
    return true
  } catch (e) {
    alert('ログインしていません')
    return false
  }
}
