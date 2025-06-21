import { AxiosError } from 'axios'

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
  code?: string
}

export class ApiErrorHandler {
  static handle(error: AxiosError): string {
    // Network error
    if (!error.response) {
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
    }

    const data = error.response.data as any
    const status = error.response.status

    // Handle validation errors (422)
    if (status === 422 && data?.errors) {
      if (typeof data.errors === 'object') {
        const errorMessages = Object.values(data.errors).flat() as string[]
        return errorMessages.join(', ')
      }
    }

    // Handle server error messages
    if (data?.message) {
      return data.message
    }

    // Handle different status codes
    return this.getDefaultMessage(status)
  }

  static getDefaultMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra thông tin đầu vào.'
      case 401:
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
      case 403:
        return 'Bạn không có quyền thực hiện thao tác này.'
      case 404:
        return 'Không tìm thấy thông tin yêu cầu.'
      case 409:
        return 'Dữ liệu đã tồn tại hoặc xung đột.'
      case 422:
        return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.'
      case 429:
        return 'Quá nhiều yêu cầu. Vui lòng thử lại sau.'
      case 500:
        return 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau.'
      case 502:
        return 'Máy chủ không phản hồi. Vui lòng thử lại sau.'
      case 503:
        return 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.'
      case 504:
        return 'Máy chủ phản hồi chậm. Vui lòng thử lại sau.'
      default:
        return 'Có lỗi xảy ra. Vui lòng thử lại sau.'
    }
  }

  static getFieldErrors(error: AxiosError): Record<string, string> {
    const data = error.response?.data as any
    if (error.response?.status === 422 && data?.errors) {
      const fieldErrors: Record<string, string> = {}
      
      Object.entries(data.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          fieldErrors[field] = messages[0]
        }
      })
      
      return fieldErrors
    }
    return {}
  }

  static isNetworkError(error: AxiosError): boolean {
    return !error.response
  }

  static isValidationError(error: AxiosError): boolean {
    return error.response?.status === 422
  }

  static isAuthError(error: AxiosError): boolean {
    return error.response?.status === 401
  }

  static isPermissionError(error: AxiosError): boolean {
    return error.response?.status === 403
  }

  static isNotFoundError(error: AxiosError): boolean {
    return error.response?.status === 404
  }

  static isServerError(error: AxiosError): boolean {
    const status = error.response?.status
    return status ? status >= 500 : false
  }
}

// Hook để handle errors trong components
export const useApiErrorHandler = () => {
  const handleError = (error: unknown): string => {
    if (error instanceof Error) {
      // Axios error
      if ('response' in error || 'request' in error) {
        return ApiErrorHandler.handle(error as AxiosError)
      }
      // Regular error
      return error.message
    }
    
    // Unknown error
    return 'Có lỗi không xác định xảy ra'
  }

  return { handleError }
}

export default ApiErrorHandler
