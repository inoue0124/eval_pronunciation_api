import { atom } from 'recoil'

export const selectedSpeechIdsState = atom<number[]>({
  key: 'selectedSpeechIdsState',
  default: [],
})
