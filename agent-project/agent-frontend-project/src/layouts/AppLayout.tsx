import { LogoutOutlined } from '@ant-design/icons'
import { Button, Layout, Typography } from 'antd'
import { Outlet, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/stores/authStore'
import { toastSuccess } from '@/utils/toast'

const { Header, Content, Footer } = Layout

export function AppLayout() {
  const navigate = useNavigate()
  const clearTokens = useAuthStore((s) => s.clearTokens)

  const onLogout = () => {
    clearTokens()
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
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={onLogout}
          style={{ color: '#fff' }}
        >
          退出登录
        </Button>
      </Header>
      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>学面通AI · Agent Project</Footer>
    </Layout>
  )
}
