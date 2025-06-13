import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ToastNotificationProps {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive' | 'success' | 'warning'
  onClose: () => void
}

const ToastNotification = ({ title, description, variant = 'default', onClose }: ToastNotificationProps) => {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className='h-5 w-5 text-green-600' />
      case 'destructive':
        return <XCircle className='h-5 w-5 text-red-600' />
      case 'warning':
        return <AlertCircle className='h-5 w-5 text-yellow-600' />
      default:
        return <Info className='h-5 w-5 text-blue-600' />
    }
  }

  const getStyles = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
      case 'destructive':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950'
      default:
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
    }
  }

  return (
    <div className={cn('pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg', getStyles())}>
      <div className='p-4'>
        <div className='flex items-start'>
          <div className='flex-shrink-0'>{getIcon()}</div>
          <div className='ml-3 w-0 flex-1'>
            {title && <p className='text-sm font-medium text-foreground'>{title}</p>}
            {description && <p className={cn('text-sm text-muted-foreground', title ? 'mt-1' : '')}>{description}</p>}
          </div>
          <div className='ml-4 flex flex-shrink-0'>
            <Button variant='ghost' size='sm' className='h-8 w-8 p-0 hover:bg-transparent' onClick={onClose}>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enhanced toast function with medical context
export const showToast = {
  success: (title: string, description?: string) => {
    const { toast } = useToast()
    toast({
      title,
      description,
      variant: 'default', // Will be handled by our custom component
    })
  },

  error: (title: string, description?: string) => {
    const { toast } = useToast()
    toast({
      title,
      description,
      variant: 'destructive',
    })
  },

  warning: (title: string, description?: string) => {
    const { toast } = useToast()
    toast({
      title,
      description,
      variant: 'destructive', // Will be styled as warning
    })
  },

  info: (title: string, description?: string) => {
    const { toast } = useToast()
    toast({
      title,
      description,
    })
  },

  // Medical-specific toast messages
  appointment: {
    scheduled: () => showToast.success('Lịch hẹn đã được đặt', 'Chúng tôi sẽ gửi thông báo nhắc nhở trước 24 giờ'),
    cancelled: () => showToast.info('Lịch hẹn đã được hủy', 'Bạn có thể đặt lịch mới bất cứ lúc nào'),
    rescheduled: () => showToast.success('Lịch hẹn đã được thay đổi', 'Thông tin mới đã được cập nhật'),
  },

  treatment: {
    started: () => showToast.success('Bắt đầu chu kỳ điều trị', 'Chúc bạn có một hành trình thuận lợi'),
    completed: () => showToast.success('Hoàn thành chu kỳ điều trị', 'Kết quả sẽ có trong vài ngày tới'),
    reminder: () => showToast.info('Nhắc nhở uống thuốc', 'Đã đến giờ uống thuốc theo chỉ định'),
  },

  profile: {
    updated: () => showToast.success('Cập nhật thông tin thành công', 'Thông tin cá nhân đã được lưu'),
    passwordChanged: () => showToast.success('Đổi mật khẩu thành công', 'Mật khẩu mới đã được cập nhật'),
  },
}

export default ToastNotification
