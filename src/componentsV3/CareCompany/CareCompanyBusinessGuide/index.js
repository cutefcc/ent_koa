import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Button } from 'mm-ent-ui'
import * as styles from './index.less'

function CareCompanyBusinessGuide(props) {
  const scenes = R.pathOr('', ['scenes'], props)
  const urlPrefix = R.pathOr('', ['urlPrefix'], props)
  const dispatch = R.pathOr('', ['dispatch'], props)
  return (
    <div className={`${styles.businessGuideCon}`}>
      {scenes === 'groups' && (
        <img
          src={`${urlPrefix}/images/empty_position.png`}
          alt="empty_position"
          style={{ display: 'block', margin: '0 auto', marginTop: '80px' }}
        />
      )}
      <div className={styles.title}>开通企业高级会员</div>
      <div className={styles.subTitle}>一键入库对标企业，纵览候选人详情</div>
      <div className={styles.btn}>
        <Button
          type="button_m_fixed_blue450"
          onClick={(e) => {
            e.stopPropagation()
            dispatch({
              type: 'global/setMemberUpgradeTip',
              payload: {
                show: true,
              },
            })
          }}
        >
          了解详情
        </Button>
      </div>
    </div>
  )
}

export default connect((state, dispatch) => ({
  dispatch,
  urlPrefix: state.global.urlPrefix,
}))(CareCompanyBusinessGuide)
