import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'
import { Heart, Activity, Calendar, FileText, Bell, Users, BarChart3, Settings, HelpCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  className?: string
}

const Sidebar = ({ className }: SidebarProps) => {
  const { profile } = useAuthStore()
  const location = useLocation()

  // Check if current route is active
  const isActiveRoute = (route: string) => {
    return location.pathname === route || location.pathname.startsWith(route + '/')
  }

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        section: 'Chính',
        items: [
          {
            to: '/dashboard',
            icon: Activity,
            label: 'Tổng quan',
            description: 'Dashboard tổng quan',
          },
        ],
      },
    ]

    if (profile?.role === 1) {
      // Customer
      return [
        ...baseItems,
        {
          section: 'Điều trị',
          items: [
            {
              to: '/appointments',
              icon: Calendar,
              label: 'Lịch hẹn',
              description: 'Quản lý cuộc hẹn khám',
            },
            {
              to: '/treatments',
              icon: FileText,
              label: 'Chu kỳ điều trị',
              description: 'Theo dõi quá trình điều trị',
            },
            {
              to: '/test-results',
              icon: BarChart3,
              label: 'Kết quả xét nghiệm',
              description: 'Xem kết quả và báo cáo',
            },
          ],
        },
        {
          section: 'Khác',
          items: [
            {
              to: '/notifications',
              icon: Bell,
              label: 'Thông báo',
              description: 'Tin nhắn và nhắc nhở',
            },
            {
              to: '/help',
              icon: HelpCircle,
              label: 'Hỗ trợ',
              description: 'Trung tâm trợ giúp',
            },
          ],
        },
      ]
    } else if (profile?.role === 2) {
      // Doctor
      return [
        ...baseItems,
        {
          section: 'Bệnh nhân',
          items: [
            {
              to: '/patients',
              icon: Users,
              label: 'Danh sách bệnh nhân',
              description: 'Quản lý bệnh nhân',
            },
            {
              to: '/appointments',
              icon: Calendar,
              label: 'Lịch làm việc',
              description: 'Lịch hẹn và ca trực',
            },
          ],
        },
        {
          section: 'Điều trị',
          items: [
            {
              to: '/treatments',
              icon: FileText,
              label: 'Quản lý điều trị',
              description: 'Chu kỳ và phác đồ điều trị',
            },
            {
              to: '/test-results',
              icon: BarChart3,
              label: 'Kết quả xét nghiệm',
              description: 'Xem và nhập kết quả',
            },
          ],
        },
      ]
    } else {
      // Manager/Admin
      return [
        ...baseItems,
        {
          section: 'Quản lý',
          items: [
            {
              to: '/patients',
              icon: Users,
              label: 'Bệnh nhân',
              description: 'Quản lý danh sách bệnh nhân',
            },
            {
              to: '/doctors',
              icon: Users,
              label: 'Bác sĩ',
              description: 'Quản lý đội ngũ y tế',
            },
            {
              to: '/appointments',
              icon: Calendar,
              label: 'Lịch hẹn',
              description: 'Tổng quan lịch hẹn',
            },
          ],
        },
        {
          section: 'Báo cáo',
          items: [
            {
              to: '/analytics',
              icon: BarChart3,
              label: 'Phân tích',
              description: 'Báo cáo và thống kê',
            },
          ],
        },
        {
          section: 'Hệ thống',
          items: [
            {
              to: '/settings',
              icon: Settings,
              label: 'Cài đặt',
              description: 'Cấu hình hệ thống',
            },
          ],
        },
      ]
    }
  }

  const navigationSections = getNavigationItems()

  return (
    <div className={cn('flex h-full w-64 flex-col border-r bg-background', className)}>
      {/* Sidebar Header */}
      <div className='border-b p-4'>
        <Link to='/' className='flex items-center space-x-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary'>
            <Heart className='h-5 w-5 text-primary-foreground' />
          </div>
          <div>
            <div className='text-sm font-semibold'>ITM System</div>
            <div className='text-xs text-muted-foreground'>Điều trị Hiếm muộn</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className='flex-1 space-y-6 p-4'>
        {navigationSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className='mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
              {section.section}
            </h3>
            <div className='space-y-1'>
              {section.items.map((item) => (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant='ghost'
                    className={cn(
                      'h-auto w-full justify-start p-2',
                      isActiveRoute(item.to) ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'hover:bg-accent'
                    )}
                  >
                    <item.icon className='mr-3 h-4 w-4 flex-shrink-0' />
                    <div className='flex flex-col items-start text-left'>
                      <span className='text-sm font-medium'>{item.label}</span>
                      <span className='text-xs text-muted-foreground'>{item.description}</span>
                    </div>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className='border-t p-4'>
        <div className='flex items-center space-x-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
            <Users className='h-4 w-4 text-primary' />
          </div>
          <div className='min-w-0 flex-1'>
            <div className='truncate text-sm font-medium'>{profile?.fullName}</div>
            <div className='text-xs text-muted-foreground'>
              {profile?.role === 1
                ? 'Bệnh nhân'
                : profile?.role === 2
                  ? 'Bác sĩ'
                  : profile?.role === 3
                    ? 'Quản lý'
                    : 'Quản trị viên'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
