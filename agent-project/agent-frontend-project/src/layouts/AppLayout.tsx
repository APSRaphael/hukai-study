import { LogoutOutlined } from '@ant-design/icons'
import { Avatar, Button, Layout, Space, Typography } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/stores/authStore'
import { toastSuccess } from '@/utils/toast'

const { Header, Content, Footer } = Layout

export function AppLayout() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const onLogout = () => {
    clearAuth()
    toastSuccess('已退出登录')
    navigate('/login', { replace: true })
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#1f1f1f',
          paddingInline: 24,
        }}
      >
        <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>
          学面通AI
        </Typography.Title>
        <Space size="middle">
          <Space size={8}>
            <Avatar src={user?.avatar ?? undefined} style={{ background: '#ff9f1a' }}>
              {user?.username?.slice(0, 1)?.toUpperCase()}
            </Avatar>
            <Typography.Text style={{ color: '#fff' }}>
              {user?.username ?? '用户'}
            </Typography.Text>
          </Space>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={onLogout}
            style={{ color: '#fff' }}
          >
            退出登录
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>学面通AI · Agent Project</Footer>
    </Layout>
  )
}
