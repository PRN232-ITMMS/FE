import authAPI from '@/apis/auth.api'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { path } from '@/constants/path'
import { useAuthStore } from '@/stores/auth.store'
import { useMutation } from '@tanstack/react-query'
import { Heart, LogOut, User, Calendar, FileText, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'

const Header = () => {
  const { isAuthenticated, profile, logout } = useAuthStore()

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      logout()
    },
  })

  const handleLogout = () => logoutMutation.mutate()

  return (
    <div className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto'>
        <div className='flex h-16 items-center justify-between'>
          {/* Logo */}
          <Link to='/' className='flex items-center space-x-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
              <Heart className='h-6 w-6 text-primary-foreground' />
            </div>
            <div className='flex flex-col'>
              <span className='text-lg font-semibold text-foreground'>ITM System</span>
              <span className='text-xs text-muted-foreground'>Hệ thống Điều trị Hiếm muộn</span>
            </div>
          </Link>

          {/* Navigation Menu (for authenticated users) */}
          {isAuthenticated && (
            <div className='hidden items-center space-x-6 md:flex'>
              <Link
                to='/dashboard'
                className='flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
              >
                <Activity className='h-4 w-4' />
                <span>Tổng quan</span>
              </Link>
              <Link
                to='/appointments'
                className='flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
              >
                <Calendar className='h-4 w-4' />
                <span>Lịch hẹn</span>
              </Link>
              <Link
                to='/treatments'
                className='flex items-center space-x-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground'
              >
                <FileText className='h-4 w-4' />
                <span>Điều trị</span>
              </Link>
            </div>
          )}

          {/* Right side */}
          <div className='flex items-center space-x-2'>
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu or Auth Links */}
            {isAuthenticated && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm' className='h-9 px-3'>
                    <div className='mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10'>
                      <User className='h-4 w-4 text-primary' />
                    </div>
                    <div className='flex flex-col items-start'>
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
                  <DropdownMenuItem onClick={handleLogout} className='flex cursor-pointer items-center text-red-600'>
                    <LogOut className='mr-2 h-4 w-4' />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className='flex items-center space-x-2'>
                <Button variant='ghost' size='sm' asChild>
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
  )
}

export default Header
