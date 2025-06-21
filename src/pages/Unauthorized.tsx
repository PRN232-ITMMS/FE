import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth.store'
import { UserRole } from '@/types/user.type'
import { Shield, ArrowLeft, Home } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import useDocumentTitle from '@/hooks/useDocumentTitle'

const UnauthorizedPage = () => {
  const { profile } = useAuthStore()
  const navigate = useNavigate()

  useDocumentTitle({ title: 'Không có quyền truy cập - ITM System' })

  const getDashboardPath = () => {
    if (!profile) return '/login'
    
    switch (profile.role) {
      case UserRole.Customer:
        return '/dashboard'
      case UserRole.Doctor:
        return '/doctor/dashboard'
      case UserRole.Manager:
      case UserRole.Admin:
        return '/admin/dashboard'
      default:
        return '/dashboard'
    }
  }

  const getRoleName = () => {
    if (!profile) return 'Người dùng'
    
    switch (profile.role) {
      case UserRole.Customer:
        return 'Bệnh nhân'
      case UserRole.Doctor:
        return 'Bác sĩ'
      case UserRole.Manager:
        return 'Quản lý'
      case UserRole.Admin:
        return 'Quản trị viên'
      default:
        return 'Người dùng'
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20">
          <Shield className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-foreground">
          Không có quyền truy cập
        </h1>
        
        <p className="mt-4 text-lg text-muted-foreground">
          Bạn không có quyền truy cập vào trang này
        </p>

        {profile && (
          <div className="mt-4 rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Đăng nhập với vai trò: <span className="font-medium text-foreground">{getRoleName()}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Email: <span className="font-medium text-foreground">{profile.email}</span>
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Button>

          <Button asChild>
            <Link to={getDashboardPath()} className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Về trang chính</span>
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ{' '}
            <a href="mailto:support@itm-system.com" className="text-primary hover:underline">
              bộ phận hỗ trợ
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage
