import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { notificationApi } from '@/apis/notification.api'
import { queryKeys, optimisticUpdates } from '@/lib/query-client'
import { Notification, NotificationFilterDto } from '@/types/medical.type'

// Notification hooks
export const useNotifications = (userId: number, filters?: NotificationFilterDto) => {
  return useQuery({
    queryKey: queryKeys.notifications.list(userId, filters),
    queryFn: () => notificationApi.getAll(userId, filters),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useUnreadNotificationCount = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(userId),
    queryFn: () => notificationApi.getUnreadCount(userId),
    enabled: !!userId,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

export const useMarkNotificationAsRead = () => {
  // const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onMutate: async (notificationId: number) => {
      // Get current user from some context or store
      const userId = 1 // This should come from auth context

      // Optimistically update
      optimisticUpdates.markNotificationAsRead(userId, notificationId)
    },
    onSuccess: (_updatedNotification: Notification) => {
      toast({
        title: 'Đã đánh dấu đã đọc',
        description: 'Thông báo đã được đánh dấu là đã đọc',
      })
    },
  })
}

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: (_: void, userId: number) => {
      // Update all notifications in cache
      queryClient.setQueryData(queryKeys.notifications.all(userId), (old: any) => {
        if (!old?.data) return old
        return {
          ...old,
          data: old.data.map((notification: Notification) => ({
            ...notification,
            isRead: true,
          })),
        }
      })

      // Reset unread count
      queryClient.setQueryData(queryKeys.notifications.unreadCount(userId), 0)

      toast({
        title: 'Thành công',
        description: 'Đã đánh dấu tất cả thông báo là đã đọc',
      })
    },
  })
}

export const useCreateNotification = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: notificationApi.create,
    onSuccess: (newNotification: Notification) => {
      // Invalidate notifications for the target user
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all(newNotification.userId),
      })

      // Update unread count
      queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.unreadCount(newNotification.userId),
      })

      toast({
        title: 'Thành công',
        description: 'Đã tạo thông báo thành công',
      })
    },
  })
}

// Utility hooks
export const useRecentNotifications = (userId: number, limit = 5) => {
  return useQuery({
    queryKey: ['notifications', 'recent', userId, limit],
    queryFn: () =>
      notificationApi.getAll(userId, {
        page: 1,
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  })
}

export const useUnreadNotifications = (userId: number) => {
  return useQuery({
    queryKey: ['notifications', 'unread', userId],
    queryFn: () =>
      notificationApi.getAll(userId, {
        isRead: false,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    enabled: !!userId,
    staleTime: 30 * 1000,
  })
}
