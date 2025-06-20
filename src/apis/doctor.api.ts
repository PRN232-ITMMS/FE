import http, { API_ENDPOINTS, ApiResponse, PaginatedResponse } from '@/lib/http'
import {
  Doctor,
  CreateDoctorDto,
  UpdateDoctorDto,
  DoctorFilterDto,
  DoctorSearchDto,
  DoctorSchedule,
  CreateDoctorScheduleDto,
  UpdateDoctorScheduleDto,
  AvailableSlot,
} from '@/types/medical.type'

// Doctor API service
export const doctorApi = {
  // Get all doctors with filtering
  getAll: async (filters?: DoctorFilterDto): Promise<PaginatedResponse<Doctor>> => {
    const params = new URLSearchParams()

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }

    const queryString = params.toString()
    const url = queryString ? `${API_ENDPOINTS.DOCTORS.GET_ALL}?${queryString}` : API_ENDPOINTS.DOCTORS.GET_ALL

    const response = await http.get<ApiResponse<PaginatedResponse<Doctor>>>(url)
    return response.data.data
  },

  // Get doctor by ID
  getById: async (id: number): Promise<Doctor> => {
    const response = await http.get<ApiResponse<Doctor>>(API_ENDPOINTS.DOCTORS.GET_BY_ID(id))
    return response.data.data
  },

  // Search doctors
  search: async (searchData: DoctorSearchDto): Promise<Doctor[]> => {
    const response = await http.post<ApiResponse<Doctor[]>>(API_ENDPOINTS.DOCTORS.SEARCH, searchData)
    return response.data.data
  },

  // Create new doctor
  create: async (data: CreateDoctorDto): Promise<Doctor> => {
    const response = await http.post<ApiResponse<Doctor>>(API_ENDPOINTS.DOCTORS.CREATE, data)
    return response.data.data
  },

  // Update doctor
  update: async (id: number, data: UpdateDoctorDto): Promise<Doctor> => {
    const response = await http.put<ApiResponse<Doctor>>(API_ENDPOINTS.DOCTORS.UPDATE(id), data)
    return response.data.data
  },

  // Delete doctor
  delete: async (id: number): Promise<void> => {
    await http.delete<ApiResponse<void>>(API_ENDPOINTS.DOCTORS.DELETE(id))
  },
}

// Doctor Schedule API service
export const doctorScheduleApi = {
  // Get all schedules for a doctor
  getAll: async (doctorId: number): Promise<DoctorSchedule[]> => {
    const response = await http.get<ApiResponse<DoctorSchedule[]>>(API_ENDPOINTS.DOCTOR_SCHEDULES.GET_ALL(doctorId))
    return response.data.data
  },

  // Get available time slots for a doctor on a specific date
  getAvailableSlots: async (doctorId: number, date: string): Promise<AvailableSlot[]> => {
    const response = await http.get<ApiResponse<AvailableSlot[]>>(
      API_ENDPOINTS.DOCTOR_SCHEDULES.GET_AVAILABLE(doctorId, date)
    )
    return response.data.data
  },

  // Create new schedule
  create: async (data: CreateDoctorScheduleDto): Promise<DoctorSchedule> => {
    const response = await http.post<ApiResponse<DoctorSchedule>>(API_ENDPOINTS.DOCTOR_SCHEDULES.CREATE, data)
    return response.data.data
  },

  // Update schedule
  update: async (id: number, data: UpdateDoctorScheduleDto): Promise<DoctorSchedule> => {
    const response = await http.put<ApiResponse<DoctorSchedule>>(API_ENDPOINTS.DOCTOR_SCHEDULES.UPDATE(id), data)
    return response.data.data
  },

  // Delete schedule
  delete: async (id: number): Promise<void> => {
    await http.delete<ApiResponse<void>>(API_ENDPOINTS.DOCTOR_SCHEDULES.DELETE(id))
  },
}

export default { doctorApi, doctorScheduleApi }
