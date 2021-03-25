// 备注协同
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Popover } from 'antd'
import * as R from 'ramda'
import Avatar from 'components/Common/Avatar'

@connect((state) => ({
  loading: state.loading.effects['talents/fetchRemarks'],
  configLoading: state.loading.effects['global/fetchConfig'],
  config: state.global.config,
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
    list: [],
  }

  componentDidMount() {
    if (R.isEmpty(this.props.config) && !this.props.configLoading) {
      this.fetchConfig()
    }
  }

  getNodeName = (value) => {
    const remarkNode = R.propOr([], 'remark_node', this.props.config)
    const node = remarkNode.find(R.propEq('value', value))
    return R.propOr(value, 'label', node)
  }

  setCurrentDom = (dom) => {
    this.dom = dom
  }

  fetchConfig = () => {
    this.props.dispatch({ type: 'global/fetchConfig' })
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'talents/fetchRemarks',
        payload: {
          to_uid: this.props.uid,
          page: 0,
          size: 20,
        },
      })
      .then(({ data }) => {
        this.setState({
          list: data.list,
        })
      })
  }

  handleHoverChange = (show) => {
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
    const { list } = this.state
    return (
      <div
        className="padding-16"
        style={{ maxHeight: '300px', overflow: 'auto', width: '300px' }}
      >
        <h5 className="font-size-16 text-center color-stress font-weight-bold">
          {`${this.props.uname}已被添加${this.props.total}条备注`}
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
          <span className="color-stress font-size-14 font-weight-bold">
            {item.name}
          </span>
          <span className="color-dilution font-size-12">
            {item.remark_time}
          </span>
          {!!item.node && (
            <span className="color-common font-size-14">
              {this.getNodeName(item.node)}
            </span>
          )}
          {!!item.content && (
            <span className="color-common font-size-14">{item.content}</span>
          )}
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
            同事备注·{this.props.total}
          </span>
        </Popover>
      </div>
    )
  }
}
