import React from 'react'
import { message, Modal, Popover } from 'antd'
import { Button } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import * as R from 'ramda'

import styles from './../button.less'

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
    onOpFinish: PropTypes.func,
  }

  static defaultProps = {
    disabled: false,
    className: '',
    trackParam: {},
    content: '',
    showPop: false,
    onOpFinish: () => {},
  }

  state = {
    showGroupModal: false,
    personalGroup: [],
    personalGroupChecked: [],
    entGroup: [],
    entGroupChecked: [],
    // true是v3
    editionThree: window.location.pathname.indexOf('v3') !== -1,
  }

  componentDidMount() {
    // this.fetchEntGroupList()
    // this.fetchPersonalGroupList()
  }

  fetchPersonalGroupList = () => {
    this.props
      .dispatch({
        type: 'groups/fetch',
        payload: { editionThree: this.state.editionThree },
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

  fetchNavigator = () => {
    const fetch = () =>
      this.props.dispatch({
        type: 'talentDiscover/fetchGroups',
      })

    /**
     * because add talent to group is async in backend
     * the delay time is not sure
     * so front end should fetch data twice to ensure group num is consistent with the actual situation
     */
    setTimeout(fetch, 2000)
    setTimeout(fetch, 5000)
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

    // 添加至个人人才库
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
          message.success('已添加到个人分组')
          window.broadcast.send('addGroupSuccess', {
            groups: personalGroupChecked,
            uids: talentIds,
          })
          // this.props.onGroupFinish(talentIds, groupChecked.name, res)
          this.fetchPersonalGroupList()
          this.fetchNavigator()
          this.handleCancelGroup()
          this.props.onOpFinish(personalGroupChecked)
        })
    }

    // 添加到企业人才库
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
              datetime: new Date().getTime(),
              uid: window.uid,
              e_group: entGroupChecked.join(','),
              ...this.props.trackParam,
              u2: talentIds.join(','),
            }
            const key = 'jobs_pc_talent_addtp_success'
            window.voyager.trackEvent(key, key, param)
          }
          message.success('已添加到企业分组')
          window.broadcast.send('addGroupSuccess', {
            groups: entGroupChecked,
            uids: talentIds,
          })
          // this.props.onGroupFinish(talentIds, groupChecked.name, res)
          this.fetchEntGroupList()
          this.fetchNavigator()
          this.handleCancelGroup()
          this.props.onOpFinish(entGroupChecked)
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
        type={this.props.type || ''}
      >
        {this.props.content || '加入储备'}
      </Button>
    )
    return [
      this.props.showPop ? (
        <Popover
          placement="topLeft"
          content="添加到人才银行"
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
          title={`添加 ${this.props.talents.length} 人到人才银行`}
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
              <p className="color-dilution font-size-12">
                默认同步到企业人才系统分组
              </p>
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
