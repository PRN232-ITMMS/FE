import { useAuthStore } from '@/stores/auth.store'
import { UserRole } from '@/types/user.type'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
  fallback?: React.ReactNode
  showFallback?: boolean
}

export const RoleGuard = ({ allowedRoles, children, fallback = null, showFallback = true }: RoleGuardProps) => {
  const { profile } = useAuthStore()

  // No profile - don't show content
  if (!profile) {
    return showFallback ? <>{fallback}</> : null
  }

  // Check if user has required role
  const hasRequiredRole = allowedRoles.includes(profile.role)

  if (!hasRequiredRole) {
    return showFallback ? <>{fallback}</> : null
  }

  return <>{children}</>
}

// Utility hooks for role checking
export const useRoleCheck = () => {
  const { profile } = useAuthStore()

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!profile) return false

    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(profile.role)
  }

  const isCustomer = (): boolean => hasRole(UserRole.Customer)
  const isDoctor = (): boolean => hasRole(UserRole.Doctor)
  const isManager = (): boolean => hasRole(UserRole.Manager)
  const isAdmin = (): boolean => hasRole(UserRole.Admin)
  const isStaff = (): boolean => hasRole([UserRole.Doctor, UserRole.Manager, UserRole.Admin])
  const isAdminOrManager = (): boolean => hasRole([UserRole.Manager, UserRole.Admin])

  return {
    hasRole,
    isCustomer,
    isDoctor,
    isManager,
    isAdmin,
    isStaff,
    isAdminOrManager,
    currentRole: profile?.role,
  }
}

// Higher-order component for conditional rendering based on roles
export const withRoleGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: UserRole[],
  fallback?: React.ReactNode
) => {
  return (props: P) => (
    <RoleGuard allowedRoles={allowedRoles} fallback={fallback}>
      <WrappedComponent {...props} />
    </RoleGuard>
  )
}

export default RoleGuard
