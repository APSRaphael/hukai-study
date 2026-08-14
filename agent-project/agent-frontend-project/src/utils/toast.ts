import type { MessageInstance } from 'antd/es/message/interface'

let messageApi: MessageInstance | null = null

export function setMessageApi(api: MessageInstance) {
  messageApi = api
}

export function toastError(content: string) {
  if (messageApi) {
    messageApi.error(content)
    return
  }
  console.error(content)
}

export function toastSuccess(content: string) {
  if (messageApi) {
    messageApi.success(content)
    return
  }
  console.info(content)
}
