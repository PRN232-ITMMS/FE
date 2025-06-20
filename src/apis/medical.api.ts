import http, { API_ENDPOINTS } from '@/lib/http'
import { MedicalHistory, EmergencyContact, MedicalDocument } from '@/types/medical.type'

// Medical History API
export const medicalHistoryApi = {
  // Get all medical history for a user
  getAll: async (userId: number): Promise<MedicalHistory[]> => {
    const response = await http.get(API_ENDPOINTS.MEDICAL_HISTORY.GET_ALL(userId))
    return response.data
  },

  // Create new medical history entry
  create: async (data: Omit<MedicalHistory, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalHistory> => {
    const response = await http.post(API_ENDPOINTS.MEDICAL_HISTORY.CREATE, data)
    return response.data
  },

  // Update medical history entry
  update: async (id: number, data: Partial<MedicalHistory>): Promise<MedicalHistory> => {
    const response = await http.put(API_ENDPOINTS.MEDICAL_HISTORY.UPDATE(id), data)
    return response.data
  },

  // Delete medical history entry
  delete: async (id: number): Promise<void> => {
    await http.delete(API_ENDPOINTS.MEDICAL_HISTORY.DELETE(id))
  },
}

// Emergency Contacts API
export const emergencyContactsApi = {
  // Get all emergency contacts for a user
  getAll: async (userId: number): Promise<EmergencyContact[]> => {
    const response = await http.get(API_ENDPOINTS.EMERGENCY_CONTACTS.GET_ALL(userId))
    return response.data
  },

  // Create new emergency contact
  create: async (data: Omit<EmergencyContact, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmergencyContact> => {
    const response = await http.post(API_ENDPOINTS.EMERGENCY_CONTACTS.CREATE, data)
    return response.data
  },

  // Update emergency contact
  update: async (id: number, data: Partial<EmergencyContact>): Promise<EmergencyContact> => {
    const response = await http.put(API_ENDPOINTS.EMERGENCY_CONTACTS.UPDATE(id), data)
    return response.data
  },

  // Delete emergency contact
  delete: async (id: number): Promise<void> => {
    await http.delete(API_ENDPOINTS.EMERGENCY_CONTACTS.DELETE(id))
  },
}

// Medical Documents API
export const medicalDocumentsApi = {
  // Get all documents for a user
  getAll: async (userId: number): Promise<MedicalDocument[]> => {
    const response = await http.get(API_ENDPOINTS.MEDICAL_DOCUMENTS.GET_ALL(userId))
    return response.data
  },

  // Upload new document
  upload: async (userId: number, file: File, description?: string): Promise<MedicalDocument> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId.toString())
    if (description) {
      formData.append('description', description)
    }

    const response = await http.post(API_ENDPOINTS.MEDICAL_DOCUMENTS.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete document
  delete: async (id: number): Promise<void> => {
    await http.delete(API_ENDPOINTS.MEDICAL_DOCUMENTS.DELETE(id))
  },
}
