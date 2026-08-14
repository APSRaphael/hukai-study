import { App } from 'antd'
import { useEffect } from 'react'

import { setMessageApi } from '@/utils/toast'

/** 把 AntdApp 的 message 实例挂到全局，供 axios 拦截器使用。 */
export function AntdAppBridge() {
  const { message } = App.useApp()

  useEffect(() => {
    setMessageApi(message)
  }, [message])

  return null
}
