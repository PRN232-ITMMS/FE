import http, { API_ENDPOINTS } from '@/lib/http'
import { User } from '@/types/user.type'

// Profile API
export const profileApi = {
  // Get user profile
  getProfile: async (userId: number): Promise<User> => {
    const response = await http.get(API_ENDPOINTS.USERS.PROFILE(userId))
    return response.data
  },

  // Update profile
  updateProfile: async (userId: number, data: Partial<User>): Promise<User> => {
    const response = await http.put(API_ENDPOINTS.USERS.UPDATE_PROFILE(userId), data)
    return response.data
  },

  // Change password
  changePassword: async (userId: number, data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await http.put(API_ENDPOINTS.USERS.CHANGE_PASSWORD(userId), data)
  },

  // Upload avatar
  uploadAvatar: async (userId: number, file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await http.post(API_ENDPOINTS.USERS.UPLOAD_AVATAR(userId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete account
  deleteAccount: async (userId: number): Promise<void> => {
    await http.delete(API_ENDPOINTS.USERS.PROFILE(userId))
  },
}
