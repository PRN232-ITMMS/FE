import { User } from './user.type'
import { SuccessResponse } from './utils.type'

type AuthData = {
  access_token: string
  refresh_token: string
  expires_refresh_token: number
  expires: number
  user: User
}

export type AuthResponse = SuccessResponse<AuthData>

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  confirm_password: string
}
