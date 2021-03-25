import React from 'react'
import { Button, message, Modal, Select, Input } from 'antd'
import { Icon } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as R from 'ramda'

import styles from './addRemarkButton.less'
import commonStyles from './commonButton.less'

@connect((state) => ({
  config: state.global.config,
  configLoading: state.loading.effects['global/fetchConfig'],
}))
export default class AddRemarkButton extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    buttonText: PropTypes.string,
    className: PropTypes.string,
    onOpFinish: PropTypes.func,
  }

  static defaultProps = {
    buttonText: '添加备注',
    className: '',
    onOpFinish: () => {},
    // iconType: 'plus',
  }

  state = {
    showModal: false,
    param: {},
  }

  componentDidMount() {
    // if (R.isEmpty(this.props.config) && !this.props.configLoading) {
    //   this.fetchConfig()
    // }
  }

  fetchConfig = () =>
    this.props.dispatch({
      type: 'global/fetchConfig',
    })

  handleSubmit = () => {
    if (!this.state.param.content && !this.state.param.node) {
      message.warning('节点和备注，至少需要填一项')
      return
    }

    this.props
      .dispatch({
        type: 'talents/addRemark',
        payload: {
          ...this.state.param,
          to_uid: this.props.data.id,
        },
      })
      .then(() => {
        message.success(`为${this.props.data.name}添加备注成功`)
        this.setState({
          showModal: false,
          param: {},
        })
        this.props.onOpFinish()
      })
  }

  handleShowModal = (e) => {
    if (R.isEmpty(this.props.config) && !this.props.configLoading) {
      this.fetchConfig()
    }
    this.setState({
      showModal: true,
    })
    e.stopPropagation()
  }

  handleHideModal = () => {
    this.setState({
      showModal: false,
    })
  }

  handleNodeChange = (value) => {
    this.setState({
      param: {
        ...this.state.param,
        node: value,
      },
    })
  }

  handleContentCahnge = (e) => {
    this.setState({
      param: {
        ...this.state.param,
        content: e.target.value,
      },
    })
  }

  renderContent = () => {
    const { data } = this.props
    const remarkNode = R.propOr([], 'remark_node', this.props.config)
    return (
      <div>
        <h4
          className="font-size-18 color-stress font-weight-bold"
          style={{ marginBottom: 0 }}
        >
          给{data.name}添加备注
        </h4>
        <p className="font-size-12 color-dilution">*节点和备注至少添加一项</p>
        <h5 className="font-size-14 color-common font-weight-bold">选择节点</h5>
        <Select
          onChange={this.handleNodeChange}
          className="width-p100"
          allowClear
        >
          {remarkNode.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
        <h5 className="font-size-14 color-common font-weight-bold margin-top-16">
          备注
        </h5>
        <Input.TextArea
          onChange={this.handleContentCahnge}
          className={styles.input}
        />
      </div>
    )
  }

  render() {
    return (
      <div>
        <Button
          onClick={this.handleShowModal}
          disabled={this.props.disabled}
          className={`${commonStyles.operation} ${this.props.className}`}
        >
          {this.props.iconType && (
            <Icon type={this.props.iconType} className={styles.icon} />
          )}
          {this.props.buttonText}
        </Button>
        {this.state.showModal && (
          <Modal
            visible={this.state.showModal}
            title=""
            onCancel={this.handleHideModal}
            onOk={this.handleSubmit}
            okText="确定"
            cancelText="取消"
            className={styles.modal}
            okButtonProps={{
              disabled: !this.state.param.content && !this.state.param.node,
            }}
          >
            {this.renderContent()}
          </Modal>
        )}
      </div>
    )
  }
}
