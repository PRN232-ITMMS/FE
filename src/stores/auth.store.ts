import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@/types/user.type'
import { getAccessTokenFromLocalStorage, getProfileFromLocalStorage } from '@/utils/auth'

interface AuthState {
  isAuthenticated: boolean
  profile: User | null
  setIsAuthenticated: (isAuthenticated: boolean) => void
  setProfile: (profile: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: !!getAccessTokenFromLocalStorage(),
        profile: getProfileFromLocalStorage(),
        setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setProfile: (profile) => set({ profile }),
        logout: () => set({ isAuthenticated: false, profile: null }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          profile: state.profile,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)
