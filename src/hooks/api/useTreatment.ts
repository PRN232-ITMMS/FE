import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import { treatmentCycleApi, treatmentServiceApi, treatmentPackageApi } from '@/apis/treatment.api'
import { queryKeys, optimisticUpdates } from '@/lib/query-client'
import {
  TreatmentCycleFilterDto,
  UpdateCycleDto,
  AssignDoctorDto,
  UpdateTreatmentServiceDto,
  UpdateTreatmentPackageDto,
  CycleStatus,
  TreatmentCycle,
  TreatmentService,
  TreatmentPackage,
} from '@/types/medical.type'

// Treatment Cycle hooks
export const useTreatmentCycles = (userId: number, filters?: TreatmentCycleFilterDto) => {
  return useQuery({
    queryKey: queryKeys.treatmentCycles.list(userId, filters),
    queryFn: () => treatmentCycleApi.getAll(userId, filters),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useTreatmentCycle = (id: number) => {
  return useQuery({
    queryKey: queryKeys.treatmentCycles.detail(id),
    queryFn: () => treatmentCycleApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateTreatmentCycle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: treatmentCycleApi.create,
    onSuccess: (newCycle: TreatmentCycle) => {
      // Add to cache
      queryClient.setQueryData(queryKeys.treatmentCycles.detail(newCycle.id), newCycle)

      // Invalidate cycles list
      queryClient.invalidateQueries({
        queryKey: queryKeys.treatmentCycles.byUser(newCycle.customerId),
      })

      toast({
        title: 'Thành công',
        description: 'Đã tạo chu kỳ điều trị thành công',
      })
    },
  })
}

export const useUpdateTreatmentCycle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCycleDto }) => treatmentCycleApi.update(id, data),
    onMutate: async ({ id, data }: { id: number; data: UpdateCycleDto }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.treatmentCycles.detail(id) })

      // Snapshot previous value
      const previousCycle = queryClient.getQueryData(queryKeys.treatmentCycles.detail(id)) as TreatmentCycle | undefined

      // Optimistically update
      optimisticUpdates.updateTreatmentCycle(id, data)

      return { previousCycle }
    },
    onError: (_err: unknown, { id }: { id: number }, context?: { previousCycle?: TreatmentCycle }) => {
      // Rollback on error
      if (context?.previousCycle) {
        queryClient.setQueryData(queryKeys.treatmentCycles.detail(id), context.previousCycle)
      }
    },
    onSuccess: (updatedCycle: TreatmentCycle) => {
      // Update cache with real data
      queryClient.setQueryData(queryKeys.treatmentCycles.detail(updatedCycle.id), updatedCycle)

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.treatmentCycles.byUser(updatedCycle.customerId),
      })

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật chu kỳ điều trị thành công',
      })
    },
  })
}

export const useDeleteTreatmentCycle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: treatmentCycleApi.delete,
    onSuccess: (_: void, _deletedId: number) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.treatmentCycles.detail(_deletedId) })

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.treatmentCycles.all() })

      toast({
        title: 'Thành công',
        description: 'Đã xóa chu kỳ điều trị thành công',
      })
    },
  })
}

export const useAssignDoctorToCycle = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AssignDoctorDto }) => treatmentCycleApi.assignDoctor(id, data),
    onSuccess: (updatedCycle: TreatmentCycle) => {
      // Update cache
      queryClient.setQueryData(queryKeys.treatmentCycles.detail(updatedCycle.id), updatedCycle)

      // Invalidate lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.treatmentCycles.byUser(updatedCycle.customerId),
      })

      toast({
        title: 'Thành công',
        description: 'Đã phân công bác sĩ thành công',
      })
    },
  })
}

