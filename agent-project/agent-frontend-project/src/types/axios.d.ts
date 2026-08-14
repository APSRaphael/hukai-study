import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** 为 true 时拦截器不弹全局错误提示（由表单自行处理） */
    skipErrorToast?: boolean
  }
}
