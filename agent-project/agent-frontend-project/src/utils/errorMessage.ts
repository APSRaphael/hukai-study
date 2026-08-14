/** 从后端统一错误体或 Axios 错误中提取可读文案。 */

export type ApiErrorBody = {
  code?: number
  message?: string
  detail?: unknown
}

export function getErrorMessage(
  error: unknown,
  fallback = '请求失败，请稍后重试',
): string {
  if (typeof error === 'string' && error.trim()) return error

  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const ax = error as {
      response?: { data?: ApiErrorBody | string; status?: number }
      message?: string
    }
    const data = ax.response?.data
    if (typeof data === 'string' && data.trim()) return data
    if (data && typeof data === 'object') {
      if (typeof data.message === 'string' && data.message.trim()) {
        return data.message
      }
      const detail = data.detail
      if (typeof detail === 'string' && detail.trim()) return detail
      if (
        detail &&
        typeof detail === 'object' &&
        'errors' in detail &&
        Array.isArray((detail as { errors: unknown }).errors)
      ) {
        const first = (detail as { errors: Array<{ message?: string }> }).errors[0]
        if (first?.message) return first.message
      }
    }
    if (ax.message) return ax.message
  }

  if (error instanceof Error && error.message) return error.message
  return fallback
}