// Treatment Service hooks
export const useTreatmentServices = () => {
  return useQuery({
    queryKey: queryKeys.treatmentServices.all(),
    queryFn: () => treatmentServiceApi.getAll(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}

export const useTreatmentService = (id: number) => {
  return useQuery({
    queryKey: queryKeys.treatmentServices.detail(id),
    queryFn: () => treatmentServiceApi.getById(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  })
}

export const useCreateTreatmentService = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: treatmentServiceApi.create,
    onSuccess: (newService: TreatmentService) => {
      // Add to cache
      queryClient.setQueryData(queryKeys.treatmentServices.detail(newService.id), newService)

      // Invalidate services list
      queryClient.invalidateQueries({ queryKey: queryKeys.treatmentServices.all() })

      toast({
        title: 'Thành công',
        description: 'Đã tạo dịch vụ điều trị thành công',
      })
    },
  })
}

export const useUpdateTreatmentService = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTreatmentServiceDto }) => treatmentServiceApi.update(id, data),
    onSuccess: (updatedService: TreatmentService) => {
      // Update cache
      queryClient.setQueryData(queryKeys.treatmentServices.detail(updatedService.id), updatedService)

      // Invalidate list
      queryClient.invalidateQueries({ queryKey: queryKeys.treatmentServices.all() })

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật dịch vụ điều trị thành công',
      })
    },
  })
}

export const useDeleteTreatmentService = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: treatmentServiceApi.delete,
    onSuccess: (_: void, _deletedId: number) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.treatmentServices.detail(_deletedId) })

      // Invalidate list
      queryClient.invalidateQueries({ queryKey: queryKeys.treatmentServices.all() })

      toast({
        title: 'Thành công',
        description: 'Đã xóa dịch vụ điều trị thành công',
      })
    },
  })
}

// Treatment Package hooks
export const useTreatmentPackages = () => {
  return useQuery({
    queryKey: queryKeys.treatmentPackages.all(),
    queryFn: () => treatmentPackageApi.getAll(),
    staleTime: 30 * 60 * 1000,
  })
}

export const useTreatmentPackage = (id: number) => {
  return useQuery({
    queryKey: queryKeys.treatmentPackages.detail(id),
    queryFn: () => treatmentPackageApi.getById(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  })
}

export const useCreateTreatmentPackage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: treatmentPackageApi.create,
    onSuccess: (newPackage: TreatmentPackage) => {
      // Add to cache
      queryClient.setQueryData(queryKeys.treatmentPackages.detail(newPackage.id), newPackage)

      // Invalidate packages list
      queryClient.invalidateQueries({ queryKey: queryKeys.treatmentPackages.all() })

      toast({
        title: 'Thành công',
        description: 'Đã tạo gói điều trị thành công',
      })
    },
  })
}

export const useUpdateTreatmentPackage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTreatmentPackageDto }) => treatmentPackageApi.update(id, data),
    onSuccess: (updatedPackage: TreatmentPackage) => {
      // Update cache
      queryClient.setQueryData(queryKeys.treatmentPackages.detail(updatedPackage.id), updatedPackage)

      // Invalidate list
      queryClient.invalidateQueries({ queryKey: queryKeys.treatmentPackages.all() })

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật gói điều trị thành công',
      })
    },
  })
}

export const useDeleteTreatmentPackage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: treatmentPackageApi.delete,
    onSuccess: (_: void, _deletedId: number) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.treatmentPackages.detail(_deletedId) })

      // Invalidate list
      queryClient.invalidateQueries({ queryKey: queryKeys.treatmentPackages.all() })

      toast({
        title: 'Thành công',
        description: 'Đã xóa gói điều trị thành công',
      })
    },
  })
}

// Utility hooks
export const useActiveTreatmentCycles = (userId: number) => {
  return useQuery({
    queryKey: ['treatment-cycles', 'active', userId],
    queryFn: () =>
      treatmentCycleApi.getAll(userId, {
        status: CycleStatus.IN_PROGRESS,
        page: 1,
        limit: 10,
      }),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  })
}

export const useActiveTreatmentServices = () => {
  return useQuery({
    queryKey: ['treatment-services', 'active'],
    queryFn: async () => {
      const response = await treatmentServiceApi.getAll()
      return response.filter((service) => service.isActive)
    },
    staleTime: 30 * 60 * 1000,
  })
}

export const useActiveTreatmentPackages = () => {
  return useQuery({
    queryKey: ['treatment-packages', 'active'],
    queryFn: async () => {
      const response = await treatmentPackageApi.getAll()
      return response.filter((pkg) => pkg.isActive)
    },
    staleTime: 30 * 60 * 1000,
  })
}
