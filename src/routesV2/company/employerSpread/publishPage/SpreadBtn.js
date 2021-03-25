import React, { PureComponent } from 'react'
import { MUIButton } from 'mm-ent-ui'
import { injectUnmount } from 'utils'
// import * as R from 'ramda'
import { connect } from 'react-redux'
import styles from './SpreadBtn.less'

@connect((state) => ({
  loading: state.loading.effects,
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
}))
@injectUnmount
export default class SpreadBtn extends PureComponent {
  state = {}

  render() {
    const {
      handlePublishClick,
      handlePreviewClick,
      preCountLoading,
    } = this.props
    return (
      <div className={styles.employerSpreadProcessingBtnArea}>
        <div className={`${styles.employerSpreadProcessingBtn} flex`}>
          <MUIButton
            type="mbutton_l_fixed_blue450_l1"
            onClick={handlePublishClick}
            style={{ marginRight: '16px', width: '128px' }}
            disabled={preCountLoading}
          >
            提交推广计划
          </MUIButton>
          <MUIButton
            type="mbutton_l_fixed_l3"
            onClick={handlePreviewClick}
            style={{ width: '128px' }}
          >
            预览
          </MUIButton>
        </div>
        {/* <div className={`${styles.employerSpreadProcessingBtnInfo}`}>
          <Text type="text_primary" size={14}>
            当前剩余{epb}次权益，本次下发将消耗1次权益
          </Text>
        </div> */}
      </div>
    )
  }
}
