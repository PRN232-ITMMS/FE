import { QueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { handleApiError } from '@/lib/http'

// Create query client with global error handling
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount: number, error: any) => {
        // Don't retry on 401, 403, 404 errors
        if (error?.response?.status === 401 || error?.response?.status === 403 || error?.response?.status === 404) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
      onError: (error: any) => {
        // Global error handling for mutations
        console.error('Mutation error:', error)

        // Don't show toast for validation errors
        if (error?.response?.status === 422) {
          return
        }

        const errorMessage = handleApiError(error)

        toast({
          title: 'Lỗi',
          description: errorMessage,
          variant: 'destructive',
        })
      },
    },
  },
})

// Comprehensive query keys factory
export const queryKeys = {
  // Auth related
  currentUser: () => ['auth', 'current-user'],

  // User related
  profile: (userId: number) => ['users', 'profile', userId],

  // Medical data
  medicalHistory: (userId: number) => ['medical-history', userId],
  emergencyContacts: (userId: number) => ['emergency-contacts', userId],
  medicalDocuments: (userId: number) => ['medical-documents', userId],

  // Doctors
  doctors: {
    all: () => ['doctors'],
    list: (filters?: any) => ['doctors', 'list', filters],
    detail: (id: number) => ['doctors', 'detail', id],
    search: (query: string) => ['doctors', 'search', query],
  },

  // Doctor Schedules
  doctorSchedules: {
    all: (doctorId: number) => ['doctor-schedules', doctorId],
    available: (doctorId: number, date: string) => ['doctor-schedules', 'available', doctorId, date],
  },

  // Appointments
  appointments: {
    all: () => ['appointments'],
    list: (userId: number, filters?: any) => ['appointments', 'list', userId, filters],
    detail: (id: number) => ['appointments', 'detail', id],
    byUser: (userId: number) => ['appointments', 'user', userId],
    byDoctor: (doctorId: number) => ['appointments', 'doctor', doctorId],
  },

  // Treatment Cycles
  treatmentCycles: {
    all: () => ['treatment-cycles'],
    list: (userId: number, filters?: any) => ['treatment-cycles', 'list', userId, filters],
    detail: (id: number) => ['treatment-cycles', 'detail', id],
    byUser: (userId: number) => ['treatment-cycles', 'user', userId],
    byDoctor: (doctorId: number) => ['treatment-cycles', 'doctor', doctorId],
  },

  // Treatment Services
  treatmentServices: {
    all: () => ['treatment-services'],
    list: (filters?: any) => ['treatment-services', 'list', filters],
    detail: (id: number) => ['treatment-services', 'detail', id],
  },

  // Treatment Packages
  treatmentPackages: {
    all: () => ['treatment-packages'],
    list: (filters?: any) => ['treatment-packages', 'list', filters],
    detail: (id: number) => ['treatment-packages', 'detail', id],
  },

  // Notifications
  notifications: {
    all: (userId: number) => ['notifications', userId],
    list: (userId: number, filters?: any) => ['notifications', 'list', userId, filters],
    unreadCount: (userId: number) => ['notifications', 'unread-count', userId],
  },
}

// Prefetch utilities for common data combinations
export const prefetchQueries = {
  // Prefetch all medical data for a user
  medicalData: async (userId: number) => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.medicalHistory(userId),
        queryFn: () => import('@/apis/medical.api').then((api) => api.medicalHistoryApi.getAll(userId)),
        staleTime: 10 * 60 * 1000, // 10 minutes
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.emergencyContacts(userId),
        queryFn: () => import('@/apis/medical.api').then((api) => api.emergencyContactsApi.getAll(userId)),
        staleTime: 10 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.medicalDocuments(userId),
        queryFn: () => import('@/apis/medical.api').then((api) => api.medicalDocumentsApi.getAll(userId)),
        staleTime: 5 * 60 * 1000, // 5 minutes for documents
      }),
    ])
  },

  // Prefetch appointment-related data
  appointmentData: async (userId: number) => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.appointments.byUser(userId),
        queryFn: () => import('@/apis/appointment.api').then((api) => api.appointmentApi.getAll(userId)),
        staleTime: 2 * 60 * 1000, // 2 minutes for appointments
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.doctors.all(),
        queryFn: () => import('@/apis/doctor.api').then((api) => api.doctorApi.getAll()),
        staleTime: 15 * 60 * 1000, // 15 minutes for doctors
      }),
    ])
  },

  // Prefetch treatment data
  treatmentData: async (userId: number) => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.treatmentCycles.byUser(userId),
        queryFn: () => import('@/apis/treatment.api').then((api) => api.treatmentCycleApi.getAll(userId)),
        staleTime: 5 * 60 * 1000,
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.treatmentServices.all(),
        queryFn: () => import('@/apis/treatment.api').then((api) => api.treatmentServiceApi.getAll()),
        staleTime: 30 * 60 * 1000, // 30 minutes for services
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.treatmentPackages.all(),
        queryFn: () => import('@/apis/treatment.api').then((api) => api.treatmentPackageApi.getAll()),
        staleTime: 30 * 60 * 1000,
      }),
    ])
  },
}

