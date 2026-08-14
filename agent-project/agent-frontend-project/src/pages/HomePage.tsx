import { Card, Typography } from 'antd'

export function HomePage() {
  return (
    <Card>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        欢迎使用学面通AI
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        你已登录。后续可在此接入会话、面试与文件上传等功能。
      </Typography.Paragraph>
    </Card>
  )
}
