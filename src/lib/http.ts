import axios, { AxiosError, AxiosInstance } from 'axios'
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
  },
  
  // Appointments
  APPOINTMENTS: {
    GET_ALL: (userId: number) => `/appointments/user/${userId}`,
    CREATE: '/appointments',
    UPDATE: (id: number) => `/appointments/${id}`,
    CANCEL: (id: number) => `/appointments/${id}/cancel`,
  },
  
  // Treatments
  TREATMENTS: {
    GET_ALL: (userId: number) => `/treatments/user/${userId}`,
    CREATE: '/treatments',
    UPDATE: (id: number) => `/treatments/${id}`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    GET_ALL: (userId: number) => `/notifications/user/${userId}`,
    MARK_READ: (id: number) => `/notifications/${id}/read`,
    MARK_ALL_READ: (userId: number) => `/notifications/user/${userId}/read-all`,
  },
}

class Http {
  instance: AxiosInstance
  private accessToken: string

  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7178/api',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = `Bearer ${this.accessToken}`
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === '/auth/login' || url === '/auth/register') {
          const data = response.data as AuthResponse
          this.accessToken = data.data.accessToken
          storeAccessTokenToLocalStorage(this.accessToken)
          setProfileFromLocalStorage(data.data.user)
          return response
        } else if (url === '/auth/logout') {
          this.accessToken = ''
          clearAllLocalStorage()
          return response
        }
        return response
      },
      (error: AxiosError) => {
        if (error.response?.status !== 422) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data: any = error.response?.data
          const message = data?.message || error.message
          toast({
            title: 'Error',
            description: message,
            variant: 'destructive',
          })
        }
        return Promise.reject(error)
      }
    )
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

export default http
