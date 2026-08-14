import { apiClient } from '@/api/client'

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

export type UserOut = {
  id: number
  username: string
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
