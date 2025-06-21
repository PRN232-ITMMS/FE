import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { UserRole } from '@/types/user.type'

interface ProtectedRouteProps {
  children?: React.ReactNode
  requiredRoles?: UserRole[]
  redirectTo?: string
  showUnauthorized?: boolean
}

export const ProtectedRoute = ({
  children,
  requiredRoles = [],
  redirectTo = '/login',
  showUnauthorized = true,
}: ProtectedRouteProps) => {
  const { isAuthenticated, profile } = useAuthStore()
  const location = useLocation()

  // Not authenticated - redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // No profile data - redirect to login
  if (!profile) {
    return <Navigate to={redirectTo} replace />
  }

  // Role-based access control
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(profile.role)

    if (!hasRequiredRole) {
      if (showUnauthorized) {
        return <Navigate to='/unauthorized' replace />
      }
      // Redirect to appropriate dashboard based on user role
      const dashboardPath = getDashboardPath(profile.role)
      return <Navigate to={dashboardPath} replace />
    }
  }

  return <>{children}</>
}

// Use as route wrapper - for react-router routes
export const ProtectedRouteWrapper = ({
  requiredRoles = [],
  redirectTo = '/login',
  showUnauthorized = true,
}: Omit<ProtectedRouteProps, 'children'>) => {
  const { isAuthenticated, profile } = useAuthStore()
  const location = useLocation()

  // Not authenticated - redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // No profile data - redirect to login
  if (!profile) {
    return <Navigate to={redirectTo} replace />
  }

  // Role-based access control
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.includes(profile.role)

    if (!hasRequiredRole) {
      if (showUnauthorized) {
        return <Navigate to='/unauthorized' replace />
      }
      // Redirect to appropriate dashboard based on user role
      const dashboardPath = getDashboardPath(profile.role)
      return <Navigate to={dashboardPath} replace />
    }
  }

  // Return Outlet for nested routes
  return <Outlet />
}

// Helper function to get dashboard path based on role
const getDashboardPath = (role: UserRole): string => {
  switch (role) {
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

// Higher-order component for protecting components
export const withRoleProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  requiredRoles: UserRole[]
) => {
  return (props: P) => (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <WrappedComponent {...props} />
    </ProtectedRoute>
  )
}

export default ProtectedRoute
