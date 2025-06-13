import { Link } from 'react-router-dom'

const RegisterHeader = () => {
  return (
    <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto'>
        <nav className='flex h-16 items-center'>
          <Link to='/' className='flex items-center space-x-3'>
            <Link to='/' className='flex items-center space-x-3'>
              <div className='h-100 relative w-10'>
                <img src='/logo.png' alt='logo' />
              </div>
            </Link>
            <div className='flex flex-col'>
              <span className='text-lg font-semibold text-foreground'>Sporta</span>
              <span className='text-xs text-muted-foreground'>Multi-Sport Platform</span>
            </div>
          </Link>
          <div className='ml-6 flex items-center space-x-2 text-muted-foreground'>
            <div className='h-4 w-px bg-border'></div>
            <span className='text-lg font-medium'>Xác thực</span>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default RegisterHeader
