export interface SuccessResponse<T> {
  data: T
  message: string
}

export interface ErrorResponse {
  error: {
    message: string
    status?: number
  }
}
