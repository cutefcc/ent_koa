// 联系过某个候选人的同事
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Popover } from 'antd'
import Avatar from 'components/Common/Avatar'
import $ from 'jquery'

@connect((state) => ({
  loading: state.loading.effects['talents/fetchCoContactor'],
}))
export default class CoContactor extends React.Component {
  static propTypes = {
    uid: PropTypes.string.isRequired,
    uname: PropTypes.string.isRequired,
    total: PropTypes.number,
  }

  static defaultProps = {
    total: 0,
  }

  state = {
    total: 0,
    list: [],
  }

  setCurrentDom = (dom) => {
    this.dom = dom
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'talents/fetchCoContactor',
        payload: {
          to_uid: this.props.uid,
        },
      })
      .then(({ data }) => {
        this.setState({
          total: data.total,
          list: data.list,
        })
      })
  }

  handleHoverChange = (show) => {
    // 由于人才卡片的 opacity 会影响弹框的效果，所以当弹框出现时候，强制设置卡片不透明
    const dom = $(this.dom)
    if (dom) {
      const parents = dom.parents('div[class*=card][class*=disabled]')
      parents.css('opacity', show ? 1 : 0.5)
    }

    if (show) {
      this.fetchData()
    }
  }

  renderAvatar = (item) => {
    const { avatar = '', name = '' } = item
    const style = {
      width: '40px',
      height: '40px',
      fontSize: '24px',
      lineHeight: '40px',
      borderRadius: '20px',
    }

    return <Avatar avatar={avatar} name={name} style={style} />
  }

  renderPopover = () => {
    const { list, total } = this.state
    return (
      <div
        className="padding-16"
        style={{ maxHeight: '300px', overflow: 'auto', width: '300px' }}
      >
        <h5 className="font-size-16 text-center color-stress font-weight-bold">
          {`${this.props.uname}已被${total}位同事极速联系`}
        </h5>
        <div>{list.map(this.renderItem)}</div>
      </div>
    )
  }

  renderItem = (item) => {
    return (
      <div
        key={item.name}
        className={`margin-top-16 flex ${this.props.className}`}
      >
        {this.renderAvatar(item)}
        <span className="flex-column space-between margin-left-16">
          <span className="color-common font-size-14">{item.name}</span>
          <span className="color-diution font-size-14">{item.uh_time}</span>
        </span>
      </div>
    )
  }

  render() {
    return (
      <div
        ref={this.setCurrentDom}
        style={{ position: 'relative' }}
        className={this.props.className}
      >
        <Popover
          style={{ width: 500 }}
          content={this.renderPopover()}
          title=""
          trigger="hover"
          onVisibleChange={this.handleHoverChange}
          placement="bottom"
          getPopupContainer={() => this.dom}
        >
          <span className="like-link-button color-card-footer">
            极速联系·{this.props.total}
          </span>
        </Popover>
      </div>
    )
  }
}
