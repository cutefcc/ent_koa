import React, { useState } from 'react'
import { setCookie } from 'tiny-cookie'
import { LockOutlined, PhoneOutlined } from '@ant-design/icons'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Input, Button, message } from 'antd'
import { login } from 'services/users'
import styles from './index.less'

export default function LocalLogin() {
  const [phone, setPhone] = useState()
  const [password, setPassword] = useState()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (phone && password) {
      try {
        const { data } = await login({ phone, password })
        setCookie('u', data.user.id, true, { path: '/', expires: 7 })
        setCookie('access_token', data.token, true, {
          path: '/',
          expires: 7,
        })
        window.location.href = '/'
      } catch (err) {
        message.error(err.message)
      }
    } else {
      message.warn('请填写手机号和密码')
    }
  }

  return (
    <Form onSubmit={handleSubmit} className={styles.login}>
      <Form.Item>
        <Input
          prefix={<PhoneOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          placeholder="手机号"
          type="text"
          onChange={(e) => {
            setPhone(e.target.value)
          }}
        />
      </Form.Item>
      <Form.Item>
        <Input
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="password"
          placeholder="密码"
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  )
}
