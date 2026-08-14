import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { useAuthStore } from '@/stores/authStore'
import { getErrorMessage } from '@/utils/errorMessage'
import { toastError } from '@/utils/toast'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '/api'

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

export const apiClient = axios.create({
  baseURL,
  timeout: 15_000,
})

function isAuthPublicPath(url?: string): boolean {
  if (!url) return false
  return /\/auth\/(login|register|refresh)\b/.test(url)
}

function redirectToLogin() {
  const path = window.location.pathname
  if (path === '/login' || path === '/register') return
  window.location.assign('/login')
}

let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken
  if (!refreshToken) return null

  const { data } = await axios.post<{
    access_token: string
    refresh_token: string
  }>(`${baseURL}/auth/refresh`, { refresh_token: refreshToken })

  useAuthStore.getState().setTokens({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  })
  return data.access_token
}

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined
    const status = error.response?.status
    const silent = Boolean(config?.skipErrorToast)

    // 401：尝试 refresh 后重试；公开鉴权接口或已重试则清 token 并跳登录
    if (status === 401 && config && !isAuthPublicPath(config.url)) {
      if (config._retry || !useAuthStore.getState().refreshToken) {
        useAuthStore.getState().clearAuth()
        if (!silent) toastError(getErrorMessage(error, '登录已失效，请重新登录'))
        redirectToLogin()
        return Promise.reject(error)
      }

      config._retry = true
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null
        })
        const accessToken = await refreshPromise
        if (!accessToken) {
          useAuthStore.getState().clearAuth()
          if (!silent) toastError('登录已失效，请重新登录')
          redirectToLogin()
          return Promise.reject(error)
        }
        config.headers.Authorization = `Bearer ${accessToken}`
        return apiClient.request(config)
      } catch (refreshError) {
        useAuthStore.getState().clearAuth()
        if (!silent) {
          toastError(getErrorMessage(refreshError, '登录已失效，请重新登录'))
        }
        redirectToLogin()
        return Promise.reject(refreshError)
      }
    }

    if (!silent) {
      toastError(getErrorMessage(error))
    }
    return Promise.reject(error)
  },
)
