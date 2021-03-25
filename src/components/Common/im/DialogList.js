import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { LoadingOutlined } from '@ant-design/icons'

import TalentCard from './TalentCard'
import styles from './dialogList.less'

export default class DialogList extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    onClick: PropTypes.func.isRequired,
    remain: PropTypes.number,
    activeRecruitId: PropTypes.number,
    onLoadMore: PropTypes.func.isRequired,
    target: PropTypes.number.isRequired,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    remain: 0,
    activeRecruitId: 0,
    loading: false,
  }

  getFormatData = () => {
    const { data, target } = this.props
    const targetItemIndex = R.findIndex(R.propEq('id', target))(data)
    if (targetItemIndex !== -1) {
      return R.compose(
        R.prepend({ ...data[targetItemIndex] }),
        R.remove(targetItemIndex, 1)
      )(data)
    }
    return data
  }

  handleClick = (item) => () => {
    this.props.onClick(item)
  }

  renderTalentItem = (item) => {
    const checked = item.recruit_id === this.props.activeRecruitId
    return (
      <TalentCard
        data={item}
        onClick={this.handleClick(item)}
        checked={checked}
        key={item.recruit_id}
        onStateChange={this.props.onStateChange}
      />
    )
  }

  render() {
    const { remain } = this.props
    const data = this.getFormatData()

    return data.length === 0 ? (
      <div style={{ padding: 20 }}>
        {this.props.loading ? (
          <span>
            加载中
            <LoadingOutlined />
          </span>
        ) : (
          '当前没有沟通中的候选人'
        )}
      </div>
    ) : (
      <div>
        {data.map(this.renderTalentItem)}
        {remain === 1 && (
          <span onClick={this.props.onLoadMore} className={styles.loadMore}>
            点击加载更多...
          </span>
        )}
      </div>
    )
  }
}
