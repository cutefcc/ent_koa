import * as React from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Message } from 'mm-ent-ui'
import { replaceCompanySpecialCharacter } from 'utils'
import * as R from 'ramda'
import InviteModalStatus from './InviteModalStatus'
import StepSecondInstructModal from '../StepSecondInstructModal'
import StepThirdInstructModal from '../StepThirdInstructModal'
import InviteData from '../InviteData'
import InviteJobSelect from '../InviteJobSelect'
import * as styles from './index.less'

const btnText = {
  0: '下一步',
  1: '我知道了',
  2: '我知道了',
  3: '我知道了',
  100: '发起智能邀约',
}

const stepModalMap = {
  '0': StepSecondInstructModal,
  '1': StepThirdInstructModal,
}

const contentComponentMap = {
  '0': InviteData,
  '1': InviteData,
  '2': InviteData,
  '3': InviteData,
  '100': InviteJobSelect,
}

const styleStatusMap = {
  '0': 0,
  '1': 2,
  '2': 3,
  '3': 3,
  '100': 1,
}

const defaultInviteText =
  '我们正在大力引进互联网各方向优秀人才！公司福利待遇丰厚，寻求有理想的优秀小伙伴们加入！'

export interface Props {
  visible: boolean
  onCancel: Function
  data: object
  onCurrentInvitationChange: Function
}

export interface Loading {
  effects: Object
}

export interface GlobalStore {
  currentUser: object
}

export interface GlobalState {
  loading: Loading
  global: GlobalStore
}

export interface State {
  status: number
  showStepModal: boolean
  stepStatus: number
  errorTip: string
  currentJid: number
  inviteText: string
}

@connect((state: GlobalState) => ({
  loading: state.loading.effects['entInvite/add'],
  currentUser: state.global.currentUser,
  advancedSearch: state.talentDiscover.advancedSearch,
}))
export default class InviteModal extends React.PureComponent<
  Props & Loading & GlobalStore,
  State
> {
  constructor(props) {
    super(props)
    this.state = {
      status: 1,
      showStepModal: false,
      stepStatus: -1,
      errorTip: '',
      currentJid: 0,
      inviteText: defaultInviteText,
    }
  }

  componentWillReceiveProps(newProps) {
    if (!R.equals(newProps.data, this.props.data)) {
      this.setState({
        errorTip: '',
      })
    }
  }

  componentDidMount() {
    this.refreshCurrentUser()
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

  refreshCurrentUser = () =>
    this.props.dispatch({
      type: 'global/fetchCurrentUser',
    })

  renderContentData = () => {
    const { currentJid, inviteText } = this.state
    const {
      data,
      data: { invite_state: status = 0 },
    } = this.props

    const Comp = contentComponentMap[status]
    return (
      <Comp
        data={data}
        onJidChange={this.handleSelectJob}
        currentJid={currentJid}
        onTextChange={this.handleChangeInviteText}
        inviteText={inviteText}
      />
    )
  }

  handleSelectJob = (jid) => {
    this.setState({
      currentJid: jid,
    })
  }

  handleChangeInviteText = (text) => {
    this.setState({
      inviteText: text,
    })
  }

  handleAddInvite = (status, inviteMemLeft) => {
    if (inviteMemLeft === 0) {
      this.props
        .dispatch({
          type: 'entInvite/keepBusiness',
          payload: {
            fr: 'batch_invite',
            uid: window.uid,
          },
        })
        .then(() => {
          Message.config({
            top: 284,
          })
          Message.success('我们将通知您的管理员')
          Message.config({
            top: 84,
          })
        })
      return
    }
    const formatData = this.handleFormatData()
    if (status === 0) {
      if (this.props.onCheckPeopleLessThan500()) {
        return
      }
      // 清空职位选择
      this.setState(
        {
          currentJid: 0,
          inviteText: defaultInviteText,
        },
        () => {
          const res = {
            ...formatData,
            invite_state: 100,
          }
          this.props.onCurrentInvitationChange(res)
        }
      )
      return
    }

    // 只有第二步才能下发，第二步设定该值为100
    if (status !== 100) {
      this.props.onCancel()
      return
    }

    const { currentJid, inviteText } = this.state
    const formatText = R.trim(inviteText)

    // 邀约内容必填，且最少10个字符
    if (!formatText || formatText.length < 10) {
      Message.warning('邀约内容至少10个字！')
      return
    }
    this.props
      .dispatch({
        type: 'entInvite/add',
        payload: {
          search: formatData,
          pos_info: {
            jid: currentJid,
            content: formatText,
          },
        },
      })
      .then(({ data }) => {
        // 当有 tip 的时候
        const errorTip = R.propOr('', 'tip', data)
        if (errorTip) {
          this.setState({
            errorTip,
          })
          return
        }
        if (window.voyager) {
          const param = {
            datetime: new Date().getTime(),
            uid: window.uid,
            search_query: JSON.stringify(this.props.advancedSearch),
            id: data,
          }
          const key = 'jobs_pc_batch_invite_start_now'
          window.voyager.trackEvent(key, key, param)
        }
        Message.success('发起邀约成功')
        // this.props.onCancel()
        const res = {
          ...formatData,
          invite_state: 1,
        }
        this.props.onCurrentInvitationChange(res)
        // 添加完成之后，需要同步刷新用户当前余额的数据，和邀约列表
        this.props.dispatch({
          type: 'global/fetchCurrentUser',
        })
        this.props.dispatch({
          type: 'entInvite/fetch',
          payload: {},
        })
      })
  }

  handleGoPrevious = () => {
    const formatData = this.handleFormatData()
    const res = {
      ...formatData,
      invite_state: 0,
    }
    this.props.onCurrentInvitationChange(res)
  }

  handleIconClick = (stepStatus) => {
    this.setState(
      {
        stepStatus,
      },
      () => {
        this.setState({
          showStepModal: true,
        })
      }
    )
  }

  handleStepModalHide = () => {
    this.setState({
      showStepModal: false,
    })
  }

  renderTitle = () => {
    return <div className={styles.inviteModalTitle}>脉脉人才智能邀约</div>
  }

  renderStepModal = () => {
    const steps = [0, 1]
    const { stepStatus, showStepModal } = this.state
    if (!steps.includes(stepStatus) || !showStepModal) {
      return null
    }

    const Comp = stepModalMap[stepStatus]
    return (
      <div className={styles.stepModalWrapper}>
        {<Comp onCancel={this.handleStepModalHide} />}
      </div>
    )
  }

  render() {
    const {
      data: { invite_state: status = 0, tip, search_total = 0 },
      currentUser,
    } = this.props
    const errorTip = this.state.errorTip || tip
    const inviteMemLeft = R.pathOr(0, ['mem', 'batch_invite'], currentUser)

    const error =
      status === 0 && inviteMemLeft <= 0
        ? '请联系管理员开通，立享招聘效果'
        : errorTip
    return (
      <Modal
        wrapClassName={styles.inviteModalWrapper}
        visible={this.props.visible}
        onOk={() => this.handleAddInvite(status)}
        onCancel={this.props.onCancel}
        title={this.renderTitle()}
        width={480}
        footer={null}
        maskClosable={false}
      >
        <p className={styles.tips}>
          对当前条件下的人才立即发起邀约，并在接下来30天内持续对条件下新增的求职人才实时发起邀约，快人一步获取人才意向。
        </p>
        <InviteModalStatus
          status={status}
          handleIconClick={this.handleIconClick}
        />
        <div className={styles.contentWrapper}>
          <div
            className={`${styles.angle} angle-${
              parseInt(styleStatusMap[status], 10) + 1
            }`}
          ></div>
          <div className={styles.content}>{this.renderContentData()}</div>
        </div>
        <div className={`${styles.operate}`}>
          <div className={`${styles.leftTip}`}>
            {status === 100 && (
              <div
                className={`${styles.previous} font-size-12`}
                onClick={this.handleGoPrevious}
              >
                上一步
              </div>
            )}
            {status !== 100 && (
              <div>
                <div className={`${styles.remainNum} font-size-16`}>
                  剩余权益：{inviteMemLeft}
                </div>
                {error && status === 0 && (
                  <div className={`${styles.tipText} font-size-12`}>
                    {error ===
                    `此条件人才不足500人，请仔细确认或修改条件后再发起“下一步”操作。`
                      ? ''
                      : error}
                  </div>
                )}
                {!error && status === 0 && inviteMemLeft > 0 && (
                  <div className={`font-size-12`}>本次将消耗1次权益</div>
                )}
              </div>
            )}
          </div>
          <div className={`${styles.rightBtn}`}>
            <Button
              type="primary"
              onClick={() => this.handleAddInvite(status, inviteMemLeft)}
              style={{ height: '40px', width: '132px' }}
              disabled={!!error && inviteMemLeft > 0 && search_total >= 10000}
            >
              {inviteMemLeft === 0 ? '立即申请开通' : btnText[status]}
            </Button>
          </div>
        </div>
        {this.renderStepModal()}
      </Modal>
    )
  }
}
