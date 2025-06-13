import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

const RegisterHeader = () => {
  return (
    <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto'>
        <nav className='flex h-16 items-center'>
          <Link to='/' className='flex items-center space-x-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
              <Heart className='h-6 w-6 text-primary-foreground' />
            </div>
            <div className='flex flex-col'>
              <span className='text-lg font-semibold text-foreground'>ITM System</span>
              <span className='text-xs text-muted-foreground'>Hệ thống Điều trị Hiếm muộn</span>
            </div>
          </Link>
          <div className='ml-6 flex items-center space-x-2 text-muted-foreground'>
            <div className='h-4 w-px bg-border'></div>
            <span className='text-lg font-medium'>Xác thực tài khoản</span>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default RegisterHeader
