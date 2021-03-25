import React from 'react'
import { connect } from 'react-redux'
import Avatar from 'components/Common/Avatar'
import { LoadingOutlined } from '@ant-design/icons'
import * as R from 'ramda'

import styles from './rank.less'
import commonStyles from './common.less'

@connect((state) => ({
  loading: state.loading.effects['talentPool/fetchContributionList'],
}))
export default class Rank extends React.PureComponent {
  state = {
    updateTime: '',
    data: [],
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'talentPool/fetchContributionList',
      })
      .then(({ data }) => {
        this.setState({
          data: R.propOr([], 'data', data),
          updateTime: R.propOr('', 'update_time', data),
        })
      })
  }

  renderItem = ({ name = '', avatar = '', num = 0 }) => {
    return (
      <li className={styles.item}>
        <span>
          <Avatar
            avatar={avatar}
            name={name}
            style={{
              width: '30px',
              height: '30px',
              fontSize: '16px',
              lineHeight: '30px',
              borderRadius: '15px',
              marginRight: '10px',
            }}
          />
          <span>{name}</span>
        </span>
        <span className={styles.num}>{num}人</span>
      </li>
    )
  }

  render() {
    const { updateTime, data } = this.state
    const updateHourOffset = parseInt(
      (new Date().getTime() - new Date(updateTime).getTime()) / 60000,
      10
    )
    return (
      <div>
        <h5 key="title" className={`${commonStyles.title} filterTitle`}>
          人才贡献榜{this.props.loading && <LoadingOutlined />}{' '}
          {updateTime && (
            <span className={commonStyles.sub}>
              ({updateHourOffset}分钟前更新)
            </span>
          )}
        </h5>
        <ul className={styles.data}>{data.map(this.renderItem)}</ul>
      </div>
    )
  }
}
