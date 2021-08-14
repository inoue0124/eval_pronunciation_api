import { atom } from 'recoil'

export const pitchDataState = atom<string>({
  key: 'pitchDataState',
  default: '',
})
