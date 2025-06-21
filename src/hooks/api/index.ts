// Export all API hooks
export * from './useDoctor'
export * from './useAppointment'
export * from './useTreatment'
export * from './useNotification'

// Re-export commonly used types and enums
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
  CycleStatus,
  NotificationType,
} from '@/types/medical.type'

// Re-export enums as values
export {
  AppointmentStatus,
  AppointmentType,
} from '@/types/medical.type'
