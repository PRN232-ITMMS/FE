export interface MedicalHistory {
  id?: number
  userId: number
  condition: string
  description?: string
  diagnosisDate?: Date
  treatment?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface EmergencyContact {
  id?: number
  userId: number
  fullName: string
  relationship: string
  phoneNumber: string
  email?: string
  address?: string
  isPrimary: boolean
  createdAt?: string
  updatedAt?: string
}

export interface MedicalDocument {
  id?: number
  userId: number
  fileName: string
  fileUrl: string
  fileType: string
  uploadDate: string
  description?: string
}

// Form types
export interface MedicalHistoryFormData {
  condition: string
  description?: string
  diagnosisDate?: Date | undefined
  treatment?: string
  isActive: boolean
}

export interface EmergencyContactFormData {
  fullName: string
  relationship: string
  phoneNumber: string
  email?: string
  address?: string
  isPrimary: boolean
}
