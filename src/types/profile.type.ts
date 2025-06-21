import { AxiosError } from 'axios'

export interface UpdateProfileDto {
  fullName: string
  email: string
  phoneNumber?: string
  gender?: number
  address?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  maritalStatus?: string
  occupation?: string
}

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface AvatarUploadResponse {
  avatarUrl: string
  message: string
}

export interface ProfileFormData {
  fullName: string
  email: string
  phoneNumber?: string
  gender?: number
  dateOfBirth?: Date | undefined
}

// Type guard for AxiosError
export const isAxiosError = (error: unknown): error is AxiosError => {
  return (error as AxiosError).isAxiosError === true
}
