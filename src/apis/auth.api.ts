import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth.type'
import http from '@/utils/http'

const authAPI = {
  registerAccount: (data: RegisterRequest) => http.post<AuthResponse>('/register', data),
  login: (data: LoginRequest) => http.post<AuthResponse>('/login', data),
  logout: () => http.post<AuthResponse>('/logout'),
}

export default authAPI
