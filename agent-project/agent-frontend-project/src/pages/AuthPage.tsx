import { CameraOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import gradCapUrl from '@/assets/grad-cap.svg'
import { fetchMeApi, loginApi, registerApi, uploadAvatarApi } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { getErrorMessage } from '@/utils/errorMessage'
import { toastError, toastSuccess } from '@/utils/toast'

import styles from './AuthPage.module.css'

type Mode = 'login' | 'register'

type AuthFormValues = {
  username: string
  password: string
  confirmPassword?: string
}

function BrandMark() {
  return (
    <div className={styles.brand}>
      <span className={styles.brandLogo} aria-hidden>
        <img src={gradCapUrl} alt="" width={22} height={22} />
      </span>
      <h1 className={styles.brandName}>学面通AI</h1>
    </div>
  )
}

function DefaultAvatarArt() {
  return (
    <svg viewBox="0 0 96 96" width="96" height="96">
      <defs>
        <linearGradient id="avatarBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d7e7f7" />
          <stop offset="55%" stopColor="#c4d8eb" />
          <stop offset="100%" stopColor="#e8c8a6" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="48" r="48" fill="url(#avatarBg)" />
      <ellipse cx="48" cy="78" rx="28" ry="18" fill="#f3d7b8" opacity="0.85" />
      <circle cx="48" cy="42" r="18" fill="#f7e0c8" />
      <path
        d="M30 40c4-14 32-14 36 0 1 8-6 14-18 14s-19-6-18-14z"
        fill="#c9ddf0"
        opacity="0.9"
      />
    </svg>
  )
}

export function AuthPage() {
  const [mode, setMode] = useState<Mode>('login')
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form] = Form.useForm<AuthFormValues>()
  const navigate = useNavigate()
  const location = useLocation()
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser = useAuthStore((s) => s.setUser)

  const redirectTo = useMemo(() => {
    const from = (location.state as { from?: string } | null)?.from
    return from && from !== '/login' ? from : '/'
  }, [location.state])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const clearLocalAvatar = () => {
    setAvatarFile(null)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onPickAvatar = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toastError('请选择图片文件作为头像')
      return
    }
    setAvatarFile(file)
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }

  const onFinish = async (values: AuthFormValues) => {
    setLoading(true)
    const username = values.username.trim()
    const password = values.password
    try {
      if (mode === 'register') {
        // 1) 先注册文本信息
        const created = await registerApi({ username, password })
        // 2) 自动登录拿 Token
        const tokens = await loginApi({ username, password })
        setTokens({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
        })
        let user = {
          id: created.id,
          username: created.username,
          avatar: created.avatar ?? null,
        }
        // 3) 有本地头像则带 Token 上传
        if (avatarFile) {
          const uploaded = await uploadAvatarApi(avatarFile)
          user = { ...user, avatar: uploaded.avatar ?? uploaded.file_path }
        }
        setUser(user)
        clearLocalAvatar()
        toastSuccess('注册成功')
        navigate(redirectTo, { replace: true })
        return
      }

      const tokens = await loginApi({ username, password })
      setTokens({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      })
      const me = await fetchMeApi()
      setUser(me)
      toastSuccess('登录成功')
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toastError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.card}>
        <BrandMark />

        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            {previewUrl ? (
              <img src={previewUrl} alt="头像预览" className={styles.avatarImg} />
            ) : (
              <DefaultAvatarArt />
            )}
          </div>
          {mode === 'register' ? (
            <>
              <button
                type="button"
                className={styles.cameraBtn}
                aria-label="选择头像"
                onClick={() => fileInputRef.current?.click()}
              >
                <CameraOutlined />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => onPickAvatar(e.target.files?.[0])}
              />
            </>
          ) : null}
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
            onClick={() => {
              setMode('login')
              clearLocalAvatar()
            }}
          >
            登录
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
            onClick={() => setMode('register')}
          >
            注册
          </button>
        </div>

        <Form
          form={form}
          className="auth-form"
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 2, max: 32, message: '用户名为 2-32 个字符' },
            ]}
          >
            <Input
              className="auth-input"
              size="large"
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, max: 64, message: '密码至少 6 位' },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                message: '密码需同时包含字母和数字',
              },
            ]}
          >
            <Input.Password
              className="auth-input"
              size="large"
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="密码"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </Form.Item>

          {mode === 'register' ? (
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请再次输入密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}
            >
              <Input.Password
                className="auth-input"
                size="large"
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="确认密码"
                autoComplete="new-password"
              />
            </Form.Item>
          ) : null}

          <Form.Item>
            <Button
              className={styles.submit}
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              {mode === 'login' ? '登录' : '注册'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
