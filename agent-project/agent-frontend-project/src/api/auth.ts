import { apiClient } from '@/api/client'
import type { UserInfo } from '@/stores/authStore'

export type LoginPayload = {
  username: string
  password: string
}

export type RegisterPayload = LoginPayload

export type TokenResponse = {
  access_token: string
  refresh_token: string
  token_type: string
}

export type UserOut = UserInfo

export type UploadOut = {
  file_path: string
  file_type: string
  file_hash: string
  avatar: string | null
}

export async function loginApi(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>('/auth/login', payload, {
    skipErrorToast: true,
  })
  return data
}

export async function registerApi(payload: RegisterPayload): Promise<UserOut> {
  const { data } = await apiClient.post<UserOut>('/auth/register', payload, {
    skipErrorToast: true,
  })
  return data
}

export async function fetchMeApi(): Promise<UserOut> {
  const { data } = await apiClient.get<UserOut>('/auth/me', {
    skipErrorToast: true,
  })
  return data
}

export async function uploadAvatarApi(file: File): Promise<UploadOut> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post<UploadOut>('/upload/file', formData, {
    skipErrorToast: true,
  })
  return data
}
