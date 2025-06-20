import { AxiosError } from 'axios'
import { toast } from '@/hooks/use-toast'
import { ValidationErrors } from '@/types/utils.type'

// Error types
export interface ApiErrorResponse {
  success: false
  message: string
  errors?: ValidationErrors
  code?: string
  details?: unknown
}

export interface NetworkError {
  type: 'network'
  message: string
  isOnline: boolean
}

export interface ValidationError {
  type: 'validation'
  message: string
  errors: ValidationErrors
}

export interface ServerError {
  type: 'server'
  message: string
  status: number
  code?: string
}

export interface AuthError {
  type: 'auth'
  message: string
  status: 401 | 403
}

export type AppError = NetworkError | ValidationError | ServerError | AuthError

// Error handling utilities
export class ErrorHandler {
  static parseError(error: unknown): AppError {
    // Handle Axios errors
    if (error instanceof AxiosError) {
      return this.parseAxiosError(error)
    }

    // Handle network errors
    if (error instanceof Error) {
      if (error.message.includes('Network Error') || !navigator.onLine) {
        return {
          type: 'network',
          message: 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.',
          isOnline: navigator.onLine,
        }
      }
    }

    // Default error
    return {
      type: 'server',
      message: 'Có lỗi xảy ra. Vui lòng thử lại.',
      status: 500,
    }
  }

  private static parseAxiosError(error: AxiosError): AppError {
    const response = error.response
    const data = response?.data as ApiErrorResponse

    // Network error
    if (!response) {
      return {
        type: 'network',
        message: 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.',
        isOnline: navigator.onLine,
      }
    }

    // Auth errors
    if (response.status === 401) {
      return {
        type: 'auth',
        message: data?.message || 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.',
        status: 401,
      }
    }

    if (response.status === 403) {
      return {
        type: 'auth',
        message: data?.message || 'Bạn không có quyền thực hiện thao tác này.',
        status: 403,
      }
    }

    // Validation errors
    if (response.status === 422 && data?.errors) {
      return {
        type: 'validation',
        message: data.message || 'Dữ liệu không hợp lệ',
        errors: data.errors,
      }
    }

    // Server errors
    return {
      type: 'server',
      message: data?.message || this.getStatusMessage(response.status),
      status: response.status,
      code: data?.code,
    }
  }

  private static getStatusMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Yêu cầu không hợp lệ'
      case 404:
        return 'Không tìm thấy dữ liệu'
      case 409:
        return 'Dữ liệu đã tồn tại hoặc xung đột'
      case 429:
        return 'Quá nhiều yêu cầu. Vui lòng thử lại sau'
      case 500:
        return 'Lỗi máy chủ. Vui lòng thử lại sau'
      case 502:
        return 'Máy chủ không phản hồi'
      case 503:
        return 'Dịch vụ tạm thời không khả dụng'
      default:
        return 'Có lỗi xảy ra. Vui lòng thử lại'
    }
  }

  // Show error toast
  static showError(error: AppError, customMessage?: string) {
    const message = customMessage || error.message

    toast({
      title: this.getErrorTitle(error),
      description: message,
      variant: 'destructive',
    })
  }

  private static getErrorTitle(error: AppError): string {
    switch (error.type) {
      case 'network':
        return 'Lỗi kết nối'
      case 'validation':
        return 'Dữ liệu không hợp lệ'
      case 'auth':
        return 'Lỗi xác thực'
      case 'server':
        return 'Lỗi máy chủ'
      default:
        return 'Lỗi'
    }
  }

  // Handle form validation errors
  static handleValidationErrors(error: ValidationError, setError: (field: string, error: { message: string }) => void) {
    Object.entries(error.errors).forEach(([field, messages]) => {
      setError(field, { message: messages[0] })
    })
  }

  // Retry logic for failed requests
  static shouldRetry(error: AppError, retryCount: number, maxRetries = 3): boolean {
    if (retryCount >= maxRetries) return false

    switch (error.type) {
      case 'network':
        return true
      case 'server':
        return error.status >= 500 && error.status < 600
      default:
        return false
    }
  }

  // Get retry delay with exponential backoff
  static getRetryDelay(retryCount: number): number {
    return Math.min(1000 * Math.pow(2, retryCount), 10000)
  }
}

// Error boundary utilities
export class ErrorBoundaryHandler {
  static logError(error: Error, errorInfo: unknown) {
    console.error('Error Boundary caught an error:', error, errorInfo)

    // In production, send to error tracking service
    if (import.meta.env.MODE === 'production') {
      // Example: Sentry.captureException(error)
    }
  }

  static getErrorMessage(error: Error): string {
    if (error.message.includes('ChunkLoadError')) {
      return 'Ứng dụng đã được cập nhật. Vui lòng tải lại trang.'
    }

    if (error.message.includes('Loading chunk')) {
      return 'Không thể tải tài nguyên. Vui lòng kiểm tra kết nối mạng.'
    }

    return 'Có lỗi xảy ra. Vui lòng tải lại trang.'
  }
}

// Form error utilities
export class FormErrorHandler {
  static extractFieldErrors(error: ValidationError): Record<string, string> {
    const fieldErrors: Record<string, string> = {}

    Object.entries(error.errors).forEach(([field, messages]) => {
      fieldErrors[field] = messages[0]
    })

    return fieldErrors
  }

  static getFormErrorMessage(error: AppError): string {
    switch (error.type) {
      case 'validation':
        return 'Vui lòng kiểm tra lại thông tin đã nhập'
      case 'network':
        return 'Không thể kết nối. Vui lòng thử lại'
      case 'auth':
        return 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại'
      default:
        return error.message
    }
  }
}

// Export main error handler
export default ErrorHandler
