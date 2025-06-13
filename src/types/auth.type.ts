import { User } from './user.type'
import { SuccessResponse } from './utils.type'

// Auth response from backend
type AuthData = {
  accessToken: string
  refreshToken: string
  user: User
  expiresAt: string
}

export type AuthResponse = SuccessResponse<AuthData>

// Login request
export interface LoginRequest {
  email: string
  password: string
}

// Register request
export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  phoneNumber?: string
  gender?: number // 1=Male, 2=Female, 3=Other
  role: number // 1=Customer, 2=Doctor, 3=Manager, 4=Admin
  address?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  maritalStatus?: string
  occupation?: string
}

// Refresh token request
export interface RefreshTokenRequest {
  refreshToken: string
}

// Register response
export interface RegisterResponse {
  success: boolean
  message: string
}
