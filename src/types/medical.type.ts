import { BaseEntity, DateRange, PaginationQuery } from './utils.type'

// Medical History related types
export interface MedicalHistory extends BaseEntity {
  userId: number
  condition: string
  diagnosisDate: string
  treatment?: string
  notes?: string
  isActive: boolean
}

export interface MedicalHistoryFormData {
  condition: string
  diagnosisDate: string
  treatment?: string
  notes?: string
}

// Emergency Contact related types
export interface EmergencyContact extends BaseEntity {
  userId: number
  name: string
  relationship: string
  phoneNumber: string
  email?: string
  address?: string
  isPrimary: boolean
}

export interface EmergencyContactFormData {
  name: string
  relationship: string
  phoneNumber: string
  email?: string
  address?: string
  isPrimary: boolean
}

// Medical Document related types
export interface MedicalDocument extends BaseEntity {
  userId: number
  fileName: string
  fileUrl: string
  fileType: string
  fileSize: number
  description?: string
  uploadedAt: string
}

export interface MedicalDocumentFormData {
  file: File
  description?: string
}

// Doctor related types
export interface Doctor extends BaseEntity {
  userId: number
  fullName: string
  email: string
  phoneNumber?: string
  specialization: string
  qualification: string
  experience: number
  consultationFee: number
  rating?: number
  totalReviews?: number
  isAvailable: boolean
  profileImage?: string
  bio?: string
  // Relations
  user?: {
    id: number
    fullName: string
    email: string
    phoneNumber?: string
    gender?: number
  }
}

export interface CreateDoctorDto {
  userId: number
  specialization: string
  qualification: string
  experience: number
  consultationFee: number
  bio?: string
}

export interface UpdateDoctorDto {
  specialization?: string
  qualification?: string
  experience?: number
  consultationFee?: number
  isAvailable?: boolean
  bio?: string
}

export interface DoctorFilterDto extends PaginationQuery {
  specialization?: string
  minExperience?: number
  maxExperience?: number
  minFee?: number
  maxFee?: number
  isAvailable?: boolean
  rating?: number
}

export interface DoctorSearchDto {
  query: string
  specialization?: string
  location?: string
}

// Doctor Schedule related types
export interface DoctorSchedule extends BaseEntity {
  doctorId: number
  dayOfWeek: number // 0=Sunday, 1=Monday, etc.
  startTime: string // HH:mm format
  endTime: string // HH:mm format
  isAvailable: boolean
  maxAppointments: number
  // Relations
  doctor?: Doctor
}

export interface CreateDoctorScheduleDto {
  doctorId: number
  dayOfWeek: number
  startTime: string
  endTime: string
  maxAppointments: number
}

export interface UpdateDoctorScheduleDto {
  dayOfWeek?: number
  startTime?: string
  endTime?: string
  isAvailable?: boolean
  maxAppointments?: number
}

export interface AvailableSlot {
  time: string
  isAvailable: boolean
  appointmentCount: number
}

// Appointment related types
export enum AppointmentStatus {
  PENDING = 1,
  CONFIRMED = 2,
  COMPLETED = 3,
  CANCELLED = 4,
  RESCHEDULED = 5,
}

export enum AppointmentType {
  CONSULTATION = 1,
  FOLLOWUP = 2,
  TREATMENT = 3,
  EMERGENCY = 4,
}

export interface Appointment extends BaseEntity {
  customerId: number
  doctorId: number
  appointmentDate: string
  appointmentTime: string
  status: AppointmentStatus
  type: AppointmentType
  notes?: string
  reason: string
  symptoms?: string
  // Relations
  customer?: {
    id: number
    fullName: string
    email: string
    phoneNumber?: string
  }
  doctor?: Doctor
}

export interface CreateAppointmentDto {
  doctorId: number
  appointmentDate: string
  appointmentTime: string
  type: AppointmentType
  reason: string
  symptoms?: string
  notes?: string
}

export interface UpdateAppointmentDto {
  appointmentDate?: string
  appointmentTime?: string
  status?: AppointmentStatus
  type?: AppointmentType
  notes?: string
  reason?: string
  symptoms?: string
}

