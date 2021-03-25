import React, { useState, useEffect, useRef } from 'react'
import { Carousel } from 'antd'
import { Button, Message, Modal, MUIIcon, MUIAvatar } from 'mm-ent-ui'
import { connect } from 'react-redux'
import { trackEvent, GUID } from 'utils'
import urlParse from 'url'
import request from 'utils/request'
import * as R from 'ramda'
import styles from './index.less'

function SnatchTalentModal({ dispatch, onCancel }) {
  const snatchMap = [
    {
      title: '1.内容触达',
      content: '企业内容，直达目标人群，展现企业风采',
      img: 'https://i9.taou.com/maimai/p/26320/7024_53_71aVCyhFuQSilUFz',
    },
    {
      title: '2.建立关系',
      content: '企业号粉丝邀约成功率比普通用户高34%',
      img: 'https://i9.taou.com/maimai/p/26320/7021_53_4enBxLXKyLit79',
    },
    {
      title: '3.活动促活',
      content: '被企业活动感召的用户，对企业信任度高出其他用户32%',
      img: 'https://i9.taou.com/maimai/p/26320/7023_53_61egVKvHwF0RWKrb',
    },
    {
      title: '4.得到人才',
      content: '建立起信任的人才，岗位应约率高出其他用户21%',
      img: 'https://i9.taou.com/maimai/p/26345/533_53_61nccFQPvey9mGjX',
    },
  ]

  const [current, setCurrent] = useState(0)
  const [users, setUsers] = useState([])
  const [visible, setVisible] = useState(false)

  let slider = useRef()

  useEffect(() => {
    const str = R.pathOr(
      '',
      ['query', 'query'],
      urlParse.parse(window.location.href, true)
    )
    const sid = GUID()
    request(`/api/ent/discover/search`, {
      method: 'POST',
      query: {
        channel: 'www',
        data_version: '3.0',
        version: '3.0',
      },
      body: {
        search: {
          query: str,
          size: 8,
          sid,
          sessionid: sid,
        },
      },
    }).then(({ data }) => {
      if (data.code === 0) {
        setUsers(data.data.list)
      }
      setVisible(true)
    })
  }, [])

  const onClick = () => {
    trackEvent('snatch_talent_bprofile_modal')
    dispatch({
      type: 'entInvite/keepBusiness',
      payload: {
        fr: 'buy_company_vip',
        uid: window.uid,
      },
    }).then(() => {
      Message.success('销售将在3个工作日内联系您，为您介绍企业号的更多玩法')
    })
    onCancel()
  }

  return (
    <Modal
      width={680}
      style={{ top: 80 }}
      visible={visible}
      maskClosable={false}
      footer={null}
      className={styles.snatchModal}
      onCancel={onCancel}
      title="企业号「四步抢人」法，提前储备中高端人才"
    >
      <div className={styles.titleTab}>
        {snatchMap.map(({ title }, index) => {
          return (
            <div key={title}>
              <p
                onClick={() => {
                  setCurrent(index)
                  slider.goTo(index)
                }}
                className={index === current ? styles.activeTab : ''}
              >
                {title}
              </p>
              {index < 3 ? (
                <MUIIcon
                  style={{ fontSize: 16, color: '#6E727A', marginLeft: 8 }}
                  type="right"
                />
              ) : null}
            </div>
          )
        })}
      </div>
      <Carousel
        effect="fade"
        autoplay
        beforeChange={(from, to) => setCurrent(to)}
        ref={(ref) => {
          slider = ref
        }}
      >
        {snatchMap.map(({ title, content, img }) => {
          return (
            <div key={title} className={styles.snatchMain}>
              <p>{content}</p>
              {users.length ? (
                <div className={styles.talentAvatars}>
                  {users.map((user) => {
                    return (
                      <MUIAvatar key={user.id} size={24} src={user.avatar} />
                    )
                  })}
                  <div className={styles.talentAvatarsMore}>
                    <MUIIcon style={{ fontSize: 12 }} type="more" />
                  </div>
                </div>
              ) : null}
              <img alt="empty" src={img} />
            </div>
          )
        })}
      </Carousel>
      <Button
        type="button_m_fixed_blue450"
        onClick={onClick}
        style={{ margin: '0px 273px', width: '133px' }}
      >
        进入使用
      </Button>
    </Modal>
  )
}

export default connect((state, dispatch) => ({
  currentUser: state.global.currentUser,
  auth: state.global.auth,
  dispatch,
}))(SnatchTalentModal)
