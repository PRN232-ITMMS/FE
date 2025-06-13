// User roles from backend
export enum UserRole {
  Customer = 1,
  Doctor = 2,
  Manager = 3,
  Admin = 4
}

// Gender enum
export enum Gender {
  Male = 1,
  Female = 2,
  Other = 3
}

// User profile from backend
export interface User {
  id: number
  email: string
  fullName: string
  phoneNumber?: string
  gender?: Gender
  role: UserRole
  createdAt: string
  isActive: boolean
}
