import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { path } from '@/constants/path'
import MainLayout from '@/layouts/MainLayout'
import RegisterLayout from '@/layouts/RegisterLayout'
import { ProtectedRouteWrapper } from '@/components/auth/ProtectedRoute'
import { UserRole } from '@/types/user.type'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import Home from '@/pages/Home'
import Dashboard from '@/pages/Dashboard'
import UnauthorizedPage from '@/pages/Unauthorized'
import DoctorsPage from '@/pages/Doctors'

export const ProtectedRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

export const RejectedRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export const useRouteElements = () => {
  const routeElements = useRoutes([
    // Public routes
    {
      path: '/',
      index: true,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      ),
    },

    // Auth routes (for non-authenticated users)
    {
      path: '/',
      element: <RejectedRoutes />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          ),
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          ),
        },
      ],
    },

    // Protected routes - Customer only
    {
      path: '/',
      element: <ProtectedRouteWrapper requiredRoles={[UserRole.Customer]} />,
      children: [
        {
          path: path.dashboard,
          element: <Dashboard />,
        },
        {
          path: path.appointments,
          element: (
            <MainLayout>
              <div>Customer Appointments Page - Coming Soon</div>
            </MainLayout>
          ),
        },
        {
          path: path.treatments,
          element: (
            <MainLayout>
              <div>Customer Treatments Page - Coming Soon</div>
            </MainLayout>
          ),
        },
        {
          path: '/test-results',
          element: (
            <MainLayout>
              <div>Customer Test Results Page - Coming Soon</div>
            </MainLayout>
          ),
        },
        {
          path: '/doctors',
          element: <DoctorsPage />,
        },
      ],
    },

    // Protected routes - Doctor only
    {
      path: '/doctor',
      element: <ProtectedRouteWrapper requiredRoles={[UserRole.Doctor]} />,
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />, // Doctor dashboard
        },
        {
          path: 'patients',
          element: (
            <MainLayout>
              <div>Doctor Patients Page - Coming Soon</div>
            </MainLayout>
          ),
        },
        {
          path: 'appointments',
          element: (
            <MainLayout>
              <div>Doctor Appointments Page - Coming Soon</div>
            </MainLayout>
          ),
        },
      ],
    },

    // Protected routes - Manager/Admin only
    {
      path: '/admin',
      element: <ProtectedRouteWrapper requiredRoles={[UserRole.Manager, UserRole.Admin]} />,
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />, // Admin dashboard
        },
        {
          path: 'users',
          element: (
            <MainLayout>
              <div>User Management Page - Coming Soon</div>
            </MainLayout>
          ),
        },
        {
          path: 'settings',
          element: (
            <MainLayout>
              <div>System Settings Page - Coming Soon</div>
            </MainLayout>
          ),
        },
      ],
    },

    // Common protected routes (all authenticated users)
    {
      path: '/',
      element: <ProtectedRouteWrapper />,
      children: [
        {
          path: path.profile,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          ),
        },
        {
          path: path.notifications,
          element: (
            <MainLayout>
              <div>Notifications Page - Coming Soon</div>
            </MainLayout>
          ),
        },
      ],
    },

    // Error pages
    {
      path: '/unauthorized',
      element: <UnauthorizedPage />,
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <div className='flex min-h-[50vh] items-center justify-center'>
            <div className='text-center'>
              <h1 className='text-4xl font-bold'>404</h1>
              <p className='mt-2 text-muted-foreground'>Trang không tồn tại</p>
            </div>
          </div>
        </MainLayout>
      ),
    },
  ])

  return routeElements
}
