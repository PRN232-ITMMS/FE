import { User } from '@/types/user.type'

export const storeAccessTokenToLocalStorage = (accessToken: string) => {
  return localStorage.setItem('accessToken', accessToken)
}

export const clearAllLocalStorage = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('profile')
}

export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem('accessToken') || ''
}

export const getProfileFromLocalStorage = (): User | null => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileFromLocalStorage = (profile: User) => localStorage.setItem('profile', JSON.stringify(profile))
