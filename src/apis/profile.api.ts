import http, { API_ENDPOINTS, ApiResponse } from '@/lib/http'
import { User } from '@/types/user.type'

// Profile update DTO
export interface UpdateProfileDto {
  fullName: string
  email: string
  phoneNumber?: string
  gender?: number
  address?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  maritalStatus?: string
  occupation?: string
}

// Change password DTO
export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Avatar upload response
export interface AvatarUploadResponse {
  avatarUrl: string
  message: string
}

export const profileApi = {
  // Get current user profile
  getCurrentProfile: () => http.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME),

  // Update user profile
  updateProfile: (id: number, data: UpdateProfileDto) =>
    http.put<ApiResponse<User>>(API_ENDPOINTS.USERS.UPDATE_PROFILE(id), data),

  // Change password
  changePassword: (id: number, data: ChangePasswordDto) =>
    http.post<ApiResponse<void>>(API_ENDPOINTS.USERS.CHANGE_PASSWORD(id), data),

  // Upload avatar
  uploadAvatar: (id: number, file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return http.post<ApiResponse<AvatarUploadResponse>>(API_ENDPOINTS.USERS.UPLOAD_AVATAR(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // Get user by ID (for admin/doctor to view patient profiles)
  getUserById: (id: number) => http.get<ApiResponse<User>>(API_ENDPOINTS.USERS.PROFILE(id)),

  // Update user status (admin only)
  updateUserStatus: (id: number, isActive: boolean) =>
    http.patch<ApiResponse<User>>(`${API_ENDPOINTS.USERS.PROFILE(id)}/status`, { isActive }),
}

export default profileApi
