import React from 'react'
import { SyncOutlined, TeamOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'

export default function (props) {
  return (
    <Menu defaultSelectedKeys={[props.activeMenu]} mode="inline">
      <Menu.Item key="list">
        <Link to="/ent/talents/pool">
          <TeamOutlined />
          企业人脉
        </Link>
      </Menu.Item>
      <Menu.Item key="check" disabled>
        <Link to="/ent/talents/check">
          <SyncOutlined />
          人脉盘点
          <span style={{ fontSize: 12 }}>(敬请期待)</span>
        </Link>
      </Menu.Item>
    </Menu>
  )
}
