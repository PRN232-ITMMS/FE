import http, { API_ENDPOINTS, ApiResponse, PaginatedResponse } from '@/lib/http'
import {
  TreatmentCycle,
  CreateCycleDto,
  UpdateCycleDto,
  AssignDoctorDto,
  TreatmentCycleFilterDto,
  TreatmentService,
  CreateTreatmentServiceDto,
  UpdateTreatmentServiceDto,
  TreatmentPackage,
  CreateTreatmentPackageDto,
  UpdateTreatmentPackageDto,
} from '@/types/medical.type'

// Treatment Cycle API service
export const treatmentCycleApi = {
  // Get all treatment cycles for a user
  getAll: async (userId: number, filters?: TreatmentCycleFilterDto): Promise<PaginatedResponse<TreatmentCycle>> => {
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
      ? `${API_ENDPOINTS.TREATMENT_CYCLES.GET_ALL(userId)}?${queryString}`
      : API_ENDPOINTS.TREATMENT_CYCLES.GET_ALL(userId)

    const response = await http.get<ApiResponse<PaginatedResponse<TreatmentCycle>>>(url)
    return response.data.data
  },

  // Get treatment cycle by ID
  getById: async (id: number): Promise<TreatmentCycle> => {
    const response = await http.get<ApiResponse<TreatmentCycle>>(API_ENDPOINTS.TREATMENT_CYCLES.GET_BY_ID(id))
    return response.data.data
  },

  // Create new treatment cycle
  create: async (data: CreateCycleDto): Promise<TreatmentCycle> => {
    const response = await http.post<ApiResponse<TreatmentCycle>>(API_ENDPOINTS.TREATMENT_CYCLES.CREATE, data)
    return response.data.data
  },

  // Update treatment cycle
  update: async (id: number, data: UpdateCycleDto): Promise<TreatmentCycle> => {
    const response = await http.put<ApiResponse<TreatmentCycle>>(API_ENDPOINTS.TREATMENT_CYCLES.UPDATE(id), data)
    return response.data.data
  },

  // Delete treatment cycle
  delete: async (id: number): Promise<void> => {
    await http.delete<ApiResponse<void>>(API_ENDPOINTS.TREATMENT_CYCLES.DELETE(id))
  },

  // Assign doctor to treatment cycle
  assignDoctor: async (id: number, data: AssignDoctorDto): Promise<TreatmentCycle> => {
    const response = await http.patch<ApiResponse<TreatmentCycle>>(
      API_ENDPOINTS.TREATMENT_CYCLES.ASSIGN_DOCTOR(id),
      data
    )
    return response.data.data
  },
}

// Treatment Service API service
export const treatmentServiceApi = {
  // Get all treatment services
  getAll: async (): Promise<TreatmentService[]> => {
    const response = await http.get<ApiResponse<TreatmentService[]>>(API_ENDPOINTS.TREATMENT_SERVICES.GET_ALL)
    return response.data.data
  },

  // Get treatment service by ID
  getById: async (id: number): Promise<TreatmentService> => {
    const response = await http.get<ApiResponse<TreatmentService>>(API_ENDPOINTS.TREATMENT_SERVICES.GET_BY_ID(id))
    return response.data.data
  },

  // Create new treatment service
  create: async (data: CreateTreatmentServiceDto): Promise<TreatmentService> => {
    const response = await http.post<ApiResponse<TreatmentService>>(API_ENDPOINTS.TREATMENT_SERVICES.CREATE, data)
    return response.data.data
  },

  // Update treatment service
  update: async (id: number, data: UpdateTreatmentServiceDto): Promise<TreatmentService> => {
    const response = await http.put<ApiResponse<TreatmentService>>(API_ENDPOINTS.TREATMENT_SERVICES.UPDATE(id), data)
    return response.data.data
  },

  // Delete treatment service
  delete: async (id: number): Promise<void> => {
    await http.delete<ApiResponse<void>>(API_ENDPOINTS.TREATMENT_SERVICES.DELETE(id))
  },
}

// Treatment Package API service
export const treatmentPackageApi = {
  // Get all treatment packages
  getAll: async (): Promise<TreatmentPackage[]> => {
    const response = await http.get<ApiResponse<TreatmentPackage[]>>(API_ENDPOINTS.TREATMENT_PACKAGES.GET_ALL)
    return response.data.data
  },

  // Get treatment package by ID
  getById: async (id: number): Promise<TreatmentPackage> => {
    const response = await http.get<ApiResponse<TreatmentPackage>>(API_ENDPOINTS.TREATMENT_PACKAGES.GET_BY_ID(id))
    return response.data.data
  },

  // Create new treatment package
  create: async (data: CreateTreatmentPackageDto): Promise<TreatmentPackage> => {
    const response = await http.post<ApiResponse<TreatmentPackage>>(API_ENDPOINTS.TREATMENT_PACKAGES.CREATE, data)
    return response.data.data
  },

  // Update treatment package
  update: async (id: number, data: UpdateTreatmentPackageDto): Promise<TreatmentPackage> => {
    const response = await http.put<ApiResponse<TreatmentPackage>>(API_ENDPOINTS.TREATMENT_PACKAGES.UPDATE(id), data)
    return response.data.data
  },

  // Delete treatment package
  delete: async (id: number): Promise<void> => {
    await http.delete<ApiResponse<void>>(API_ENDPOINTS.TREATMENT_PACKAGES.DELETE(id))
  },
}

export default {
  treatmentCycleApi,
  treatmentServiceApi,
  treatmentPackageApi,
}
