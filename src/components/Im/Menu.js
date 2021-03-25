import React from 'react'
import { MessageOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

// import * as R from 'ramda'

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class MyMenu extends React.PureComponent {
  render() {
    return (
      <Menu defaultSelectedKeys={[this.props.activeMenu]} mode="inline">
        <Menu.Item key="communication">
          <Link to="/ent/im">
            <MessageOutlined />
            畅聊
            {/* (R.pathOr(
              0,
              ['license', 'comunication_num'],
              this.props.currentUser
            )) */}
          </Link>
        </Menu.Item>
      </Menu>
    )
  }
}
