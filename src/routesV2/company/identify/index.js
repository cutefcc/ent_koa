import React from 'react'
import urlParse from 'url'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'
import IdentifyOperate from './IdentifyOperate'
import IdentifyRecords from './IdentifyRecords'

const Identify = withRouter(({ history, auth, currentUser }) => {
  // 权限验证
  if (
    auth.isCompanyExtraPay &&
    !auth.isCompanyExtraPay(currentUser, 'auth_employee_authentication')
  ) {
    history.push('/ent/v2/company/home')
    return null
  }

  const urlObj = urlParse.parse(history.location.search, true)
  // 当前页面 operate:认证操作  records: 操作记录
  const tab = R.trim(R.pathOr('', ['query', 'tab'], urlObj)) || 'operate'

  const getSceduleMap = () => {
    return {
      operate: <IdentifyOperate key="operate" />,
      records: <IdentifyRecords key="records" />,
    }
  }

  return getSceduleMap()[tab]
})

export default connect((state) => ({
  auth: state.global.auth,
  currentUser: state.global.currentUser,
}))(Identify)
