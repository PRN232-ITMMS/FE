import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@/types/user.type'
import { clearAllLocalStorage, getAccessTokenFromLocalStorage, getProfileFromLocalStorage } from '@/utils/auth'

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
        logout: () => {
          clearAllLocalStorage()
          set({ isAuthenticated: false, profile: null })
        },
      }),
      {
        name: 'itm-auth-storage',
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          profile: state.profile,
        }),
      }
    ),
    {
      name: 'itm-auth-store',
    }
  )
)
