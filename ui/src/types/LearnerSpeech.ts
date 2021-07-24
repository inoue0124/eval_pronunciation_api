export interface LearnerSpeech {
  id: number
  learner_id: number
  unit_id: number
  teacher_speech_id: number
  type: number
  object_key: string
  gop_average: number
  gop_file_key: string
  dtw_average: number
  dtw_file_key: string
  created_at: string
}
