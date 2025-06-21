export const path = {
  home: '/',
  login: '/login',
  register: '/register',
  logout: '/logout',
  profile: '/profile',
  dashboard: '/dashboard',
  appointments: '/appointments',
  treatments: '/treatments',
  notifications: '/notifications',
  settings: '/settings',

  // Doctor routes
  doctorDashboard: '/doctor/dashboard',
  doctorPatients: '/doctor/patients',
  doctorAppointments: '/doctor/appointments',

  // Admin routes
  adminDashboard: '/admin/dashboard',
  adminUsers: '/admin/users',
  adminSettings: '/admin/settings',

  // Common routes
  doctors: '/doctors',
  testResults: '/test-results',

  // Error pages
  unauthorized: '/unauthorized',
  notFound: '/404',
} as const
