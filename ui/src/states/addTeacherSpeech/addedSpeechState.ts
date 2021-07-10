import { atom } from 'recoil'
import { TeacherSpeech } from '../../types/TeacherSpeech'

export const addedSpeechState = atom<TeacherSpeech | null>({
  key: 'addedSpeechState',
  default: null,
})
