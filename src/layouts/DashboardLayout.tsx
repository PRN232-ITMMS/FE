import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type DashboardLayoutProps = {
  children?: React.ReactNode
  className?: string
}

function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <div className='flex flex-1 overflow-hidden'>
        {/* Desktop Sidebar */}
        <div className='hidden lg:block'>
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className='fixed inset-0 z-50 lg:hidden'>
            <div className='absolute inset-0 bg-black/50' onClick={() => setSidebarOpen(false)} />
            <div className='absolute left-0 top-0 h-full'>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={cn('flex-1 overflow-y-auto', className)}>{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
