import React from 'react'

import {
  EyeOutlined,
  LikeOutlined,
  SearchOutlined,
  SelectOutlined,
  UsergroupAddOutlined,
  WifiOutlined,
} from '@ant-design/icons'

import { Menu } from 'antd'
import { Link } from 'react-router-dom'

export default function (props) {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.open('/ent/channel/1')
  }
  return (
    <Menu defaultSelectedKeys={[props.activeMenu]} mode="inline">
      <span onClick={handleClick} className="ant-menu-item">
        <WifiOutlined />
        频道
      </span>
      <Menu.Item key="recommend">
        <Link to="/ent/talents/discover/recommend">
          <LikeOutlined />
          人才推荐
        </Link>
      </Menu.Item>
      <Menu.Item key="search">
        <Link to="/ent/talents/discover/search">
          <SearchOutlined />
          搜索人才
        </Link>
      </Menu.Item>
      <Menu.Item key="visitor">
        <Link to="/ent/talents/discover/visitor">
          <EyeOutlined />
          最近来访
        </Link>
      </Menu.Item>
      {/* <Menu.Item key="applicant">
        <Link to="/ent/talents/discover/applicant">
          <Icon type="heart-o" />简历
        </Link>
      </Menu.Item> */}
      <Menu.Item key="right">
        <Link to="/ent/talents/discover/right">
          <SelectOutlined />
          追踪
        </Link>
      </Menu.Item>
      <Menu.Item key="group">
        <Link to="/ent/talents/discover/group">
          <UsergroupAddOutlined />
          分组
        </Link>
      </Menu.Item>
    </Menu>
  )
}
