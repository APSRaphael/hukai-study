import { App as AntdApp, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { AntdAppBridge } from '@/components/AntdAppBridge'

import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#ff9f1a',
          borderRadius: 10,
        },
      }}
    >
      <AntdApp>
        <AntdAppBridge />
        <App />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
