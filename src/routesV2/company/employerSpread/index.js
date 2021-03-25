import React, { PureComponent } from 'react'
import { injectUnmount, trackEvent } from 'utils'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Modal } from 'mm-ent-ui'
import EmployerSpreadBegin from './employerSpreadBegin'
import EmployerSpreadProcessing from './employerSpreadProcessing'
import EmployerSpreadEndList from './employerSpreadEndList'
import { debounce } from 'utils/index'

@connect((state) => ({
  loading: state.loading.effects,
  currentUser: state.global.currentUser,
  bprofileUser: state.global.bprofileUser,
  urlPrefix: state.global.urlPrefix,
  schedule: state.company.schedule,
  employerBalance: state.company.employerBalance,
}))
@injectUnmount
export default class EmployerSpread extends PureComponent {
  state = {}

  componentDidMount() {
    trackEvent('bprofile_company_manage_employerspread_enter')
    this.handleInit()
    // this.handleChangeSchedule()('begin')
    // 用户首次进入推广页面 ，仅展示一次
    try {
      if (!window.localStorage.getItem('employerspread_revision_tip')) {
        Modal.info({
          title: '推广规则调整通知',
          content:
            '为提升推广服务体验和推广效果，后续将调整 "推广券" 为 “曝光币" ，一张推广券等于300个曝光币。请知悉。',
          okText: '我知道了',
          icon: <span />,
        })
        window.localStorage.setItem('employerspread_revision_tip', 1)
      }
    } catch (error) {
      console.log(error)
    }
  }

  getSceduleMap = () => {
    return {
      begin: (
        <EmployerSpreadBegin onScheduleChanged={this.handleChangeSchedule()} />
      ),
      processing: (
        <EmployerSpreadProcessing
          onScheduleChanged={this.handleChangeSchedule()}
        />
      ),
      end: (
        <EmployerSpreadEndList
          onScheduleChanged={this.handleChangeSchedule()}
        />
      ),
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      this.props.bprofileUser.employer_promote_cnt !=
        newProps.bprofileUser.employer_promote_cnt ||
      this.props.bprofileUser.employer_promote_nbr !=
        newProps.bprofileUser.employer_promote_nbr
    ) {
      this.handleInit(newProps)
    }
  }

  handleInit = (newProps = {}) => {
    // employer_promote_cnt 代表已发次数，employer_promote_nbr 代表剩余权益
    const { employer_promote_cnt: epc = 0, employer_promote_nbr } =
      newProps.bprofileUser || this.props.bprofileUser || this.props.currentUser
    if (epc > 0) {
      this.handleChangeSchedule()('end')
    } else {
      this.handleChangeSchedule()('begin')
    }
    if (this.props.employerBalance === undefined) {
      this.props.dispatch({
        type: 'company/setData',
        payload: {
          employerBalance: employer_promote_nbr,
        },
      })
    }
  }

  handleChangeSchedule = () => (str) => {
    this.props.dispatch({
      type: 'company/setSchedule',
      payload: str,
    })
  }

  render() {
    const { schedule } = this.props
    const Con = R.propOr(null, schedule, this.getSceduleMap())

    return Con
  }
}
