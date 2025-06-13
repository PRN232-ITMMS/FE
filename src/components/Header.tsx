import authAPI from '@/apis/auth.api'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { path } from '@/constants/path'
import { useAuthStore } from '@/stores/auth.store'
import { useMutation } from '@tanstack/react-query'
import { Globe, LogOut, User } from 'lucide-react'
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
            <div className='h-100 relative w-10'>
              <img src='/logo.png' alt='logo' />
            </div>
            <div className='flex flex-col'>
              <span className='text-lg font-semibold text-foreground'>Sporta</span>
              <span className='text-xs text-muted-foreground'>Multi-Sport Platform</span>
            </div>
          </Link>

          {/* Right side */}
          <div className='flex items-center space-x-2'>
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='h-9 px-3'>
                  <Globe className='mr-2 h-4 w-4' />
                  <span className='text-sm'>VN</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem className='cursor-pointer'>
                  <span className='font-medium'>Tiếng Việt</span>
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer'>
                  <span>English</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu or Auth Links */}
            {isAuthenticated && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='sm' className='h-9 px-3'>
                    <div className='mr-2 h-6 w-6 flex-shrink-0'>
                      <img
                        src='https://i.pinimg.com/736x/89/fa/21/89fa2105a7a5d0ef0f0cc7e434f36368.jpg'
                        alt='avatar'
                        className='h-full w-full rounded-full object-cover'
                      />
                    </div>
                    <span className='text-sm'>{profile.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem asChild>
                    <Link to={path.profile} className='flex cursor-pointer items-center'>
                      <User className='mr-2 h-4 w-4' />
                      Tài khoản của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className='flex cursor-pointer items-center'>
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
