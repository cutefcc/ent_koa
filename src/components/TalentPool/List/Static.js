import React from 'react'
import { connect } from 'react-redux'
import { LoadingOutlined, UserOutlined } from '@ant-design/icons'

import commonStyles from './common.less'

@connect((state) => ({
  loading: state.loading.effects['talentPool/fetchStatic'],
}))
export default class Static extends React.Component {
  state = {
    data: [],
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'talentPool/fetchStatic',
      })
      .then(({ data = [] }) => {
        this.setState({
          data,
        })
      })
  }

  render() {
    return (
      <div>
        <h5 className={commonStyles.title}>
          数据统计
          {this.props.loading && <LoadingOutlined />}
        </h5>
        <ul
          style={{
            padding: 0,
            listStyle: 'none',
            margin: 0,
          }}
        >
          {this.state.data.map((item) => (
            <li key={item.label} style={{ lineHeight: '30px' }}>
              <UserOutlined />{' '}
              <span className={commonStyles.extress}>{item.value}</span>
              <span style={{ color: '#666' }}>{` ${item.label}`}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
