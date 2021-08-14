export interface LearnerSpeech {
  id: number
  learner_id: number
  unit_id: number
  teacher_speech_id: number
  type: number
  object_key: string
  gop_average: number
  dtw_average: number
  gop_seq: string
  pitch_seq: string
  created_at: string
}
