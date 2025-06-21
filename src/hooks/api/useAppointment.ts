import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { appointmentApi } from '@/apis/appointment.api'
import { queryKeys, optimisticUpdates } from '@/lib/query-client'
import {
  Appointment,
  AppointmentFilterDto,
  UpdateAppointmentDto,
  RescheduleAppointmentDto,
  AppointmentStatus,
} from '@/types/medical.type'

// Appointment hooks
export const useAppointments = (userId: number, filters?: AppointmentFilterDto) => {
  return useQuery({
    queryKey: queryKeys.appointments.list(userId, filters),
    queryFn: () => appointmentApi.getAll(userId, filters),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useAppointment = (id: number) => {
  return useQuery({
    queryKey: queryKeys.appointments.detail(id),
    queryFn: () => appointmentApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: appointmentApi.create,
    onSuccess: (newAppointment: Appointment) => {
      // Add to cache
      queryClient.setQueryData(queryKeys.appointments.detail(newAppointment.id), newAppointment)

      // Invalidate appointments list
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.byUser(newAppointment.customerId),
      })

      // Invalidate doctor availability
      queryClient.invalidateQueries({
        queryKey: ['doctor-schedules', 'available', newAppointment.doctorId],
      })

      toast({
        title: 'Thành công',
        description: 'Đã đặt lịch hẹn thành công',
      })
    },
  })
}

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAppointmentDto }) => appointmentApi.update(id, data),
    onMutate: async ({ id, data }: { id: number; data: UpdateAppointmentDto }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.appointments.detail(id) })

      // Snapshot previous value
      const previousAppointment = queryClient.getQueryData(queryKeys.appointments.detail(id)) as Appointment | undefined

      // Optimistically update
      optimisticUpdates.updateAppointment(id, data)

      return { previousAppointment }
    },
    onError: (_err: unknown, { id }: { id: number }, context?: { previousAppointment?: Appointment }) => {
      // Rollback on error
      if (context?.previousAppointment) {
        queryClient.setQueryData(queryKeys.appointments.detail(id), context.previousAppointment)
      }
    },
    onSuccess: (updatedAppointment: Appointment) => {
      // Update cache with real data
      queryClient.setQueryData(queryKeys.appointments.detail(updatedAppointment.id), updatedAppointment)

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.byUser(updatedAppointment.customerId),
      })

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật lịch hẹn thành công',
      })
    },
  })
}

export const useCancelAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => appointmentApi.cancel(id, reason),
    onMutate: async ({ id }: { id: number }) => {
      // Optimistically update status
      optimisticUpdates.updateAppointment(id, { status: AppointmentStatus.CANCELLED })
    },
    onSuccess: (cancelledAppointment: Appointment) => {
      // Update cache
      queryClient.setQueryData(queryKeys.appointments.detail(cancelledAppointment.id), cancelledAppointment)

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.byUser(cancelledAppointment.customerId),
      })

      // Refresh doctor availability
      queryClient.invalidateQueries({
        queryKey: ['doctor-schedules', 'available', cancelledAppointment.doctorId],
      })

      toast({
        title: 'Thành công',
        description: 'Đã hủy lịch hẹn thành công',
      })
    },
  })
}

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RescheduleAppointmentDto }) => appointmentApi.reschedule(id, data),
    onMutate: async ({ id, data }: { id: number; data: RescheduleAppointmentDto }) => {
      // Optimistically update
      optimisticUpdates.updateAppointment(id, {
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        status: AppointmentStatus.RESCHEDULED,
      })
    },
    onSuccess: (rescheduledAppointment: Appointment) => {
      // Update cache
      queryClient.setQueryData(queryKeys.appointments.detail(rescheduledAppointment.id), rescheduledAppointment)

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.appointments.byUser(rescheduledAppointment.customerId),
      })

      // Refresh doctor availability for both old and new dates
      queryClient.invalidateQueries({
        queryKey: ['doctor-schedules', 'available', rescheduledAppointment.doctorId],
      })

      toast({
        title: 'Thành công',
        description: 'Đã đổi lịch hẹn thành công',
      })
    },
  })
}

// Utility hooks
export const useUpcomingAppointments = (userId: number, limit = 5) => {
  const today = new Date().toISOString().split('T')[0]

  return useQuery({
    queryKey: ['appointments', 'upcoming', userId, limit],
    queryFn: () =>
      appointmentApi.getAll(userId, {
        page: 1,
        limit,
        dateRange: { startDate: today },
        status: AppointmentStatus.CONFIRMED,
      }),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export const useAppointmentHistory = (userId: number, filters?: AppointmentFilterDto) => {
  return useQuery({
    queryKey: ['appointments', 'history', userId, filters],
    queryFn: () =>
      appointmentApi.getAll(userId, {
        ...filters,
        status: AppointmentStatus.COMPLETED,
      }),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  })
}
