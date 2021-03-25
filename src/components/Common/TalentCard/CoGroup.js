import React from 'react'
import PropTypes from 'prop-types'
import { LoadingOutlined } from '@ant-design/icons'
import { Popover } from 'antd'
import * as R from 'ramda'
import { connect } from 'react-redux'

import styles from './commonFriends.less'
import $ from 'jquery'

@connect((state) => ({
  loading: state.loading.effects['global/fetchGroupsByUid'],
}))
export default class CoGroup extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      personalGroup: [],
      enterpriseGroup: [],
    }
  }

  setCurrentDom = (dom) => {
    this.dom = dom
  }

  smallAvatarStyle = {
    width: '24px',
    height: '24px',
    fontSize: '14px',
    lineHeight: '24px',
    borderRadius: '13px',
    cursor: 'pointer',
  }

  bigAvatarStyle = {
    width: '40px',
    height: '40px',
    fontSize: '22px',
    lineHeight: '40px',
    borderRadius: '20px',
    cursor: 'pointer',
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'talentPool/fetchGroupsByUid',
        payload: {
          to_uid: this.props.data.id,
        },
      })
      .then(({ data }) => {
        this.setState({
          personalGroup: R.propOr([], 'personal', data),
          enterpriseGroup: R.propOr([], 'enterprise', data),
        })
      })
  }

  handleVisibleChange = (visible) => {
    // 由于人才卡片的 opacity 会影响弹框的效果，所以当弹框出现时候，强制设置卡片不透明
    const dom = $(this.dom)
    if (dom) {
      const parents = dom.parents('div[class*=card][class*=disabled]')
      parents.css('opacity', visible ? 1 : 0.5)
    }

    if (visible) {
      this.fetchData()
    }
  }

  renderGroup = (item) => {
    return (
      <span className={styles.groupItem} key={item.id}>
        {item}
      </span>
    )
  }

  renderPopover = () => {
    const { personalGroup, enterpriseGroup } = this.state
    const { data } = this.props
    return (
      <div className={styles.popover}>
        {this.props.loading && <LoadingOutlined />}
        <h5 className={styles.title}>
          {`${data.name}已被加入${R.propOr(0, 'group_cnt', data)} 个分组`}
        </h5>
        <div
          style={{ maxHeight: '400px', overflow: 'auto', marginTop: '20px' }}
        >
          {enterpriseGroup.length > 0 && (
            <div
              style={{ borderBottom: '1px solid #eee', paddingBottom: '24px' }}
            >
              <h4 className="font-size-24 color-common">企业人才库分组</h4>
              <span className="color-card-footer">
                {enterpriseGroup.join('，')}
              </span>
            </div>
          )}
          {personalGroup.length > 0 && (
            <div className={enterpriseGroup.length > 0 ? 'padding-top-24' : ''}>
              <h4 className="font-size-24 color-common">个人人才库分组</h4>
              <span className="color-card-footer">
                {personalGroup.join('，')}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  render() {
    const { data } = this.props
    const groupsLength = R.propOr(0, 'group_cnt', data)

    if (!groupsLength) {
      return <div />
    }
    return (
      <div
        ref={this.setCurrentDom}
        style={{ position: 'relative' }}
        className={this.props.className}
      >
        <Popover
          content={this.renderPopover()}
          placement="bottom"
          getPopupContainer={() => this.dom}
          onVisibleChange={this.handleVisibleChange}
        >
          <span>
            <span className="color-card-footer ">{`分组·${groupsLength}`}</span>
          </span>
        </Popover>
      </div>
    )
  }
}