export interface RescheduleAppointmentDto {
  appointmentDate: string
  appointmentTime: string
  reason?: string
}

export interface AppointmentFilterDto extends PaginationQuery {
  doctorId?: number
  customerId?: number
  status?: AppointmentStatus
  type?: AppointmentType
  dateRange?: DateRange
}

// Treatment related types
export enum CycleStatus {
  PLANNING = 1,
  IN_PROGRESS = 2,
  COMPLETED = 3,
  CANCELLED = 4,
  ON_HOLD = 5,
}

export interface TreatmentCycle extends BaseEntity {
  customerId: number
  doctorId?: number
  name: string
  description?: string
  startDate: string
  endDate?: string
  status: CycleStatus
  totalCost: number
  paidAmount: number
  notes?: string
  // Relations
  customer?: {
    id: number
    fullName: string
    email: string
  }
  doctor?: Doctor
  phases?: TreatmentPhase[]
}

export interface CreateCycleDto {
  name: string
  description?: string
  startDate: string
  endDate?: string
  totalCost: number
  notes?: string
}

export interface UpdateCycleDto {
  name?: string
  description?: string
  startDate?: string
  endDate?: string
  status?: CycleStatus
  totalCost?: number
  paidAmount?: number
  notes?: string
}

export interface AssignDoctorDto {
  doctorId: number
}

export interface TreatmentCycleFilterDto extends PaginationQuery {
  customerId?: number
  doctorId?: number
  status?: CycleStatus
  dateRange?: DateRange
}

// Treatment Phase related types
export interface TreatmentPhase extends BaseEntity {
  cycleId: number
  name: string
  description?: string
  startDate: string
  endDate?: string
  order: number
  isCompleted: boolean
  notes?: string
  // Relations
  cycle?: TreatmentCycle
}

export interface CreatePhaseDto {
  cycleId: number
  name: string
  description?: string
  startDate: string
  endDate?: string
  order: number
  notes?: string
}

export interface UpdatePhaseDto {
  name?: string
  description?: string
  startDate?: string
  endDate?: string
  order?: number
  isCompleted?: boolean
  notes?: string
}

// Treatment Service related types
export interface TreatmentService extends BaseEntity {
  name: string
  description?: string
  duration: number // in minutes
  cost: number
  isActive: boolean
  category?: string
  requirements?: string
}

export interface CreateTreatmentServiceDto {
  name: string
  description?: string
  duration: number
  cost: number
  category?: string
  requirements?: string
}

export interface UpdateTreatmentServiceDto {
  name?: string
  description?: string
  duration?: number
  cost?: number
  isActive?: boolean
  category?: string
  requirements?: string
}

// Treatment Package related types
export interface TreatmentPackage extends BaseEntity {
  name: string
  description?: string
  totalCost: number
  duration: number // in days
  isActive: boolean
  serviceIds: number[]
  discount?: number
  // Relations
  services?: TreatmentService[]
}

export interface CreateTreatmentPackageDto {
  name: string
  description?: string
  totalCost: number
  duration: number
  serviceIds: number[]
  discount?: number
}

export interface UpdateTreatmentPackageDto {
  name?: string
  description?: string
  totalCost?: number
  duration?: number
  isActive?: boolean
  serviceIds?: number[]
  discount?: number
}

// Notification related types
export enum NotificationType {
  APPOINTMENT_REMINDER = 1,
  APPOINTMENT_CONFIRMED = 2,
  APPOINTMENT_CANCELLED = 3,
  TREATMENT_UPDATE = 4,
  PAYMENT_DUE = 5,
  GENERAL = 6,
}

export interface Notification extends BaseEntity {
  userId: number
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  relatedId?: number // ID of related entity (appointment, treatment, etc.)
  scheduledAt?: string
  sentAt?: string
}

export interface CreateNotificationDto {
  userId: number
  title: string
  message: string
  type: NotificationType
  relatedId?: number
  scheduledAt?: string
}

export interface NotificationFilterDto extends PaginationQuery {
  userId?: number
  type?: NotificationType
  isRead?: boolean
  dateRange?: DateRange
}
