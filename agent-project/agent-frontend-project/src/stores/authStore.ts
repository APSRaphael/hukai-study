import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export type UserInfo = {
  id: number
  username: string
  avatar: string | null
}

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: UserInfo | null
  setTokens: (tokens: AuthTokens) => void
  setUser: (user: UserInfo | null) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
      isAuthenticated: () => Boolean(get().accessToken),
    }),
    { name: 'agent-auth', storage: createJSONStorage(() => localStorage) },
  ),
)
