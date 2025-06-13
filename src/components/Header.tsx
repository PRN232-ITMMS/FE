import authAPI from '@/apis/auth.api'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { path } from '@/constants/path'
import { useAuthStore } from '@/stores/auth.store'
import { useMutation } from '@tanstack/react-query'
import { Heart, LogOut, User, Calendar, FileText, Activity, Menu, X, Bell, Settings } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Header = () => {
  const { isAuthenticated, profile, logout } = useAuthStore()
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
    return location.pathname === route
  }

  // Navigation items for authenticated users
  const navigationItems = [
    {
      to: '/dashboard',
      icon: Activity,
      label: 'Tổng quan',
      description: 'Dashboard và thống kê',
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
      description: 'Chu kỳ điều trị',
    },
    {
      to: '/notifications',
      icon: Bell,
      label: 'Thông báo',
      description: 'Tin nhắn và nhắc nhở',
    },
  ]

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
                <span className='text-xs text-muted-foreground'>Hệ thống Điều trị Hiếm muộn</span>
              </div>
            </Link>

            {/* Desktop Navigation Menu */}
            {isAuthenticated && (
              <nav className='hidden items-center space-x-6 lg:flex'>
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
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            )}

            {/* Right side */}
            <div className='flex items-center space-x-2'>
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
                      <div className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10'>
                        <User className='h-4 w-4 text-primary' />
                      </div>
                      <div className='hidden flex-col items-start md:flex'>
                        <span className='text-sm font-medium'>{profile.fullName}</span>
                        <span className='text-xs text-muted-foreground'>
                          {profile.role === 1
                            ? 'Bệnh nhân'
                            : profile.role === 2
                              ? 'Bác sĩ'
                              : profile.role === 3
                                ? 'Quản lý'
                                : 'Quản trị viên'}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56'>
                    <div className='p-2'>
                      <p className='text-sm font-medium'>{profile.fullName}</p>
                      <p className='text-xs text-muted-foreground'>{profile.email}</p>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to={path.profile} className='flex cursor-pointer items-center'>
                        <User className='mr-2 h-4 w-4' />
                        Thông tin cá nhân
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to='/settings' className='flex cursor-pointer items-center'>
                        <Settings className='mr-2 h-4 w-4' />
                        Cài đặt
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
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
