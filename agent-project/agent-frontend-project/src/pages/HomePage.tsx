import { Avatar, Card, Space, Typography } from 'antd'

import { useAuthStore } from '@/stores/authStore'

export function HomePage() {
  const user = useAuthStore((s) => s.user)

  return (
    <Card>
      <Space align="start" size="large">
        <Avatar
          size={64}
          src={user?.avatar ?? undefined}
          style={{ background: '#ff9f1a' }}
        >
          {user?.username?.slice(0, 1)?.toUpperCase()}
        </Avatar>
        <div>
          <Typography.Title level={3} style={{ marginTop: 0 }}>
            欢迎，{user?.username ?? '用户'}
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            你已登录。后续可在此接入会话、面试与文件上传等功能。
          </Typography.Paragraph>
        </div>
      </Space>
    </Card>
  )
}
