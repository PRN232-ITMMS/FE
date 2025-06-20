import http, { API_ENDPOINTS, ApiResponse, PaginatedResponse } from '@/lib/http'
import { Notification, CreateNotificationDto, NotificationFilterDto } from '@/types/medical.type'

// Notification API service
export const notificationApi = {
  // Get all notifications for a user
  getAll: async (userId: number, filters?: NotificationFilterDto): Promise<PaginatedResponse<Notification>> => {
    const params = new URLSearchParams()

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'dateRange' && typeof value === 'object') {
            const dateRange = value as any
            if (dateRange.startDate) params.append('startDate', dateRange.startDate)
            if (dateRange.endDate) params.append('endDate', dateRange.endDate)
          } else {
            params.append(key, String(value))
          }
        }
      })
    }

    const queryString = params.toString()
    const url = queryString
      ? `${API_ENDPOINTS.NOTIFICATIONS.GET_ALL(userId)}?${queryString}`
      : API_ENDPOINTS.NOTIFICATIONS.GET_ALL(userId)

    const response = await http.get<ApiResponse<PaginatedResponse<Notification>>>(url)
    return response.data.data
  },

  // Mark notification as read
  markAsRead: async (id: number): Promise<Notification> => {
    const response = await http.patch<ApiResponse<Notification>>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id))
    return response.data.data
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (userId: number): Promise<void> => {
    await http.patch<ApiResponse<void>>(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ(userId))
  },

  // Create new notification (admin only)
  create: async (data: CreateNotificationDto): Promise<Notification> => {
    const response = await http.post<ApiResponse<Notification>>(API_ENDPOINTS.NOTIFICATIONS.CREATE, data)
    return response.data.data
  },

  // Get unread count for a user
  getUnreadCount: async (userId: number): Promise<number> => {
    const response = await http.get<ApiResponse<{ count: number }>>(
      `${API_ENDPOINTS.NOTIFICATIONS.GET_ALL(userId)}/unread-count`
    )
    return response.data.data.count
  },
}

export default { notificationApi }
