import { atom } from 'recoil'

export const pitchDataState = atom<string | undefined>({
  key: 'pitchDataState',
  default: '',
})
