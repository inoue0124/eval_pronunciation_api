import { User } from './User'

export interface SessionResponse {
  user: User
  token: string
}
