import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

export const ErrorFallback = ({ error, resetError }: ErrorFallbackProps) => {
  return (
    <div className='flex min-h-[400px] flex-col items-center justify-center space-y-4 p-8'>
      <div className='rounded-full bg-destructive/10 p-3'>
        <AlertCircle className='h-8 w-8 text-destructive' />
      </div>

      <div className='space-y-2 text-center'>
        <h3 className='text-lg font-semibold'>Có lỗi xảy ra</h3>
        <p className='max-w-md text-muted-foreground'>
          {error.message || 'Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.'}
        </p>
      </div>

      <Button onClick={resetError} variant='outline'>
        <RefreshCw className='mr-2 h-4 w-4' />
        Thử lại
      </Button>

      {process.env.NODE_ENV === 'development' && (
        <details className='mt-4 w-full max-w-lg'>
          <summary className='cursor-pointer text-sm text-muted-foreground'>Chi tiết lỗi (Development)</summary>
          <pre className='mt-2 overflow-auto whitespace-pre-wrap rounded bg-muted p-4 text-xs'>{error.stack}</pre>
        </details>
      )}
    </div>
  )
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return <RefreshCw className={`animate-spin ${sizeClasses[size]} ${className}`} />
}

interface DataLoadingProps {
  message?: string
  showSpinner?: boolean
}

export const DataLoading = ({ message = 'Đang tải...', showSpinner = true }: DataLoadingProps) => {
  return (
    <div className='flex items-center justify-center space-x-2 py-8'>
      {showSpinner && <LoadingSpinner />}
      <span className='text-muted-foreground'>{message}</span>
    </div>
  )
}

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className='flex flex-col items-center justify-center space-y-4 py-12'>
      {icon && <div className='text-muted-foreground'>{icon}</div>}
      <div className='space-y-2 text-center'>
        <h3 className='text-lg font-medium'>{title}</h3>
        {description && <p className='max-w-md text-muted-foreground'>{description}</p>}
      </div>
      {action}
    </div>
  )
}

interface QueryErrorProps {
  error: any
  onRetry?: () => void
}

export const QueryError = ({ error, onRetry }: QueryErrorProps) => {
  const errorMessage = error?.message || 'Không thể tải dữ liệu'

  return (
    <div className='flex flex-col items-center justify-center space-y-4 py-8'>
      <div className='rounded-full bg-destructive/10 p-3'>
        <AlertCircle className='h-6 w-6 text-destructive' />
      </div>

      <div className='space-y-2 text-center'>
        <h4 className='font-medium'>Lỗi tải dữ liệu</h4>
        <p className='text-sm text-muted-foreground'>{errorMessage}</p>
      </div>

      {onRetry && (
        <Button onClick={onRetry} variant='outline' size='sm'>
          <RefreshCw className='mr-2 h-4 w-4' />
          Thử lại
        </Button>
      )}
    </div>
  )
}
