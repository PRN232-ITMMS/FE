// Export all API modules
export { default as authAPI } from './auth.api'
export { doctorApi, doctorScheduleApi } from './doctor.api'
export { appointmentApi } from './appointment.api'
export { treatmentCycleApi, treatmentServiceApi, treatmentPackageApi } from './treatment.api'
export { notificationApi } from './notification.api'

// Re-export medical API for backward compatibility
export * from './medical.api'

// Export commonly used types
export type { ApiResponse, PaginatedResponse } from '@/lib/http'

export type {
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  AuthResponse,
  RegisterResponse,
} from '@/types/auth.type'

export type {
  Doctor,
  DoctorFilterDto,
  CreateDoctorDto,
  UpdateDoctorDto,
  DoctorSearchDto,
  DoctorSchedule,
  CreateDoctorScheduleDto,
  UpdateDoctorScheduleDto,
  Appointment,
  AppointmentFilterDto,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  RescheduleAppointmentDto,
  TreatmentCycle,
  TreatmentCycleFilterDto,
  CreateCycleDto,
  UpdateCycleDto,
  AssignDoctorDto,
  TreatmentService,
  CreateTreatmentServiceDto,
  UpdateTreatmentServiceDto,
  TreatmentPackage,
  CreateTreatmentPackageDto,
  UpdateTreatmentPackageDto,
  Notification,
  NotificationFilterDto,
  CreateNotificationDto,
  AppointmentStatus,
  AppointmentType,
  CycleStatus,
  NotificationType,
} from '@/types/medical.type'