// Cache management utilities
export const cacheUtils = {
  // Clear all user-specific data from cache
  clearUserData: (userId: number) => {
    queryClient.removeQueries({ queryKey: ['users', 'profile', userId] })
    queryClient.removeQueries({ queryKey: ['medical-history', userId] })
    queryClient.removeQueries({ queryKey: ['emergency-contacts', userId] })
    queryClient.removeQueries({ queryKey: ['medical-documents', userId] })
    queryClient.removeQueries({ queryKey: ['appointments', 'user', userId] })
    queryClient.removeQueries({ queryKey: ['treatment-cycles', 'user', userId] })
    queryClient.removeQueries({ queryKey: ['notifications', userId] })
  },

  // Invalidate and refetch user data
  refreshUserData: (userId: number) => {
    queryClient.invalidateQueries({ queryKey: ['users', 'profile', userId] })
    queryClient.invalidateQueries({ queryKey: ['medical-history', userId] })
    queryClient.invalidateQueries({ queryKey: ['emergency-contacts', userId] })
    queryClient.invalidateQueries({ queryKey: ['medical-documents', userId] })
    queryClient.invalidateQueries({ queryKey: ['appointments', 'user', userId] })
    queryClient.invalidateQueries({ queryKey: ['treatment-cycles', 'user', userId] })
    queryClient.invalidateQueries({ queryKey: ['notifications', userId] })
  },

  // Refresh appointments data
  refreshAppointments: (userId?: number) => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ['appointments', 'user', userId] })
    } else {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    }
  },

  // Refresh treatment data
  refreshTreatments: (userId?: number) => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ['treatment-cycles', 'user', userId] })
    } else {
      queryClient.invalidateQueries({ queryKey: ['treatment-cycles'] })
    }
  },

  // Refresh doctor data
  refreshDoctors: () => {
    queryClient.invalidateQueries({ queryKey: ['doctors'] })
    queryClient.invalidateQueries({ queryKey: ['doctor-schedules'] })
  },

  // Refresh notifications
  refreshNotifications: (userId: number) => {
    queryClient.invalidateQueries({ queryKey: ['notifications', userId] })
    queryClient.invalidateQueries({ queryKey: ['notifications', 'unread-count', userId] })
  },

  // Clear all cache
  clearAll: () => {
    queryClient.clear()
  },

  // Remove queries by pattern
  removeQueriesByPattern: (pattern: string[]) => {
    queryClient.removeQueries({ queryKey: pattern })
  },

  // Set query data manually
  setQueryData: <T>(key: any[], data: T) => {
    queryClient.setQueryData(key, data)
  },

  // Get query data
  getQueryData: <T>(key: any[]): T | undefined => {
    return queryClient.getQueryData<T>(key)
  },
}

// Optimistic update utilities
export const optimisticUpdates = {
  // Update appointment optimistically
  updateAppointment: (appointmentId: number, updates: any) => {
    const queryKey = queryKeys.appointments.detail(appointmentId)

    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return old
      return { ...old, ...updates }
    })
  },

  // Update treatment cycle optimistically
  updateTreatmentCycle: (cycleId: number, updates: any) => {
    const queryKey = queryKeys.treatmentCycles.detail(cycleId)

    queryClient.setQueryData(queryKey, (old: any) => {
      if (!old) return old
      return { ...old, ...updates }
    })
  },

  // Mark notification as read optimistically
  markNotificationAsRead: (userId: number, notificationId: number) => {
    const listQueryKey = queryKeys.notifications.all(userId)
    const countQueryKey = queryKeys.notifications.unreadCount(userId)

    // Update notification list
    queryClient.setQueryData(listQueryKey, (old: any) => {
      if (!old?.data) return old
      return {
        ...old,
        data: old.data.map((notification: any) =>
          notification.id === notificationId ? { ...notification, isRead: true } : notification
        ),
      }
    })

    // Update unread count
    queryClient.setQueryData(countQueryKey, (old: number) => {
      return Math.max(0, (old || 0) - 1)
    })
  },
}

export default queryClient
