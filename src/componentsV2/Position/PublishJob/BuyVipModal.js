import React from 'react'
import { Modal } from 'antd'
import * as styles from './index.less'

export default function BuyVipModal({ onCancel }) {
  return (
    <Modal
      width={562}
      visible
      maskClosable={false}
      footer={null}
      wrapClassName={styles.buyVipModal}
      onCancel={onCancel}
    >
      <img
        style={{ width: 229 }}
        alt="职位邀约主图"
        src="https://i9.taou.com/maimai/p/23061/2612_103_11so7cv1DKYrC9PV"
      />
      <p className={styles.title}>发布成功！开通会员即享职位智能邀约！</p>
      <p className={styles.text}>批量沟通意向，招聘效果提升5-10倍</p>
      <div
        className="iframe-container"
        style={{ height: '350px', width: '562px', overflow: 'hidden' }}
      >
        <iframe
          id="pcContactLimitModal"
          title="pcContactLimitModal"
          width="562"
          height="430"
          frameBorder="no"
          border="0"
          src="https://maimai.cn/contact/member/pc_buy_popup_page?mem_id=5&from=recruiter_ai_exposure_pc"
          style={{ position: 'relative', top: '-50px' }}
        />
      </div>

      {/* <div className={styles.qrCode}>
        <img
          alt="职位邀约支付码"
          src="https://i9.taou.com/maimai/p/23766/6035_53_8McD3Vs8sQO2pL"
        />
        <p>
          请打开<span style={{ color: '#fb6b58' }}>脉脉APP</span>
          用“消息”右上角扫一扫完成支付
        </p>
      </div> */}
    </Modal>
  )
}
