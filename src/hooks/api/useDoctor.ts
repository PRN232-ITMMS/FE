import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { doctorApi, doctorScheduleApi } from '@/apis/doctor.api'
import { queryKeys } from '@/lib/query-client'
import {
  Doctor,
  DoctorFilterDto,
  UpdateDoctorDto,
  DoctorSearchDto,
  DoctorSchedule,
  UpdateDoctorScheduleDto,
} from '@/types/medical.type'

// Doctor hooks
export const useDoctors = (filters?: DoctorFilterDto) => {
  return useQuery({
    queryKey: queryKeys.doctors.list(filters),
    queryFn: () => doctorApi.getAll(filters),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })
}

export const useDoctor = (id: number) => {
  return useQuery({
    queryKey: queryKeys.doctors.detail(id),
    queryFn: () => doctorApi.getById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

export const useDoctorSearch = (searchData: DoctorSearchDto, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.doctors.search(searchData.query),
    queryFn: () => doctorApi.search(searchData),
    enabled: enabled && !!searchData.query,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateDoctor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: doctorApi.create,
    onSuccess: (newDoctor: Doctor) => {
      // Invalidate doctors list
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all() })

      // Add to cache
      queryClient.setQueryData(queryKeys.doctors.detail(newDoctor.id), newDoctor)

      toast({
        title: 'Thành công',
        description: 'Đã tạo hồ sơ bác sĩ thành công',
      })
    },
  })
}

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDoctorDto }) => doctorApi.update(id, data),
    onSuccess: (updatedDoctor: Doctor) => {
      // Update cache
      queryClient.setQueryData(queryKeys.doctors.detail(updatedDoctor.id), updatedDoctor)

      // Invalidate list to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all() })

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin bác sĩ thành công',
      })
    },
  })
}

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: doctorApi.delete,
    onSuccess: (_: void, deletedId: number) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.doctors.detail(deletedId) })

      // Invalidate list
      queryClient.invalidateQueries({ queryKey: queryKeys.doctors.all() })

      toast({
        title: 'Thành công',
        description: 'Đã xóa bác sĩ thành công',
      })
    },
  })
}

// Doctor Schedule hooks
export const useDoctorSchedules = (doctorId: number) => {
  return useQuery({
    queryKey: queryKeys.doctorSchedules.all(doctorId),
    queryFn: () => doctorScheduleApi.getAll(doctorId),
    enabled: !!doctorId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useAvailableSlots = (doctorId: number, date: string) => {
  return useQuery({
    queryKey: queryKeys.doctorSchedules.available(doctorId, date),
    queryFn: () => doctorScheduleApi.getAvailableSlots(doctorId, date),
    enabled: !!doctorId && !!date,
    staleTime: 2 * 60 * 1000, // 2 minutes for availability
  })
}

export const useCreateDoctorSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: doctorScheduleApi.create,
    onSuccess: (newSchedule: DoctorSchedule) => {
      // Invalidate schedules for this doctor
      queryClient.invalidateQueries({
        queryKey: queryKeys.doctorSchedules.all(newSchedule.doctorId),
      })

      // Invalidate availability data
      queryClient.invalidateQueries({
        queryKey: ['doctor-schedules', 'available', newSchedule.doctorId],
      })

      toast({
        title: 'Thành công',
        description: 'Đã tạo lịch làm việc thành công',
      })
    },
  })
}

export const useUpdateDoctorSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDoctorScheduleDto }) => doctorScheduleApi.update(id, data),
    onSuccess: (updatedSchedule: DoctorSchedule) => {
      // Invalidate schedules for this doctor
      queryClient.invalidateQueries({
        queryKey: queryKeys.doctorSchedules.all(updatedSchedule.doctorId),
      })

      // Invalidate availability data
      queryClient.invalidateQueries({
        queryKey: ['doctor-schedules', 'available', updatedSchedule.doctorId],
      })

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật lịch làm việc thành công',
      })
    },
  })
}

export const useDeleteDoctorSchedule = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: doctorScheduleApi.delete,
    onSuccess: (_: void, _deletedId: number) => {
      // Invalidate all doctor schedules and availability
      queryClient.invalidateQueries({ queryKey: ['doctor-schedules'] })

      toast({
        title: 'Thành công',
        description: 'Đã xóa lịch làm việc thành công',
      })
    },
  })
}
