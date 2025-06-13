import { ChevronRight, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  const location = useLocation()

  // Auto-generate breadcrumbs from current path if items not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean)

    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Trang chủ', href: '/', icon: Home }]

    // Map path segments to readable labels
    const pathLabels: Record<string, string> = {
      dashboard: 'Tổng quan',
      appointments: 'Lịch hẹn',
      treatments: 'Điều trị',
      'test-results': 'Kết quả xét nghiệm',
      notifications: 'Thông báo',
      profile: 'Thông tin cá nhân',
      settings: 'Cài đặt',
      patients: 'Bệnh nhân',
      doctors: 'Bác sĩ',
      analytics: 'Phân tích',
      help: 'Hỗ trợ',
    }

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1

      breadcrumbs.push({
        label: pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: isLast ? undefined : currentPath,
      })
    })

    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbs()

  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1
        const Icon = item.icon

        return (
          <div key={index} className='flex items-center'>
            {index > 0 && <ChevronRight className='mx-2 h-4 w-4' />}

            {item.href ? (
              <Link to={item.href} className='flex items-center space-x-1 transition-colors hover:text-foreground'>
                {Icon && <Icon className='h-4 w-4' />}
                <span>{item.label}</span>
              </Link>
            ) : (
              <div className={cn('flex items-center space-x-1', isLast ? 'font-medium text-foreground' : '')}>
                {Icon && <Icon className='h-4 w-4' />}
                <span>{item.label}</span>
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
