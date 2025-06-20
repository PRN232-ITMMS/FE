// Common response types
export interface SuccessResponse<T = any> {
  success: true
  data: T
  message?: string
}

export interface ErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
}

export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse

// Pagination types
export interface PaginationQuery {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: PaginationInfo
}

// Filter and search types
export interface DateRange {
  startDate?: string
  endDate?: string
}

export interface BaseFilter extends PaginationQuery {
  dateRange?: DateRange
}

// HTTP method types
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// Request configuration
export interface RequestConfig {
  headers?: Record<string, string>
  timeout?: number
  retries?: number
}

// Upload types
export interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}

// Status types
export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'

// Common entity base
export interface BaseEntity {
  id: number
  createdAt: string
  updatedAt: string
}

// Error types for form validation
export interface ValidationError {
  field: string
  message: string
}

export interface ValidationErrors {
  [key: string]: string[]
}
