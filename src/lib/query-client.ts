import { QueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { handleApiError } from '@/lib/http'

// Create query client with global error handling
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401, 403, 404 errors
        if (error?.response?.status === 401 || 
            error?.response?.status === 403 || 
            error?.response?.status === 404) {
          return false
        }
        // Retry up to 3 times for other errors
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
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

// Query keys factory
export const queryKeys = {
  // User related
  profile: (userId: number) => ['profile', userId],
  
  // Medical data
  medicalHistory: (userId: number) => ['medical-history', userId],
  emergencyContacts: (userId: number) => ['emergency-contacts', userId],
  medicalDocuments: (userId: number) => ['medical-documents', userId],
  
  // Doctors
  doctors: () => ['doctors'],
  doctor: (id: number) => ['doctors', id],
  doctorSearch: (query: string) => ['doctors', 'search', query],
  
  // Appointments
  appointments: (userId: number) => ['appointments', userId],
  appointment: (id: number) => ['appointments', id],
  
  // Treatments
  treatments: (userId: number) => ['treatments', userId],
  treatment: (id: number) => ['treatments', id],
  
  // Notifications
  notifications: (userId: number) => ['notifications', userId],
}

// Prefetch utilities
export const prefetchQueries = {
  medicalData: async (userId: number) => {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.medicalHistory(userId),
        queryFn: () => import('@/apis/medical.api').then(api => api.medicalHistoryApi.getAll(userId)),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.emergencyContacts(userId),
        queryFn: () => import('@/apis/medical.api').then(api => api.emergencyContactsApi.getAll(userId)),
      }),
      queryClient.prefetchQuery({
        queryKey: queryKeys.medicalDocuments(userId),
        queryFn: () => import('@/apis/medical.api').then(api => api.medicalDocumentsApi.getAll(userId)),
      }),
    ])
  },
}

// Cache management utilities
export const cacheUtils = {
  // Clear all user data from cache
  clearUserData: (userId: number) => {
    queryClient.removeQueries({ queryKey: ['profile', userId] })
    queryClient.removeQueries({ queryKey: ['medical-history', userId] })
    queryClient.removeQueries({ queryKey: ['emergency-contacts', userId] })
    queryClient.removeQueries({ queryKey: ['medical-documents', userId] })
    queryClient.removeQueries({ queryKey: ['appointments', userId] })
    queryClient.removeQueries({ queryKey: ['treatments', userId] })
    queryClient.removeQueries({ queryKey: ['notifications', userId] })
  },
  
  // Invalidate and refetch user data
  refreshUserData: (userId: number) => {
    queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    queryClient.invalidateQueries({ queryKey: ['medical-history', userId] })
    queryClient.invalidateQueries({ queryKey: ['emergency-contacts', userId] })
    queryClient.invalidateQueries({ queryKey: ['medical-documents', userId] })
  },
  
  // Clear all cache
  clearAll: () => {
    queryClient.clear()
  },
}

export default queryClient
