import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import CompanyFansHoverBottomButton from 'componentsV3/CompanyFansHover/CompanyFansHoverBottomButton'
import * as styles from './index.less'

const CompanyFansHover = withRouter(({ rate, list }) => {
  const singleCompany = (item, index) => {
    let showFansCount = item.fan_count
    if (showFansCount > 9999) {
      showFansCount = `${(showFansCount / 10000).toFixed(2)}万`
    }
    if (item.ownerFlag === '1') {
      return (
        <div className={styles.singleContentOwner} key={index}>
          <div className={styles.singleContentLeft}>
            <img src={item.logo} className={styles.singleLogoImage} />
            <span className={styles.singleContentLeftName}>{item.cname}</span>
            <div className={styles.singleContentOwnContent}>贵公司</div>
          </div>
          <div>{showFansCount}</div>
        </div>
      )
    }
    return (
      <div className={styles.singleContent} key={index}>
        <div className={styles.singleContentLeft}>
          <img src={item.logo} className={styles.singleLogoImage} />
          <span className={styles.singleContentLeftName}>{item.cname}</span>
        </div>
        <div>{showFansCount}</div>
      </div>
    )
  }

  return (
    <div className={styles.fansCntHoverContent}>
      <div className={styles.fansCntHoverTitle}>
        企业粉丝指符合订阅条件的企业号粉丝数量，粉丝邀约成功率比普通用户高{rate}
        。
      </div>
      <div className={styles.fansListTitleContent}>
        <div>粉丝数榜单 TOP5</div>
        <div>企业粉丝数</div>
      </div>
      {list instanceof Array && list.map(singleCompany)}
      <CompanyFansHoverBottomButton />
    </div>
  )
})

export default connect((state) => ({
  list: state.companyFans.list,
  rate: state.companyFans.rate,
}))(CompanyFansHover)
