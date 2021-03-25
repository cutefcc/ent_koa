import React from 'react'
import { Button, message, Modal, Popover } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as R from 'ramda'

import styles from './button.less'

@connect((state) => ({
  personalGroup: state.groups.list,
}))
@withRouter
export default class InviteButton extends React.PureComponent {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    trackParam: PropTypes.object,
    showPop: PropTypes.bool,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    onGroupFinish: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    className: '',
    trackParam: {},
    content: '',
    showPop: false,
    onGroupFinish: () => {},
  }

  state = {
    showGroupModal: false,
    personalGroup: [],
    personalGroupChecked: [],
    entGroup: [],
    entGroupChecked: [],
  }

  componentDidMount() {
    // this.fetchEntGroupList()
    // this.fetchPersonalGroupList()
  }

  fetchPersonalGroupList = () => {
    this.props
      .dispatch({
        type: 'groups/fetch',
      })
      .then(({ data }) => {
        this.setState({
          personalGroup: data,
        })
      })
  }

  fetchEntGroupList = () => {
    this.props
      .dispatch({
        type: 'talentPool/fetchGroups',
      })
      .then(({ data }) => {
        this.setState({
          entGroup: R.propOr([], 'list', data),
        })
      })
  }

  handleSubmitGroup = () => {
    const talentIds = this.props.talents.map(R.prop('id'))
    const { personalGroupChecked, entGroupChecked } = this.state
    // 打点
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: talentIds.join(','),
      }
      const key = 'jobs_pc_talent_addtp_confirm'
      window.voyager.trackEvent(key, key, param)
    }

    // 添加至个人人才分组
    if (personalGroupChecked.length > 0) {
      this.props
        .dispatch({
          type: 'groups/addTalent',
          payload: {
            uids: talentIds.join(','),
            group_id: personalGroupChecked.join(','),
          },
        })
        .then(() => {
          if (window.voyager) {
            const param = {
              datetime: new Date().getTime(),
              uid: window.uid,
              p_group: personalGroupChecked.join(','),
              ...this.props.trackParam,
              u2: talentIds.join(','),
            }
            const key = 'jobs_pc_talent_addtp_success'
            window.voyager.trackEvent(key, key, param)
          }
          message.success('分组成功')
          // this.props.onGroupFinish(talentIds, groupChecked.name, res)
          this.fetchPersonalGroupList()
          this.handleCancelGroup()
        })
    }

    // 添加到企业分组
    if (entGroupChecked.length > 0) {
      this.props
        .dispatch({
          type: 'talentPool/addTalents',
          payload: {
            to_uids: talentIds.join(','),
            group_ids: entGroupChecked.join(','),
          },
        })
        .then(() => {
          // 打点
          if (window.voyager) {
            const param = {
              uid: window.uid,
              e_group: entGroupChecked.join(','),
              ...this.props.trackParam,
              u2: talentIds.join(','),
            }
            const key = 'jobs_pc_talent_addtp_success'
            window.voyager.trackEvent(key, key, param)
          }
          message.success('分组成功')
          // this.props.onGroupFinish(talentIds, groupChecked.name, res)
          this.fetchEntGroupList()
          this.handleCancelGroup()
          this.props.onGroupFinish(talentIds)
        })
    }
  }

  handleShowGroup = (e) => {
    if (window.voyager) {
      const talentIds = this.props.talents.map(R.prop('id'))
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        u2: talentIds.join(','),
      }
      const key = 'jobs_pc_talent_addtp_click'
      window.voyager.trackEvent(key, key, param)
    }

    this.setState({
      showGroupModal: true,
    })

    this.fetchPersonalGroupList()
    this.fetchEntGroupList()
    e.stopPropagation()
  }

  handleCancelGroup = () => {
    this.setState({
      showGroupModal: false,
      personalGroupChecked: [],
      entGroupChecked: [],
    })
  }

  handleGroupChange = (type, value) => () => {
    const preGroups = this.state[type]
    const groups = preGroups.includes(value)
      ? R.without([value], preGroups)
      : [...preGroups, value]
    this.setState({
      [type]: groups,
    })
  }

  handleRedirectToGroup = () => {
    this.props.history.push('/ent/talents/pool/group')
  }

  renderGroup = (type) => (item) => {
    return (
      <span
        className={`${styles.groupItem} ${
          this.state[type].includes(item.id) ? styles.activeGroupItem : ''
        }`}
        key={item.id}
        onClick={this.handleGroupChange(type, item.id)}
      >
        {item.name || item.title}
      </span>
    )
  }

  render() {
    const button = (
      <Button
        onClick={this.props.onClick || this.handleShowGroup}
        disabled={this.props.disabled}
        className={this.props.className}
        key="button"
      >
        {this.props.content || '修改分组'}
      </Button>
    )
    return [
      this.props.showPop ? (
        <Popover
          placement="topLeft"
          content="修改分组"
          trigger="hover"
          key="button"
        >
          {button}
        </Popover>
      ) : (
        button
      ),
      this.state.showGroupModal && (
        <Modal
          title="修改分组"
          onOk={this.handleSubmitGroup}
          onCancel={this.handleCancelGroup}
          visible={this.state.showGroupModal}
          okText="确定"
          cancelText="取消"
        >
          <div style={{ maxHeight: '400px', overflow: 'auto' }}>
            <div
              style={{ borderBottom: '1px solid #eee', paddingBottom: '24px' }}
            >
              <h4 className="font-size-24 color-common">请选择企业人才分组</h4>
              {this.state.entGroup.length > 0 &&
                this.state.entGroup.map(this.renderGroup('entGroupChecked'))}
              {this.state.entGroup.length === 0 && (
                <p className="color-red">暂无分组，请联系管理员添加分组</p>
              )}
            </div>
            <div className={`${styles.part} padding-top-24`}>
              <h4 className="font-size-24 color-common">请选择个人人才分组</h4>
              {this.state.personalGroup.length > 0 &&
                this.state.personalGroup.map(
                  this.renderGroup('personalGroupChecked')
                )}
              {this.state.personalGroup.length === 0 && (
                <p className="color-red">
                  暂无分组,请到个人分组添加
                  {/* <Button className="like-link-button margin-left-16" onClick={}>点击添加分组</Button> */}
                </p>
              )}
            </div>
          </div>
        </Modal>
      ),
    ]
  }
}
