import { atom } from 'recoil'

export const unitNameState = atom<string>({
  key: 'unitNameState',
  default: '',
})
