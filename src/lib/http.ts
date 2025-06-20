import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { toast } from '@/hooks/use-toast'
import {
  clearAllLocalStorage,
  getAccessTokenFromLocalStorage,
  setProfileFromLocalStorage,
  storeAccessTokenToLocalStorage,
} from '../utils/auth'
import { AuthResponse } from '@/types/auth.type'

// API endpoints configuration
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  // Users
  USERS: {
    PROFILE: (id: number) => `/users/${id}`,
    UPDATE_PROFILE: (id: number) => `/users/${id}`,
    CHANGE_PASSWORD: (id: number) => `/users/${id}/password`,
    UPLOAD_AVATAR: (id: number) => `/users/${id}/avatar`,
  },

  // Medical History
  MEDICAL_HISTORY: {
    GET_ALL: (userId: number) => `/medical-history/user/${userId}`,
    CREATE: '/medical-history',
    UPDATE: (id: number) => `/medical-history/${id}`,
    DELETE: (id: number) => `/medical-history/${id}`,
  },

  // Emergency Contacts
  EMERGENCY_CONTACTS: {
    GET_ALL: (userId: number) => `/emergency-contacts/user/${userId}`,
    CREATE: '/emergency-contacts',
    UPDATE: (id: number) => `/emergency-contacts/${id}`,
    DELETE: (id: number) => `/emergency-contacts/${id}`,
  },

  // Medical Documents
  MEDICAL_DOCUMENTS: {
    GET_ALL: (userId: number) => `/medical-documents/user/${userId}`,
    UPLOAD: '/medical-documents/upload',
    DELETE: (id: number) => `/medical-documents/${id}`,
  },

  // Doctors
  DOCTORS: {
    GET_ALL: '/doctors',
    GET_BY_ID: (id: number) => `/doctors/${id}`,
    SEARCH: '/doctors/search',
    CREATE: '/doctors',
    UPDATE: (id: number) => `/doctors/${id}`,
    DELETE: (id: number) => `/doctors/${id}`,
  },

  // Doctor Schedules
  DOCTOR_SCHEDULES: {
    GET_ALL: (doctorId: number) => `/doctor-schedules/doctor/${doctorId}`,
    CREATE: '/doctor-schedules',
    UPDATE: (id: number) => `/doctor-schedules/${id}`,
    DELETE: (id: number) => `/doctor-schedules/${id}`,
    GET_AVAILABLE: (doctorId: number, date: string) => `/doctor-schedules/doctor/${doctorId}/available?date=${date}`,
  },

  // Appointments
  APPOINTMENTS: {
    GET_ALL: (userId: number) => `/appointments/user/${userId}`,
    GET_BY_ID: (id: number) => `/appointments/${id}`,
    CREATE: '/appointments',
    UPDATE: (id: number) => `/appointments/${id}`,
    CANCEL: (id: number) => `/appointments/${id}/cancel`,
    RESCHEDULE: (id: number) => `/appointments/${id}/reschedule`,
  },

  // Treatment Cycles
  TREATMENT_CYCLES: {
    GET_ALL: (userId: number) => `/treatment-cycles/user/${userId}`,
    GET_BY_ID: (id: number) => `/treatment-cycles/${id}`,
    CREATE: '/treatment-cycles',
    UPDATE: (id: number) => `/treatment-cycles/${id}`,
    DELETE: (id: number) => `/treatment-cycles/${id}`,
    ASSIGN_DOCTOR: (id: number) => `/treatment-cycles/${id}/assign-doctor`,
  },

  // Treatment Services
  TREATMENT_SERVICES: {
    GET_ALL: '/treatment-services',
    GET_BY_ID: (id: number) => `/treatment-services/${id}`,
    CREATE: '/treatment-services',
    UPDATE: (id: number) => `/treatment-services/${id}`,
    DELETE: (id: number) => `/treatment-services/${id}`,
  },

  // Treatment Packages
  TREATMENT_PACKAGES: {
    GET_ALL: '/treatment-packages',
    GET_BY_ID: (id: number) => `/treatment-packages/${id}`,
    CREATE: '/treatment-packages',
    UPDATE: (id: number) => `/treatment-packages/${id}`,
    DELETE: (id: number) => `/treatment-packages/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    GET_ALL: (userId: number) => `/notifications/user/${userId}`,
    MARK_READ: (id: number) => `/notifications/${id}/read`,
    MARK_ALL_READ: (userId: number) => `/notifications/user/${userId}/read-all`,
    CREATE: '/notifications',
  },
}

class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (reason?: unknown) => void
  }> = []

  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    this.refreshToken = localStorage.getItem('refreshToken') || ''

    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7178/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add auth token to requests
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`
        }

        // Add request timestamp for debugging
        ;(config as any).metadata = { requestStartTime: Date.now() }

        // Log request in development
        if (import.meta.env.MODE === 'development') {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            headers: config.headers,
            data: config.data,
          })
        }

        return config
      },
      (error: unknown) => {
        if (import.meta.env.MODE === 'development') {
          console.error('❌ Request error:', error)
        }
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: any) => {
        // Log response in development
        if (import.meta.env.MODE === 'development') {
          const duration = Date.now() - (response.config as any).metadata?.requestStartTime
          console.log(
            `✅ ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`,
            {
              data: response.data,
            }
          )
        }

        const { url } = response.config

        // Handle auth responses
        if (url === '/auth/login' || url === '/auth/register') {
          const data = response.data as AuthResponse
          if (data.success && data.data) {
            this.setTokens(data.data.accessToken, data.data.refreshToken)
            setProfileFromLocalStorage(data.data.user)
          }
        } else if (url === '/auth/refresh') {
          const data = response.data as AuthResponse
          if (data.success && data.data) {
            this.setTokens(data.data.accessToken, data.data.refreshToken)
          }
        } else if (url === '/auth/logout') {
          this.clearTokens()
        }

        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

        // Log error in development
        if (import.meta.env.MODE === 'development') {
          console.error('❌ Response error:', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.message,
            data: error.response?.data,
          })
        }

        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            })
              .then(() => {
                return this.instance(originalRequest)
              })
              .catch((err) => {
                return Promise.reject(err)
              })
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            await this.refreshAccessToken()
            this.processQueue(null)
            return this.instance(originalRequest)
          } catch (refreshError) {
            this.processQueue(refreshError)
            this.handleAuthError()
            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        // Handle other HTTP errors
        this.handleHttpError(error)
        return Promise.reject(error)
      }
    )
  }

  private setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    storeAccessTokenToLocalStorage(accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  private clearTokens() {
    this.accessToken = ''
    this.refreshToken = ''
    clearAllLocalStorage()
  }

  private processQueue(error: unknown) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })

    this.failedQueue = []
  }

  private async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'https://localhost:7178/api'}/auth/refresh`,
        { refreshToken: this.refreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )

      const data = response.data as AuthResponse
      if (data.success && data.data) {
        this.setTokens(data.data.accessToken, data.data.refreshToken)
        return data.data.accessToken
      } else {
        throw new Error('Invalid refresh response')
      }
    } catch (error) {
      this.clearTokens()
      throw error
    }
  }

  private handleAuthError() {
    this.clearTokens()

    // Redirect to login page
    if (window.location.pathname !== '/login') {
      window.location.href = '/login?redirected=true'
    }

    toast({
      title: 'Phiên đăng nhập hết hạn',
      description: 'Vui lòng đăng nhập lại để tiếp tục',
      variant: 'destructive',
    })
  }

  private handleHttpError(error: AxiosError) {
    // Don't show toast for validation errors (422)
    if (error.response?.status === 422) {
      return
    }

    // Don't show toast for certain endpoints
    const silentEndpoints = ['/auth/refresh', '/auth/me']
    const isSilentEndpoint = silentEndpoints.some((endpoint) => error.config?.url?.includes(endpoint))

    if (isSilentEndpoint) {
      return
    }

    // Show error toast
    const errorMessage = this.getErrorMessage(error)
    toast({
      title: 'Lỗi',
      description: errorMessage,
      variant: 'destructive',
    })
  }

  private getErrorMessage(error: AxiosError): string {
    // Network error
    if (!error.response) {
      return 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.'
    }

    // Server error message
    const data = error.response.data as any
    if (data?.message) {
      return data.message
    }

    // HTTP status messages
    switch (error.response.status) {
      case 400:
        return 'Yêu cầu không hợp lệ'
      case 401:
        return 'Bạn cần đăng nhập để thực hiện thao tác này'
      case 403:
        return 'Bạn không có quyền thực hiện thao tác này'
      case 404:
        return 'Không tìm thấy dữ liệu yêu cầu'
      case 409:
        return 'Dữ liệu đã tồn tại hoặc xung đột'
      case 500:
        return 'Lỗi máy chủ. Vui lòng thử lại sau'
      case 502:
        return 'Máy chủ không phản hồi'
      case 503:
        return 'Dịch vụ tạm thời không khả dụng'
      default:
        return 'Có lỗi xảy ra. Vui lòng thử lại'
    }
  }

  // Public method to manually refresh token
  public async forceRefreshToken() {
    return this.refreshAccessToken()
  }

  // Public method to check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.accessToken
  }

  // Public method to get current tokens
  public getTokens() {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    }
  }
}

const http = new Http().instance

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.message) {
    return error.message
  }

  return 'Có lỗi xảy ra. Vui lòng thử lại.'
}

// Response types
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// HTTP client instance
export const httpClient = new Http()

export default http
