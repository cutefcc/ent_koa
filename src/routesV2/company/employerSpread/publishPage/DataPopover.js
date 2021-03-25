import React, { PureComponent } from 'react'
import { Text, Icon } from 'mm-ent-ui'
import { injectUnmount } from 'utils'
import { Popover } from 'antd'
import * as R from 'ramda'
import { connect } from 'react-redux'
// import ItemTitle from './ItemTitle'
import styles from './DataPopover.less'

@connect((state) => ({
  config: state.global.config,
  profession: state.global.profession,
  dictionary: state.global.dictionary,
  jobs: state.global.jobs,
}))
@injectUnmount
export default class DataPopover extends PureComponent {
  state = {}

  getWorkTimesStr = () => {
    const { worktimes } = this.props.item
    const worktimesMap = R.propOr([], 'worktime', this.props.config)
    const filerArr = worktimesMap.filter((item) => {
      return worktimes.split(',').includes(String(item.value))
    })
    if (filerArr.length === 0) {
      return '不限'
    }
    return filerArr.reduce((pre, curr) => {
      return { label: `${pre.label},${curr.label}` }
    }).label
  }

  getProfessionStr = () => {
    const { professions } = this.props.item
    const professionsMap = R.propOr([], 'profession', this.props)
    const filterArr = professionsMap.filter((item) => {
      return professions.split(',').includes(String(item.code))
    })
    if (filterArr.length === 0) {
      return '不限'
    }
    return filterArr.reduce((pre, curr) => {
      return { name: `${pre.name},${curr.name}` }
    }).name
  }

  getDegreesStr = () => {
    const { degrees } = this.props.item
    const degreesMap = R.propOr([], 'degree', this.props.config)
    const filerArr = degreesMap.filter((item) => {
      return degrees.split(',').includes(String(item.value))
    })
    if (filerArr.length === 0) {
      return '不限'
    }
    return filerArr.reduce((pre, curr) => {
      return { label: `${pre.label},${curr.label}` }
    }).label
  }

  getFan = (isfan) => {
    if (isfan === -1) {
      return '不限'
    }
    if (isfan === 0) {
      return '否'
    }
    if (isfan === 1) {
      return '是'
    }
    return '不限'
  }

  renderPopoverTitle = () => {
    return (
      <div className={`${styles.title}`}>
        <Text type="title" size={16} style={{ color: 'rgba(0,0,0,0.85)' }}>
          数据概括
        </Text>
      </div>
    )
  }

  renderItem = (title, info, titleSize = 12) => {
    return (
      <div className={`${styles.itemDiv}`}>
        <div>
          <Text type="title" size={titleSize}>
            {title}
          </Text>
        </div>
        <div>
          <Text type="text_common" size={12}>
            {info}
          </Text>
        </div>
      </div>
    )
  }

  isNotUndefined(value) {
    return typeof value !== 'undefined'
  }

  renderPopoverContent = () => {
    const {
      statistical_info: {
        view,
        click,
        like,
        comment,
        spread,
        pre_num,
        recover_num,
      },
      provinces,
      positions,
      cities = '',
      is_fan: isFan,
    } = this.props.item

    return (
      <div className={`${styles.content}`}>
        <div className={`${styles.contentMidd} flex`}>
          {this.isNotUndefined(view) && (
            <div className={`${styles.contentMiddP1}`}>
              {this.renderItem(view, '曝光量', 18)}
            </div>
          )}
          {this.isNotUndefined(pre_num) && (
            <div className={`${styles.contentMiddP3}`}>
              {this.renderItem(pre_num, '消耗币数', 18)}
            </div>
          )}
          {this.isNotUndefined(recover_num) && (
            <div className={`${styles.contentMiddP3}`}>
              {this.renderItem(recover_num, '返还数', 18)}
            </div>
          )}
          {this.isNotUndefined(click) && (
            <div className={`${styles.contentMiddP3}`}>
              {this.renderItem(click, '点击量', 18)}
            </div>
          )}

          {this.isNotUndefined(like) && (
            <div className={`${styles.contentMiddP3}`}>
              {this.renderItem(like, '点赞', 18)}
            </div>
          )}

          {this.isNotUndefined(comment) && (
            <div className={`${styles.contentMiddP3}`}>
              {this.renderItem(comment, '评论', 18)}
            </div>
          )}

          {this.isNotUndefined(spread) && (
            <div className={`${styles.contentMiddP3}`}>
              {this.renderItem(spread, '分享', 18)}
            </div>
          )}
        </div>
        <div className={`${styles.contentBottom} flex`}>
          <div className={`${styles.contentBottomL}`}>
            {this.renderItem('是否粉丝', this.getFan(isFan))}
            {this.renderItem('所属行业', this.getProfessionStr())}
            {this.renderItem('职位技能', positions || '不限')}
          </div>
          <div className={`${styles.contentBottomL}`}>
            {this.renderItem(
              '城市地区',
              `${provinces}${provinces && cities ? `,` : ''}${cities}` || '不限'
            )}
            {this.renderItem('学历要求', this.getDegreesStr())}

            {this.renderItem('工作年限', this.getWorkTimesStr())}
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div
        ref={(dom) => {
          this.con = dom
        }}
        style={{ lineHeight: 1 }}
      >
        <Popover
          // placement="bottom"
          placement="bottom"
          title={this.renderPopoverTitle()}
          content={this.renderPopoverContent()}
          trigger="click"
          autoAdjustOverflow={false}
          getPopupContainer={() => this.con}
        >
          <div className={styles.wrap}>
            <Icon
              type="shuju_gaikua"
              style={{
                fontSize: '16px',
              }}
            />
            <span style={{ fontSize: '12px', color: '#0052FF' }}>查看详情</span>
          </div>
        </Popover>
      </div>
    )
  }
}
