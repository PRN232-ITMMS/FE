import { User } from '@/types/user.type'

// Token storage keys
const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'
const PROFILE_KEY = 'profile'
const TOKEN_EXPIRY_KEY = 'tokenExpiryTime'
const AUTH_STORAGE_KEY = 'itm-auth-storage'

// Access token utilities
export const storeAccessTokenToLocalStorage = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

export const getAccessTokenFromLocalStorage = (): string => {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || ''
}

// Refresh token utilities
export const storeRefreshTokenToLocalStorage = (refreshToken: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const getRefreshTokenFromLocalStorage = (): string => {
  return localStorage.getItem(REFRESH_TOKEN_KEY) || ''
}

// Token expiry utilities
export const storeTokenExpiryTime = (expiryTime: string | number) => {
  const timestamp = typeof expiryTime === 'string' ? new Date(expiryTime).getTime() : expiryTime
  localStorage.setItem(TOKEN_EXPIRY_KEY, timestamp.toString())
}

export const getTokenExpiryTime = (): number | null => {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
  return expiry ? parseInt(expiry, 10) : null
}

export const isTokenExpired = (): boolean => {
  const expiryTime = getTokenExpiryTime()
  if (!expiryTime) return true

  // Check if token expires in the next 5 minutes
  const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000
  return expiryTime <= fiveMinutesFromNow
}

export const isTokenNearExpiry = (thresholdMinutes = 10): boolean => {
  const expiryTime = getTokenExpiryTime()
  if (!expiryTime) return true

  const thresholdTime = Date.now() + thresholdMinutes * 60 * 1000
  return expiryTime <= thresholdTime
}

// Profile utilities
export const setProfileFromLocalStorage = (profile: User) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export const getProfileFromLocalStorage = (): User | null => {
  const result = localStorage.getItem(PROFILE_KEY)
  try {
    return result ? JSON.parse(result) : null
  } catch (error) {
    console.error('Error parsing profile from localStorage:', error)
    return null
  }
}

// Clear all authentication data
export const clearAllLocalStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(PROFILE_KEY)
  localStorage.removeItem(TOKEN_EXPIRY_KEY)
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

// Store all auth data at once
export const storeAuthData = (authData: {
  accessToken: string
  refreshToken: string
  user: User
  expiresAt: string
}) => {
  storeAccessTokenToLocalStorage(authData.accessToken)
  storeRefreshTokenToLocalStorage(authData.refreshToken)
  setProfileFromLocalStorage(authData.user)
  storeTokenExpiryTime(authData.expiresAt)
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const accessToken = getAccessTokenFromLocalStorage()
  const profile = getProfileFromLocalStorage()

  return !!(accessToken && profile && !isTokenExpired())
}

// Get authentication status
export const getAuthStatus = () => {
  const accessToken = getAccessTokenFromLocalStorage()
  const refreshToken = getRefreshTokenFromLocalStorage()
  const profile = getProfileFromLocalStorage()
  const isExpired = isTokenExpired()
  const isNearExpiry = isTokenNearExpiry()

  return {
    hasAccessToken: !!accessToken,
    hasRefreshToken: !!refreshToken,
    hasProfile: !!profile,
    isExpired,
    isNearExpiry,
    isAuthenticated: !!(accessToken && profile && !isExpired),
    canRefresh: !!(refreshToken && !isExpired),
  }
}

// Validate stored auth data
export const validateStoredAuthData = (): boolean => {
  try {
    const accessToken = getAccessTokenFromLocalStorage()
    const profile = getProfileFromLocalStorage()

    if (!accessToken || !profile) {
      clearAllLocalStorage()
      return false
    }

    if (isTokenExpired()) {
      // Don't clear immediately, might be able to refresh
      return false
    }

    return true
  } catch (error) {
    console.error('Error validating auth data:', error)
    clearAllLocalStorage()
    return false
  }
}

// Parse JWT token (without verification)
export const parseJwtToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('Error parsing JWT token:', error)
    return null
  }
}

// Get token expiry from JWT
export const getTokenExpiryFromJwt = (token: string): number | null => {
  const payload = parseJwtToken(token)
  return payload?.exp ? payload.exp * 1000 : null
}

// Auto-update expiry time when storing access token
export const storeAccessTokenWithExpiry = (accessToken: string) => {
  storeAccessTokenToLocalStorage(accessToken)

  const expiryTime = getTokenExpiryFromJwt(accessToken)
  if (expiryTime) {
    storeTokenExpiryTime(expiryTime)
  }
}

// Helper to handle auth errors
export const handleAuthError = () => {
  clearAllLocalStorage()

  // Only redirect if not already on auth pages
  const currentPath = window.location.pathname
  const authPaths = ['/login', '/register', '/forgot-password', '/reset-password']

  if (!authPaths.includes(currentPath)) {
    const redirectUrl = encodeURIComponent(currentPath + window.location.search)
    window.location.href = `/login?redirect=${redirectUrl}`
  }
}

// Session management
export const startAuthSession = (authData: {
  accessToken: string
  refreshToken: string
  user: User
  expiresAt: string
}) => {
  storeAuthData(authData)

  // You could also start any session-related timers or listeners here
  console.log('Auth session started for user:', authData.user.email)
}

export const endAuthSession = () => {
  clearAllLocalStorage()

  // Clean up any session-related timers or listeners
  console.log('Auth session ended')
}

// Role-based utilities
export const hasRole = (requiredRole: string | string[]): boolean => {
  const profile = getProfileFromLocalStorage()
  if (!profile) return false

  const userRole = profile.role?.toString() || ''
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]

  return roles.includes(userRole)
}

export const isAdmin = (): boolean => hasRole('4') // Admin role
export const isDoctor = (): boolean => hasRole('2') // Doctor role
export const isCustomer = (): boolean => hasRole('1') // Customer role
export const isManager = (): boolean => hasRole('3') // Manager role
