import React from 'react'
import {
  HeartOutlined,
  SelectOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'
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
        <Menu.Item key="applicant">
          <Link to="/ent/talents/follow/applicant">
            <HeartOutlined />
            简历
            {/* (R.pathOr(
              0,
              ['license', 'new_resume_num'],
              this.props.currentUser
            )) */}
          </Link>
        </Menu.Item>
        {/* <Menu.Item key="communication">
          <Link to="/ent/talents/follow/communication">
            <Icon type="message" />意向沟通
          </Link>
        </Menu.Item> */}
        {/* <Menu.Item key="interview">
          <Link to="/ent/talents/follow/interview">
            <Icon type="inbox" />通过筛选{(R.pathOr(
              0,
              ['license', 'interview_num'],
              this.props.currentUser
            ))}
          </Link>
        </Menu.Item> */}
        <Menu.Item key="right">
          <Link to="/ent/talents/follow/right">
            <SelectOutlined />
            追踪
            {/* (R.pathOr(
              0,
              ['license', 'interview_num'],
              this.props.currentUser
            )) */}
          </Link>
        </Menu.Item>
        <Menu.Item key="group">
          <Link to="/ent/talents/follow/group">
            <UsergroupAddOutlined />
            分组
            {/* (R.pathOr(
              0,
              ['license', 'interview_num'],
              this.props.currentUser
            )) */}
          </Link>
        </Menu.Item>
        {/* <Menu.Item key="rejected">
          <Link to="/ent/talents/follow/rejected">
            <Icon type="close-circle-o" />被拒绝
          </Link>
        </Menu.Item>
        <Menu.Item key="unmatch">
          <Link to="/ent/talents/follow/unmatch">
            <Icon type="close" />不合适
          </Link>
        </Menu.Item> */}
      </Menu>
    )
  }
}
