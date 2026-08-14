import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/stores/authStore'

/** 需登录：无 token 则跳转登录页，并记录来源。 */
export function RequireAuth() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const location = useLocation()

  if (!accessToken) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

/** 访客页：已登录则进首页。 */
export function GuestOnly() {
  const accessToken = useAuthStore((s) => s.accessToken)
  if (accessToken) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}
