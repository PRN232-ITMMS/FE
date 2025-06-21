import http, { API_ENDPOINTS, ApiResponse } from '@/lib/http'
import { MedicalHistory, EmergencyContact, MedicalDocument } from '@/types/medical.type'

// Medical History API
export const medicalHistoryApi = {
  // Get all medical history for a user
  getAll: async (userId: number): Promise<MedicalHistory[]> => {
    const response = await http.get<ApiResponse<MedicalHistory[]>>(API_ENDPOINTS.MEDICAL_HISTORY.GET_ALL(userId))
    return response.data.data
  },

  // Create new medical history entry
  create: async (data: Omit<MedicalHistory, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalHistory> => {
    const response = await http.post<ApiResponse<MedicalHistory>>(API_ENDPOINTS.MEDICAL_HISTORY.CREATE, data)
    return response.data.data
  },

  // Update medical history entry
  update: async (id: number, data: Partial<MedicalHistory>): Promise<MedicalHistory> => {
    const response = await http.put<ApiResponse<MedicalHistory>>(API_ENDPOINTS.MEDICAL_HISTORY.UPDATE(id), data)
    return response.data.data
  },

  // Delete medical history entry
  delete: async (id: number): Promise<void> => {
    await http.delete<ApiResponse<void>>(API_ENDPOINTS.MEDICAL_HISTORY.DELETE(id))
  },
}

// Emergency Contacts API
export const emergencyContactsApi = {
  // Get all emergency contacts for a user
  getAll: async (userId: number): Promise<EmergencyContact[]> => {
    const response = await http.get<ApiResponse<EmergencyContact[]>>(API_ENDPOINTS.EMERGENCY_CONTACTS.GET_ALL(userId))
    return response.data.data
  },

  // Create new emergency contact
  create: async (data: Omit<EmergencyContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmergencyContact> => {
    const response = await http.post<ApiResponse<EmergencyContact>>(API_ENDPOINTS.EMERGENCY_CONTACTS.CREATE, data)
    return response.data.data
  },

  // Update emergency contact
  update: async (id: number, data: Partial<EmergencyContact>): Promise<EmergencyContact> => {
    const response = await http.put<ApiResponse<EmergencyContact>>(API_ENDPOINTS.EMERGENCY_CONTACTS.UPDATE(id), data)
    return response.data.data
  },

  // Delete emergency contact
  delete: async (id: number): Promise<void> => {
    await http.delete<ApiResponse<void>>(API_ENDPOINTS.EMERGENCY_CONTACTS.DELETE(id))
  },
}

// Medical Documents API
export const medicalDocumentsApi = {
  // Get all documents for a user
  getAll: async (userId: number): Promise<MedicalDocument[]> => {
    const response = await http.get<ApiResponse<MedicalDocument[]>>(API_ENDPOINTS.MEDICAL_DOCUMENTS.GET_ALL(userId))
    return response.data.data
  },

  // Upload new document
  upload: async (userId: number, file: File, description?: string): Promise<MedicalDocument> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId.toString())
    if (description) {
      formData.append('description', description)
    }

    const response = await http.post<ApiResponse<MedicalDocument>>(API_ENDPOINTS.MEDICAL_DOCUMENTS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data
  },

  // Delete document
  delete: async (id: number): Promise<void> => {
    await http.delete<ApiResponse<void>>(API_ENDPOINTS.MEDICAL_DOCUMENTS.DELETE(id))
  },
}
