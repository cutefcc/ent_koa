import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'ramda'
import classnames from 'classnames'
import BuyVipModalV2 from 'componentsV2/Position/PublishJob/BuyVipModalV2'
import styled from './vipBanner.less'

const FR = `recruiter_member_center_banner_pc`

const mapStateToProps = (state) => ({
  currentUser: state.global.currentUser,
})

const VipBanner = ({ dispatch, currentUser }) => {
  const [vipVisible, setVisible] = useState(false)
  const [payBannersData, setPayBannersData] = useState({})
  const [bannerText, setBannerText] = useState('立即开通')
  const { mem = {} } = currentUser
  // 非招聘会员/企业会员 && 未过期时展示banner
  const isVipBannerHidden = isEmpty(mem)
    ? true
    : (+mem.mem_id === 5 || +mem.mem_id === 6) && +mem.mem_st === 1

  useEffect(() => {
    fetchDataByPayBanners()
    fetchDataByTryMemberSt()
  }, [])

  const fetchDataByPayBanners = async () => {
    const { result, swiper_type, ...data } = await dispatch({
      type: 'positions/getPayBanners',
      payload: {
        fr: FR,
      },
    })
    if (result === 'ok') {
      setPayBannersData(data)
    }
  }

  const fetchDataByTryMemberSt = async () => {
    const { try_member_st } = await dispatch({
      type: 'global/fetchTryMemberSt',
      payload: {
        fr: FR,
      },
    })
    setBannerText(Number(try_member_st) === 0 ? '立即开通' : '0.1元试用')
  }

  const handleMain = () => {
    const key = 'recruiter_member_center_banner_pc_click'
    window.voyager.trackEvent(key, key, {})
    setVisible(true)
  }

  const handleCancel = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setVisible(false)
  }

  if (isVipBannerHidden) return null

  return (
    <section className={styled.bannerView} onClick={() => handleMain()}>
      {vipVisible && (
        <BuyVipModalV2
          onCancel={handleCancel}
          payBannersData={payBannersData}
          fr={FR}
        />
      )}

      <div className={styled.main}>
        <img
          className={styled.mainIcon}
          src="https://i9.taou.com/maimai/p/27432/1745_6_11s9DjWVZo1wShXK"
        />
        <img
          className={styled.mainIntro}
          src="https://i9.taou.com/maimai/p/27432/1746_6_21oOkiIAXQTXihbi"
        />
      </div>
      <div className={styled.btn}>{bannerText}</div>
      <img
        className={classnames(styled.basePo, styled.po1)}
        src="https://i9.taou.com/maimai/p/27432/1744_6_wLXXbL0WawtwJY"
      />
      <img
        className={classnames(styled.basePo, styled.po2)}
        src="https://i9.taou.com/maimai/p/27432/1742_6_72SiHqGzR5ajNCdQ"
      />
      <img
        className={classnames(styled.basePo, styled.po3)}
        src="https://i9.taou.com/maimai/p/27432/1743_6_87OaoZstQq20cIr"
      />
    </section>
  )
}

export default connect(mapStateToProps)(VipBanner)
