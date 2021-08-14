import { atom } from 'recoil'

export const selectedLearnerSpeechIdsState = atom<number[]>({
  key: 'selectedLearnerSpeechIdsState',
  default: [],
})
