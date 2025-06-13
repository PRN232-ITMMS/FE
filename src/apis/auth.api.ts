import { AuthResponse, LoginRequest, RegisterRequest, RefreshTokenRequest, RegisterResponse } from '@/types/auth.type'
import { User } from '@/types/user.type'
import http from '@/utils/http'

const authAPI = {
  // Register new account
  register: (data: RegisterRequest) => http.post<{success: boolean, data: RegisterResponse, message: string}>('/auth/register', data),
  
  // Login
  login: (data: LoginRequest) => http.post<{success: boolean, data: AuthResponse['data'], message: string}>('/auth/login', data),
  
  // Refresh token
  refreshToken: (data: RefreshTokenRequest) => http.post<{success: boolean, data: AuthResponse['data'], message: string}>('/auth/refresh', data),
  
  // Logout
  logout: () => http.post<{success: boolean, data: any, message: string}>('/auth/logout'),
  
  // Get current user info
  getCurrentUser: () => http.get<{success: boolean, data: User, message: string}>('/auth/me'),
}

export default authAPI
