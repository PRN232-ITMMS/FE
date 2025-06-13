import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { path } from '@/constants/path'
import MainLayout from '@/layouts/MainLayout'
import RegisterLayout from '@/layouts/RegisterLayout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import Home from '@/pages/Home'
import Dashboard from '@/pages/Dashboard'

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
    {
      path: '/',
      index: true,
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      ),
    },
    {
      path: '/',
      element: <ProtectedRoutes />,
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
          path: path.dashboard,
          element: <Dashboard />,
        },
      ],
    },
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
  ])

  return routeElements
}
