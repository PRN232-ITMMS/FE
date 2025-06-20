import { AuthResponse, LoginRequest, RegisterRequest, RefreshTokenRequest, RegisterResponse } from '@/types/auth.type'
import { User } from '@/types/user.type'
import http, { API_ENDPOINTS, ApiResponse } from '@/lib/http'

const authAPI = {
  // Register new account
  register: (data: RegisterRequest) => http.post<ApiResponse<RegisterResponse>>(API_ENDPOINTS.AUTH.REGISTER, data),

  // Login
  login: (data: LoginRequest) => http.post<ApiResponse<AuthResponse['data']>>(API_ENDPOINTS.AUTH.LOGIN, data),

  // Refresh token
  refreshToken: (data: RefreshTokenRequest) =>
    http.post<ApiResponse<AuthResponse['data']>>(API_ENDPOINTS.AUTH.REFRESH, data),

  // Logout
  logout: () => http.post<ApiResponse<void>>(API_ENDPOINTS.AUTH.LOGOUT),

  // Get current user info
  getCurrentUser: () => http.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME),

  // Verify token validity
  verifyToken: () => http.get<ApiResponse<{ valid: boolean; expiresAt: string }>>(`${API_ENDPOINTS.AUTH.ME}/verify`),

  // Change password
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    http.post<ApiResponse<void>>(`${API_ENDPOINTS.AUTH.ME}/change-password`, data),

  // Request password reset
  requestPasswordReset: (email: string) =>
    http.post<ApiResponse<void>>(`${API_ENDPOINTS.AUTH.LOGIN}/forgot-password`, { email }),

  // Reset password with token
  resetPassword: (data: { token: string; newPassword: string }) =>
    http.post<ApiResponse<void>>(`${API_ENDPOINTS.AUTH.LOGIN}/reset-password`, data),

  // Validate email
  validateEmail: (token: string) =>
    http.post<ApiResponse<void>>(`${API_ENDPOINTS.AUTH.REGISTER}/validate-email`, { token }),

  // Resend email validation
  resendEmailValidation: (email: string) =>
    http.post<ApiResponse<void>>(`${API_ENDPOINTS.AUTH.REGISTER}/resend-validation`, { email }),
}

export default authAPI
