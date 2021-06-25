import { TeacherSpeech } from './TeacherSpeech'

export interface Unit {
  id: number
  teacher_id: number
  name: string
  teacher_speeches: TeacherSpeech[]
  created_at: string
}
