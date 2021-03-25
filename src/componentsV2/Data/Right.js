import React from 'react'
import * as R from 'ramda'
import { Icon as LegacyIcon } from '@ant-design/compatible'
import { LoadingOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'

import styles from './right.less'
import commonStyles from './common.less'

@connect((state) => ({
  loading: state.loading.effects['statCompany/fetchRight'],
}))
export default class AssignedModal extends React.PureComponent {
  state = {
    data: {},
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'statCompany/fetchRight',
      })
      .then(({ data }) => {
        this.setState({
          data,
        })
      })
  }

  renderItem = (data) => {
    return (
      <div className={styles.item}>
        <LegacyIcon type={data.icon} className={styles.icon} />
        <div className={styles.content}>
          <span className={`${commonStyles.stress} ${commonStyles.mr16}`}>
            {this.props.loading ? <LoadingOutlined /> : data.value}
          </span>
          <span>{data.field}</span>
        </div>
      </div>
    )
  }

  renderItems = () => {
    const { data } = this.state
    const dataSource = [
      {
        field: '职位',
        value: R.pathOr(0, ['job', 'num'], data),
        icon: 'book',
      },
      {
        field: '简历',
        value: R.pathOr(0, ['job', 'resume_num'], data),
        icon: 'book',
      },
      {
        field: '加好友请求',
        value: R.pathOr(0, ['right_add_fr', 'num'], data),
        icon: 'book',
      },
      {
        field: '加好友通过率',
        value: `${(
          parseFloat(R.pathOr(0, ['right_add_fr', 'pass_rate'], data)) * 100
        ).toFixed(1)}%`,
        icon: 'book',
      },
      {
        field: '极速联系',
        value: R.pathOr(0, ['right_uh', 'num'], data),
        icon: 'book',
      },
      {
        field: '极速联系回复率',
        value: `${(
          parseFloat(R.pathOr(0, ['right_uh', 'reply_rate'], data)) * 100
        ).toFixed(1)}%`,
        icon: 'book',
      },
    ]
    return dataSource.map(this.renderItem)
  }

  render() {
    return <div className={styles.main}>{this.renderItems()}</div>
  }
}
