import * as React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Popover } from 'mm-ent-ui'
import { preloadImg, replaceCompanySpecialCharacter } from 'utils'
import * as R from 'ramda'
import InviteModal from './InviteModal'
import Invitations from './Invitations'
import * as styles from './index.less'

export interface Props {
  data: object
  onOldVersionChange?: Function
}

export interface EntInvite {
  invitations: Array<Object>
}

export interface Loading {
  effects: Object
}

export interface GlobalModel {
  urlPrefix: string
}

export interface GlobalState {
  entInvite: EntInvite
  loading: Loading
  global: GlobalModel
}

export interface State {
  showInviteModal: boolean
  showStepSecondModal: boolean
  showStepThirdModal: boolean
  showStepSecondInstructModal: boolean
  showStepThirdInstructModal: boolean
  currentInvitation: object
  data: object
  showStrengthenRemindModal: boolean
}

@connect((state: GlobalState) => ({
  invitations: state.entInvite.invitations,
  listLoading: state.loading.effects['entInvite/fetch'],
  urlPrefix: state.global.urlPrefix,
  advancedSearch: state.talentDiscover.advancedSearch,
  currentUser: state.global.currentUser,
}))
export default class EntInviteContainer extends React.Component<
  Props & EntInvite & GlobalModel,
  State
