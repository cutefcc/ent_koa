import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, message } from 'antd'
import * as styles from './index.less'

const CompanyFansHoverBottomButton = withRouter(
  ({ openStatus, isCompanyVip, saleType, dispatch }) => {
    const trackClickEvent = (eventName, param) => {
      if (window.voyager) {
        window.voyager.trackEvent(eventName, eventName, param)
      }
    }

    const bottomBtnClick = (type) => {
      if (type === 'A') {
        // 打点
        const param = {
          datetime: new Date().getTime(),
          uid: window.uid,
          btnType: type,
        }
        trackClickEvent('jobs_pc_talent_to_bprofile_click', param)
        window.open(`/ent/v2/company/home?fr=talent_bank`)
      } else if (type === 'B') {
        // 打点
        const param = {
          datetime: new Date().getTime(),
          uid: window.uid,
          btnType: type,
        }
        trackClickEvent('jobs_pc_talent_to_bprofile_click', param)
        window.open(`/ent/v2/company/home?fr=talent_bank`)
      } else if (type === 'C') {
        // 没有按钮
      } else if (type === 'D') {
        // 打点
        const param = {
          datetime: new Date().getTime(),
          uid: window.uid,
        }
        trackClickEvent('jobs_pc_talent_want_bprofile_click', param)
        dispatch({
          type: 'entInvite/keepBusiness',
          payload: {
            fr: 'buy_company_vip',
            uid: window.uid,
          },
        }).then(() => {
          message.success('销售将在3个工作日内联系您，为您介绍企业号的更多玩法')
        })
      }
    }

    const bottomBtn = (type) => {
      if (type === 'A') {
        return (
          <Button
            className={styles.bottomBtn}
            key="a"
            type="primary"
            onClick={bottomBtnClick.bind(this, type)}
          >
            发动态得粉丝
          </Button>
        )
      } else if (type === 'B') {
        return (
          <Button
            className={styles.bottomBtn}
            key="b"
            type="primary"
            onClick={bottomBtnClick.bind(this, type)}
          >
            获得更多粉丝
          </Button>
        )
      } else if (type === 'C') {
        return null
      } else if (type === 'D') {
        return (
          <Button
            className={styles.bottomBtn}
            key="d"
            type="primary"
            onClick={bottomBtnClick.bind(this, type)}
          >
            点击获取专属1v1
          </Button>
        )
      }

      return null
    }

    let type = 'C'
    if (openStatus === 1) {
      if (isCompanyVip === 1) {
        if (saleType === 1) {
          type = 'A'
        } else {
          type = 'B'
        }
      } else {
        type = 'C'
      }
    } else {
      type = 'D'
    }

    return bottomBtn(type)
  }
)

export default connect((state, dispatch) => ({
  dispatch,
  openStatus: state.companyFans.openStatus,
  isCompanyVip: state.companyFans.isCompanyVip,
  saleType: state.companyFans.saleType,
}))(CompanyFansHoverBottomButton)
