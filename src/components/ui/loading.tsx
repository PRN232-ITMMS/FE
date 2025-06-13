import { Loader2, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'medical'
}

export const LoadingSpinner = ({ className, size = 'md', variant = 'default' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  if (variant === 'medical') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <Heart className={cn('animate-pulse text-primary', sizeClasses[size])} />
      </div>
    )
  }

  return <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
}

interface LoadingPageProps {
  message?: string
  variant?: 'default' | 'medical'
}

export const LoadingPage = ({ message = 'Đang tải...', variant = 'medical' }: LoadingPageProps) => {
  return (
    <div className='flex min-h-[50vh] items-center justify-center'>
      <div className='flex flex-col items-center space-y-4'>
        <LoadingSpinner size='lg' variant={variant} />
        <p className='text-muted-foreground'>{message}</p>
      </div>
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  children: React.ReactNode
}

export const LoadingOverlay = ({ isLoading, message = 'Đang xử lý...', children }: LoadingOverlayProps) => {
  return (
    <div className='relative'>
      {children}
      {isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm'>
          <div className='flex flex-col items-center space-y-4'>
            <LoadingSpinner size='lg' variant='medical' />
            <p className='text-sm text-muted-foreground'>{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}
