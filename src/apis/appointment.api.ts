import http, { API_ENDPOINTS, ApiResponse, PaginatedResponse } from '@/lib/http'
import {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  RescheduleAppointmentDto,
  AppointmentFilterDto,
} from '@/types/medical.type'

// Appointment API service
export const appointmentApi = {
  // Get all appointments for a user
  getAll: async (userId: number, filters?: AppointmentFilterDto): Promise<PaginatedResponse<Appointment>> => {
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
      ? `${API_ENDPOINTS.APPOINTMENTS.GET_ALL(userId)}?${queryString}`
      : API_ENDPOINTS.APPOINTMENTS.GET_ALL(userId)

    const response = await http.get<ApiResponse<PaginatedResponse<Appointment>>>(url)
    return response.data.data
  },

  // Get appointment by ID
  getById: async (id: number): Promise<Appointment> => {
    const response = await http.get<ApiResponse<Appointment>>(API_ENDPOINTS.APPOINTMENTS.GET_BY_ID(id))
    return response.data.data
  },

  // Create new appointment
  create: async (data: CreateAppointmentDto): Promise<Appointment> => {
    const response = await http.post<ApiResponse<Appointment>>(API_ENDPOINTS.APPOINTMENTS.CREATE, data)
    return response.data.data
  },

  // Update appointment
  update: async (id: number, data: UpdateAppointmentDto): Promise<Appointment> => {
    const response = await http.put<ApiResponse<Appointment>>(API_ENDPOINTS.APPOINTMENTS.UPDATE(id), data)
    return response.data.data
  },

  // Cancel appointment
  cancel: async (id: number, reason?: string): Promise<Appointment> => {
    const response = await http.patch<ApiResponse<Appointment>>(API_ENDPOINTS.APPOINTMENTS.CANCEL(id), { reason })
    return response.data.data
  },

  // Reschedule appointment
  reschedule: async (id: number, data: RescheduleAppointmentDto): Promise<Appointment> => {
    const response = await http.patch<ApiResponse<Appointment>>(API_ENDPOINTS.APPOINTMENTS.RESCHEDULE(id), data)
    return response.data.data
  },
}

export default { appointmentApi }
