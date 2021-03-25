import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import CompanyFansHoverBottomButton from 'componentsV3/CompanyFansHover/CompanyFansHoverBottomButton'
import * as styles from './index.less'

const CompanyFansHoverEmpty = withRouter(({ rate }) => {
  return (
    <div className={styles.guideFansContent}>
      <div className={styles.guideFansButtonText}>
        企业粉丝是潜在高意向人才，邀约成功率比普通用户高{rate}
      </div>
      <CompanyFansHoverBottomButton />
    </div>
  )
})

export default connect((state) => ({
  rate: state.companyFans.rate,
}))(CompanyFansHoverEmpty)
