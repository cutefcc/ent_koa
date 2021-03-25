import * as React from 'react'
import * as R from 'ramda'
import { MUIAlert } from 'mm-ent-ui'
import { message } from 'antd'
import { connect } from 'react-redux'
import { talentReportAuthority } from 'utils/talentReport'

export interface Props {
  dispatch?: (obj: object) => any
  selectMenuKey?: string
  compareCompanyList?: Array<object>
  isJobCheckBox?: number
  talentReportVersion?: number
}

export interface State {}
@connect((state: any) => ({
  selectMenuKey: state.talentReport.selectMenuKey,
  compareCompanyList: state.talentReport.compareCompanyList,
  isJobCheckBox: state.talentReport.isJobCheckBox,
  talentReportVersion: state.talentReport.talentReportVersion,
}))
export default class CommonTips extends React.PureComponent<Props, State> {
  updateTalentReport = () => {
    this.props
      .dispatch({
        type: 'entInvite/keepBusiness',
        payload: {
          fr: 'buy_talent_report',
          uid: window.uid,
        },
      })
      .then(() => {
        message.success('销售将在3个工作日内联系您，为您介绍人才报告完整功能')
      })
  }

  render() {
    const {
      selectMenuKey,
      compareCompanyList,
      isJobCheckBox,
      talentReportVersion,
    } = this.props

    const rightsSet = R.pathOr(
      new Set([]),
      [talentReportVersion],
      talentReportAuthority
    )

    // 所有权限都已开通
    if (
      rightsSet.has(selectMenuKey) &&
      compareCompanyList.length > 0 &&
      isJobCheckBox === 1
    ) {
      return null
    }

    let tempTips = '升级人才报告，解锁'
    if (!rightsSet.has(selectMenuKey)) {
      tempTips += '报告全部图表、'
    }
    if (isJobCheckBox !== 1) {
      tempTips += '岗位分析功能、'
    }
    if (compareCompanyList.length === 0) {
      tempTips += '对比公司数据、'
    }
    tempTips = tempTips.substr(0, tempTips.length - 1)

    return (
      <MUIAlert
        message={tempTips}
        type="info"
        showIcon
        buttonWord="立刻升级"
        buttonType="main"
        handleClick={this.updateTalentReport}
        style={{ marginBottom: '30px' }}
      />
    )
  }
}
