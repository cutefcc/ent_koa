import React, { useState } from 'react'
import { Carousel } from 'antd'
import { Button, Message } from 'mm-ent-ui'
import { connect } from 'react-redux'
import { trackEvent } from 'utils'
import styles from './index.less'

function ExampleFeed({ dispatch, auth }) {
  const tipsContent = [
    {
      title: '·首页推荐',
      content: '优先对JD匹配的中高端候选人进行推荐',
    },
    {
      title: '·员工代言',
      content: '员工背书突出雇主品牌吸引关注',
    },
    {
      title: '·精准增粉',
      content: '定向邀约目标人群，转化为企业号粉丝',
    },
  ]

  const [current, setCurrent] = useState(0)

  const onClick = () => {
    trackEvent('talent_bank_to_bprofile_modal', {
      target_type: 'more',
      is_pay: auth.isCompanyPayUser,
    })
    dispatch({
      type: 'entInvite/keepBusiness',
      payload: {
        fr: 'buy_company_vip',
        uid: window.uid,
      },
    }).then(() => {
      Message.success('销售将在3个工作日内联系您，为您介绍企业号的更多玩法')
    })
  }

  return (
    <div className={styles.addFansTips}>
      <p className={styles.addFansTipsHeader}>更多涨粉小技巧</p>
      <div className={styles.addFansTipsMain}>
        <Carousel
          effect="fade"
          autoplay
          beforeChange={(from, to) => setCurrent(to)}
        >
          <div className={styles.addFansImg}>
            <img
              alt="empty"
              src="https://i9.taou.com/maimai/p/25659/2188_53_1bkW51A7TrnzUJ"
            />
          </div>
          <div className={styles.addFansImg}>
            <img
              alt="empty"
              src="https://i9.taou.com/maimai/p/25659/2189_53_2QfIMNmASyf5jZ"
            />
          </div>
          <div className={styles.addFansImg}>
            <img
              alt="empty"
              src="https://i9.taou.com/maimai/p/25729/9455_53_71uRYjxysBx4KmvL"
            />
          </div>
        </Carousel>
        <div className={styles.addFansContent}>
          {tipsContent.map(({ title, content }, index) => {
            return (
              <div
                key={title}
                className={index === current ? styles.activeTip : ''}
              >
                <p>{title}</p>
                <span>{content}</span>
              </div>
            )
          })}
        </div>
      </div>
      <Button
        type="button_l_fixed_blue450"
        onClick={onClick}
        style={{ margin: '8px 220px', width: '120px' }}
      >
        了解详情
      </Button>
    </div>
  )
}

export default connect((state, dispatch) => ({
  currentUser: state.global.currentUser,
  auth: state.global.auth,
  dispatch,
}))(ExampleFeed)
