import React from 'react'
import { Modal } from 'antd'
import * as styles from './index.less'
import { Carousel } from 'react-responsive-carousel'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

function BuyVipModalV2(props) {
  const { urlPrefix, onCancel, payBannersData, fr } = props

  return (
    <Modal
      width={900}
      height={552}
      visible
      maskClosable={false}
      footer={null}
      wrapClassName={styles.buyVipModalV2}
      onCancel={onCancel}
    >
      {/* <div className="modal-container"> */}
      <div className="left-container">
        {payBannersData && payBannersData[5] ? (
          <Carousel
            autoPlay
            renderThumbs={() => {}}
            showStatus={false}
            infiniteLoop
            interval={3000}
            renderArrowPrev={() => {}}
            renderArrowNext={() => {}}
          >
            {payBannersData[5].map((item) => {
              return (
                <div className="slice-item">
                  <div className="item-contain">
                    <div className="title">{item.title}</div>
                    <div className="sub-title">{item.desc}</div>
                    <img className="item-img" src={item.icon}></img>
                  </div>
                </div>
              )
            })}
          </Carousel>
        ) : null}
      </div>
      <div className="right-containter">
        <div
          className="iframe-container"
          style={{ height: 552, width: 560, overflow: 'hidden' }}
        >
          <iframe
            id="pcContactLimitModal"
            title="pcContactLimitModal"
            width="560"
            height="552"
            frameBorder="no"
            border="0"
            src={`https://maimai.cn/contact/member/pc_buy_popup_page?mem_id=5&from=${fr}&newStyle=1`}
            // style={{ position: 'relative', top: '-50px' }}
          />
        </div>
      </div>
    </Modal>
  )
}

export default withRouter(
  connect((state, dispatch) => ({
    dispatch,
    currentUser: state.global.currentUser,
    urlPrefix: state.global.urlPrefix,
    companyFans: state.companyFans,
  }))(BuyVipModalV2)
)
