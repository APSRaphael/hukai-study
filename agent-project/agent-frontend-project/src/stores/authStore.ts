import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  setTokens: (tokens: AuthTokens) => void
  clearTokens: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      setTokens: ({ accessToken, refreshToken }) => set({ accessToken, refreshToken }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
      isAuthenticated: () => Boolean(get().accessToken),
    }),
    { name: 'agent-auth', storage: createJSONStorage(() => localStorage) },
  ),
)
