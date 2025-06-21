import authAPI from '@/apis/auth.api'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { path } from '@/constants/path'
import { useAuthStore } from '@/stores/auth.store'
import { useRoleCheck } from '@/components/auth/RoleGuard'
import { useMutation } from '@tanstack/react-query'
import {
  Heart,
  LogOut,
  User,
  Calendar,
  FileText,
  Activity,
  Menu,
  X,
  Bell,
  Settings,
  Users,
  BarChart3,
  Stethoscope,
  UserPlus,
  Shield,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Header = () => {
  const { isAuthenticated, profile, logout } = useAuthStore()
  const { isCustomer, isDoctor, isManager, isAdmin } = useRoleCheck()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      logout()
    },
  })

  const handleLogout = () => logoutMutation.mutate()

  // Check if current route is active
  const isActiveRoute = (route: string) => {
    return location.pathname === route || location.pathname.startsWith(route + '/')
  }

  // Role-based navigation items
  const getNavigationItems = () => {
    if (isCustomer()) {
      return [
        {
          to: '/dashboard',
          icon: Activity,
          label: 'Tổng quan',
          description: 'Dashboard cá nhân',
        },
        {
          to: '/doctors',
          icon: Stethoscope,
          label: 'Bác sĩ',
          description: 'Tìm bác sĩ phù hợp',
        },
        {
          to: '/appointments',
          icon: Calendar,
          label: 'Lịch hẹn',
          description: 'Quản lý cuộc hẹn',
        },
        {
          to: '/treatments',
          icon: FileText,
          label: 'Điều trị',
          description: 'Chu kỳ của tôi',
        },
        {
          to: '/test-results',
          icon: BarChart3,
          label: 'Kết quả',
          description: 'Xét nghiệm',
        },
      ]
    } else if (isDoctor()) {
      return [
        {
          to: '/doctor/dashboard',
          icon: Activity,
          label: 'Tổng quan',
          description: 'Dashboard bác sĩ',
        },
        {
          to: '/doctor/patients',
          icon: Users,
          label: 'Bệnh nhân',
          description: 'Danh sách bệnh nhân',
        },
        {
          to: '/doctor/appointments',
          icon: Calendar,
          label: 'Lịch làm việc',
          description: 'Lịch hẹn hôm nay',
        },
        {
          to: '/treatments',
          icon: FileText,
          label: 'Điều trị',
          description: 'Quản lý chu kỳ',
        },
        {
          to: '/test-results',
          icon: BarChart3,
          label: 'Kết quả',
          description: 'Xem & nhập kết quả',
        },
      ]
    } else if (isManager() || isAdmin()) {
      return [
        {
          to: '/admin/dashboard',
          icon: Activity,
          label: 'Tổng quan',
          description: 'Dashboard quản lý',
        },
        {
          to: '/doctors',
          icon: Stethoscope,
          label: 'Bác sĩ',
          description: 'Quản lý đội ngũ',
        },
        {
          to: '/patients',
          icon: Users,
          label: 'Bệnh nhân',
          description: 'Quản lý bệnh nhân',
        },
        {
          to: '/appointments',
          icon: Calendar,
          label: 'Lịch hẹn',
          description: 'Tổng quan lịch hẹn',
        },
        {
          to: '/analytics',
          icon: BarChart3,
          label: 'Báo cáo',
          description: 'Phân tích dữ liệu',
        },
      ]
    }

    // Default fallback
    return [
      {
        to: '/dashboard',
        icon: Activity,
        label: 'Tổng quan',
        description: 'Dashboard',
      },
    ]
  }

  const navigationItems = getNavigationItems()

  // Get role display name
  const getRoleDisplayName = () => {
    if (isCustomer()) return 'Bệnh nhân'
    if (isDoctor()) return 'Bác sĩ'
    if (isManager()) return 'Quản lý'
    if (isAdmin()) return 'Quản trị viên'
    return 'Người dùng'
  }

  // Get role icon
  const getRoleIcon = () => {
    if (isCustomer()) return UserPlus
    if (isDoctor()) return Stethoscope
    if (isManager() || isAdmin()) return Shield
    return User
  }

  const RoleIcon = getRoleIcon()

  return (
    <>
      <div className='sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto'>
          <div className='flex h-16 items-center justify-between'>
            {/* Logo */}
            <Link to='/' className='flex items-center space-x-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
                <Heart className='h-6 w-6 text-primary-foreground' />
              </div>
              <div className='hidden flex-col sm:flex'>
                <span className='text-lg font-semibold text-foreground'>ITM System</span>
                <span className='text-xs text-muted-foreground'>
                  {isCustomer()
                    ? 'Hệ thống Điều trị Hiếm muộn'
                    : isDoctor()
                      ? 'Hệ thống Quản lý Bệnh nhân'
                      : 'Hệ thống Quản lý Y tế'}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Menu */}
            {isAuthenticated && (
              <nav className='hidden items-center space-x-4 lg:flex'>
                {navigationItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActiveRoute(item.to)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <item.icon className='h-4 w-4' />
                    <span className='hidden xl:inline'>{item.label}</span>
                  </Link>
                ))}
              </nav>
            )}

            {/* Right side */}
            <div className='flex items-center space-x-2'>
              {/* Notifications Bell (for authenticated users) */}
              {isAuthenticated && (
                <Button variant='ghost' size='sm' asChild className='relative'>
                  <Link to='/notifications'>
                    <Bell className='h-4 w-4' />
                    {/* Notification badge */}
                    <span className='absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500'></span>
                  </Link>
                </Button>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu Button */}
              {isAuthenticated && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='lg:hidden'
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
                </Button>
              )}

              {/* User Menu or Auth Links */}
              {isAuthenticated && profile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='sm' className='h-9 px-3'>
                      <div
                        className={`mr-2 flex h-7 w-7 items-center justify-center rounded-full ${
                          isCustomer()
                            ? 'bg-blue-100 text-blue-600'
                            : isDoctor()
                              ? 'bg-green-100 text-green-600'
                              : 'bg-purple-100 text-purple-600'
                        }`}
                      >
                        <RoleIcon className='h-4 w-4' />
                      </div>
                      <div className='hidden flex-col items-start md:flex'>
                        <span className='text-sm font-medium'>{profile.fullName}</span>
                        <span className='text-xs text-muted-foreground'>{getRoleDisplayName()}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56'>
                    <div className='p-2'>
                      <p className='text-sm font-medium'>{profile.fullName}</p>
                      <p className='text-xs text-muted-foreground'>{profile.email}</p>
                      <div
                        className={`mt-1 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          isCustomer()
                            ? 'bg-blue-100 text-blue-800'
                            : isDoctor()
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        <RoleIcon className='mr-1 h-3 w-3' />
                        {getRoleDisplayName()}
                      </div>
                    </div>

                    <DropdownMenuItem asChild>
                      <Link to={path.profile} className='flex cursor-pointer items-center'>
                        <User className='mr-2 h-4 w-4' />
                        Thông tin cá nhân
                      </Link>
                    </DropdownMenuItem>

                    {(isManager() || isAdmin()) && (
                      <DropdownMenuItem asChild>
                        <Link to='/admin/settings' className='flex cursor-pointer items-center'>
                          <Settings className='mr-2 h-4 w-4' />
                          Cài đặt hệ thống
                        </Link>
                      </DropdownMenuItem>
                    )}

                    <DropdownMenuItem asChild>
                      <Link to='/notifications' className='flex cursor-pointer items-center'>
                        <Bell className='mr-2 h-4 w-4' />
                        Thông báo
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={handleLogout} className='flex cursor-pointer items-center text-red-600'>
                      <LogOut className='mr-2 h-4 w-4' />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className='flex items-center space-x-2'>
                  <Button variant='ghost' size='sm' asChild className='hidden sm:inline-flex'>
                    <Link to={path.register}>Đăng ký</Link>
                  </Button>
                  <Button size='sm' asChild>
                    <Link to={path.login}>Đăng nhập</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isAuthenticated && isMobileMenuOpen && (
        <div className='border-b bg-background lg:hidden'>
          <div className='container mx-auto py-4'>
            {/* Role Badge for Mobile */}
            <div className='mb-4 flex items-center justify-center'>
              <div
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  isCustomer()
                    ? 'bg-blue-100 text-blue-800'
                    : isDoctor()
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                }`}
              >
                <RoleIcon className='mr-2 h-4 w-4' />
                {getRoleDisplayName()} - {profile?.fullName}
              </div>
            </div>

            <nav className='space-y-2'>
              {navigationItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-3 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                    isActiveRoute(item.to)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className='h-5 w-5' />
                  <div>
                    <div className='font-medium'>{item.label}</div>
                    <div className='text-xs text-muted-foreground'>{item.description}</div>
                  </div>
                </Link>
              ))}

              {/* Additional Mobile Menu Items */}
              <Link
                to='/notifications'
                className='flex items-center space-x-3 rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Bell className='h-5 w-5' />
                <div>
                  <div className='font-medium'>Thông báo</div>
                  <div className='text-xs text-muted-foreground'>Tin nhắn và nhắc nhở</div>
                </div>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
