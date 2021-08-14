import { LearnerSpeech } from './LearnerSpeech'

export interface Learner {
  user_id: number
  teacher_id: number
  name: string
  gender: string
  birth_date: string
  birth_place: string
  year_of_learning: number
  created_at: string
  speeches: LearnerSpeech[]
  gop_average: number
  dtw_average: number
}