> {
  state = {
    showInviteModal: false,
    showStepSecondModal: false,
    showStepThirdModal: false,
    showStepSecondInstructModal: false,
    showStepThirdInstructModal: false,
    currentInvitation: {},
    showPop: false,
    data: {},
    showStrengthenRemindModal: false,
  }

  componentDidMount = () => {
    this.props.dispatch({
      type: 'entInvite/fetch',
      payload: {},
    })

    const { urlPrefix } = this.props
    preloadImg([
      `${urlPrefix}/images/entInvite/stepSecondInstruct.png`, // 第二个步骤提示框图片
      `${urlPrefix}/images/entInvite/stepThirdInstruct.png`, // 第三个步骤提示框图片
      `${urlPrefix}/images/entInvite/invite_status_0.png`, // 流程状态0  发起邀约
      `${urlPrefix}/images/entInvite/invite_status_1.png`, // 流程状态1
      `${urlPrefix}/images/entInvite/invite_status_2.png`, // 流程状态2
      `${urlPrefix}/images/entInvite/invite_status_3.png`, // 流程状态1
      `${urlPrefix}/images/entInvite/tips_active.png`, // 提示图标
      `${urlPrefix}/images/entInvite/tips_normal.png`, // 提示图标
    ])
  }

  handleFormatData = () => {
    const { data = {} } = this.props
    return {
      ...data,
      companys: data.companys
        ? replaceCompanySpecialCharacter(`${data.companys}`)
        : '',
      sortby: Number(data.sortby || '0'),
    }
  }

  inviteStatusCheck = () => {
    const formatData = this.handleFormatData()
    this.props
      .dispatch({
        type: 'entInvite/pre',
        payload: {
          search: formatData,
        },
      })
      .then(({ data }) => {
        this.setState({
          currentInvitation: {
            ...formatData,
            invite_state: 0,
            tip: R.propOr('', 'tip', data),
            search_total: R.propOr(0, 'search_total', data),
          },
        })
      })
      .catch(() => {
        this.setState({
          currentInvitation: {
            ...formatData,
            invite_state: 0,
          },
        })
      })
  }

  handleCheckPeopleLessThan500 = () => {
    const inviteMemLeft = R.pathOr(
      0,
      ['mem', 'batch_invite'],
      this.props.currentUser
    )
    const search_total = R.pathOr(
      0,
      ['currentInvitation', 'search_total'],
      this.state
    )
    const showStrengthenRemindModal = inviteMemLeft > 0 && search_total < 500
    this.setState({
      showStrengthenRemindModal,
    })
    return showStrengthenRemindModal
  }

  handleShowInviteModal = () => {
    // 打点
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        search_query: JSON.stringify(this.props.advancedSearch),
      }
      const key = 'jobs_pc_batch_invite_show_modal'
      window.voyager.trackEvent(key, key, param)
    }

    this.setState(
      {
        showInviteModal: true,
      },
      this.inviteStatusCheck
    )
  }

  handleHideInviteModal = () => {
    this.setState({
      showInviteModal: false,
    })
  }

  handleCurrentInvitationChange = (currentInvitation = {}) => {
    this.setState({
      currentInvitation,
      showInviteModal: true,
    })
  }

  handleCanInvite = () => {
    return Object.keys(this.props.data).every((item) => {
      if (item === 'sortby') {
        return this.props.data[item] === '0'
      }
      return Boolean(this.props.data[item]) === false
    })
  }

  handleShowPopChange = (visible: boolean) => {
    this.setState({ showPop: visible })
  }

  renderInviteModal = () => {
    return (
      <InviteModal
        visible={this.state.showInviteModal}
        onCancel={this.handleHideInviteModal}
        data={this.state.currentInvitation}
        onCurrentInvitationChange={this.handleCurrentInvitationChange}
        onCheckPeopleLessThan500={this.handleCheckPeopleLessThan500}
      />
    )
  }

  handleConfirmContinue = () => {
    const { currentInvitation = {} } = this.state
    const formatData = {
      ...currentInvitation,
      companys: currentInvitation.companys
        ? replaceCompanySpecialCharacter(`${currentInvitation.companys}`)
        : '',
    }
    const res = {
      ...formatData,
      invite_state: 100,
    }
    this.handleCurrentInvitationChange(res)
    this.setState({
      showStrengthenRemindModal: false,
    })
  }

  renderStrengthenRemindModal = () => {
    return (
      <Modal
        title=""
        style={{ top: '35%' }}
        width={300}
        visible={this.state.showStrengthenRemindModal}
        okText={'确认发起'}
        footer={null}
        onCancel={() => {
          this.setState({
            showStrengthenRemindModal: false,
          })
        }}
      >
        <div
          style={{ position: 'relative', top: '20px', marginBottom: '40px' }}
        >
          此条件人才不足500人可能会影响招聘效果，请仔细确认或修改条件后再发起“下一步”操作
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            className={styles.btn}
            onClick={() => {
              this.setState({
                showStrengthenRemindModal: false,
                showInviteModal: false,
              })
            }}
            style={{ marginLeft: '50px' }}
          >
            去修改
          </Button>
          <Button
            className={styles.btn}
            type="primary"
            onClick={this.handleConfirmContinue}
          >
            确认发起
          </Button>
        </div>
      </Modal>
    )
  }

  renderInvitations = () => {
    return (
      <Invitations
        onCurrentSubscriptionChange={this.props.onCurrentSubscriptionChange}
        onOldVersionChange={this.props.onOldVersionChange}
        onShowInviteModal={this.handleCurrentInvitationChange}
        onShowPopChange={this.handleShowPopChange}
        onClear={this.props.onClear}
        isNewVersion={this.props.isNewVersion}
      />
    )
  }

  render() {
    const showInvite = R.pathOr(
      0,
      ['show', 'batch_invite'],
      this.props.currentUser
    )
    if (!showInvite) {
      return null
    }

    const { invitations } = this.props
    const canInvite = !this.handleCanInvite()
    return (
      <div className={styles.entInvite}>
        <Button
          className={styles.btn}
          type="primary"
          disabled={!canInvite}
          onClick={this.handleShowInviteModal}
        >
          开启智能邀约
        </Button>
        {invitations.length > 0 && (
          <Popover
            visible={this.state.showPop}
            onVisibleChange={this.handleShowPopChange}
            placement="rightBottom"
            content={this.renderInvitations()}
          >
            <div className={styles.alreadyInvite}>
              <Button type="likeLink">查看已发送·{invitations.length}</Button>
            </div>
          </Popover>
        )}
        {this.renderInviteModal()}
        {this.renderStrengthenRemindModal()}
      </div>
    )
  }
}
