import React, { useState } from 'react'
import {
  Text,
  RichText,
  FeedMultiImg,
  ArticleCard,
  FeedCard,
  Button,
  Popover,
  Avatar,
} from 'mm-ent-ui'
import styles from './index.less'

export default function DynamicCard(props) {
  const { data = {}, type = '', answerList, currentUser } = props
  const { style1 = {}, common = {} } = data
  const { style61 = {}, is_top } = answerList
  const { user = {}, likes } = style61
  const { company } = currentUser
  const {
    header = {},
    rtext = '',
    text = '',
    imgs = [],
    video = null,
    quote_card: quoteCard = {},
  } = style1
  const { card } = quoteCard
  const showText = rtext || text
  const [container, setContainer] = useState(undefined)
  const isEntDynamic = type === 'ent'
  // const handleRedirectToDetail = () => {
  //   window.open(`https://maimai.cn/web/feed_detail?fid=${id}&efid=${efid}`)
  // }
  const line1 = (
    <div className="flex  flex-align-center">
      <RichText
        linkStyle={{ color: '#1890ff' }}
        text={style61.text}
        closeJump={false}
      />
    </div>
  )
  const user_msg = (
    <div>
      <Avatar size="24" src={company.clogo}></Avatar>
      <Text style={{ fontSize: 14, color: '#222', marginLeft: 8 }}>
        {company.stdname}
      </Text>
      <Text style={{ fontSize: 14, fontWeight: 400, color: '#666' }}>
        {' '}
        . {user.compos}
      </Text>
    </div>
  )
  const line_time = (
    <div style={{ color: '#999EAA', fontSize: 14 }}>{style61.crtime}</div>
  )
  const line2 = (
    <div>
      <Text type="text_primary" size={14}>
        <RichText text={style61.answer} />
      </Text>
    </div>
  )

  const getLine4 = () => {
    const res = []
    if (style61.imgs.length && style61.imgs.length > 0) {
      res.push(
        <FeedMultiImg
          pics={imgs}
          key="multiImgs"
          className="width-p100"
          multiImgSize={56}
        />
      )
    }

    if (video) {
      res.push(
        <video
          style={{
            width: '500px',
            height: '281px',
            background: 'black',
          }}
          key={video.url}
          src={video.url}
          poster={video.turl}
          controls
        />
      )
    }

    if (quoteCard.owner) {
      const quoteCardTarget = quoteCard.target.replace(
        'taoumaimai://feeddetail',
        'https://maimai.cn/web/feed_detail'
      )

      const clickQuoteCardDetail = () => {
        if (quoteCardTarget) {
          window.open(quoteCardTarget)
        }
      }
      const ShareLine1 = () => (
        <div className={styles.shareLine1}>
          <span>
            <RichText
              text={quoteCard.owner.replace(
                '<dref t=12 v=会员></dref><dref t=12 v=会员2></dref>',
                ''
              )}
            />
          </span>
          <div onClick={clickQuoteCardDetail}>
            <RichText text={quoteCard.text} />
          </div>
          {quoteCard.imgs && quoteCard.imgs.length > 0 && (
            <div onClick={clickQuoteCardDetail}>
              <FeedMultiImg
                pics={quoteCard.imgs}
                key="multiImgs"
                className="width-p100"
                multiImgSize={56}
              />
            </div>
          )}

          {quoteCard.video && (
            <div>
              <video
                style={{
                  width: '500px',
                  height: '281px',
                  background: 'black',
                }}
                key={quoteCard.video.url}
                src={quoteCard.video.url}
                poster={quoteCard.video.turl}
                controls
              />
            </div>
          )}
        </div>
      )

      res.push(<ShareLine1 />)
    }

    if (card) {
      const cardData = {
        avatar: card.icon,
        target: card.target,
        line1: card.title,
      }
      res.push(
        <ArticleCard card={cardData} key="card" className="width-p100" />
      )
    }

    return res
  }

  const getToTopButton = () => {
    const btnText = is_top === 0 ? '置顶' : '取消置顶'
    return (
      <Button type="button_m_exact_link_blue" onClick={props.answerOnToTop}>
        {btnText}
      </Button>
    )
  }
  const toTopButton = getToTopButton()
  const renderActionButtons = () => {
    return [
      toTopButton,
      <Popover.Confirm
        trigger="click"
        onConfirm={props.onRemove}
        title={<div className="font-size-16">确定将该动态从企业号移除？</div>}
        showIcon
        placement="topRight"
        getPopupContainer={() => container || document.body}
        key="remove"
        width={210}
      >
        <Button type="button_m_exact_link_blue" className="margin-left-32">
          移出企业号
        </Button>
      </Popover.Confirm>,
    ]
  }

  const getLine5 = () => {
    const { action_bar: actionBar = {} } = common

    const [hoveStat, setHoverStat] = useState({
      showCnt: false,
      comment_cnt: false,
    })

    const barLabelMap = [
      {
        key: 'like_cnt',
        default: '靠谱',
        iconNor: 'like_nor',
        myiconNor: 'like_sel',
        iconHover: 'like_hove',
        colorNor: '#999999',
        colorHover: '#666666',
        colorClick: '#3375FF',
      },
    ]

    // const getContent = (key) => {
    //   let msg = ''
    //   if (key === 'show_cnt') {
    //     msg = `该条动态点赞了${actionBar[key] || 0}次`
    //   }
    //   return msg
    // }

    const getfriendNum = (num) => {
      const numMax = num / 10000
      let numText = num
      if (numMax > 10) {
        numText = `${numMax.toFixed(1)}w+`
      }
      return numText
    }

    const getPopoverTrigger = (key) => {
      let trigger = 'none'
      if (key === 'show_cnt') {
        trigger = 'click'
      }
      return trigger
    }

    const getIconType = (conf) => {
      if (conf.key === 'like_cnt' && actionBar.liked === 1) {
        return conf.myiconNor
      }
      if (hoveStat[conf.key]) {
        return conf.iconHover
      }
      return conf.iconNor
    }

    const getColor = (conf) => {
      if (conf.key === 'like_cnt' && actionBar.liked === 1) {
        return conf.colorClick
      }

      if (hoveStat[conf.key]) {
        return conf.colorHover
      }

      return conf.colorNor
    }

    const renderBarItem = (conf) => (
      <span
        key={conf.key}
        style={{
          cursor: 'pointer',
        }}
      >
        <Popover trigger={getPopoverTrigger(conf.key)}>
          <Text
            style={{
              lineHeight: '20px',
              verticalAlign: 'top',
              color: '#222',
            }}
            className="font-size-14"
          >
            {likes || 0}
          </Text>
          <Text style={{ marginLeft: 4, color: '#999EAA' }}>靠谱</Text>
        </Popover>
      </span>
    )
    const bars = barLabelMap.map(renderBarItem)
    return (
      <div className="flex space-between">
        <Text type="text_common">{bars}</Text>
        <div className="feed-bar-action">{renderActionButtons()}</div>
      </div>
    )
  }

  return (
    <div className={styles.main} key={data.gfid} ref={setContainer}>
      <FeedCard
        logoProps={{
          name: header.clean_title,
          src: header.icon,
          shape: isEntDynamic ? 'square' : 'circle',
          className: 'cursor-pointer',
        }}
        hideUser={true}
        line1={line1}
        user_msg={user_msg}
        line2={line2}
        // line4={getLine4()}
        line_time={line_time}
        line5={getLine5()}
        className="width-p100"
      />
    </div>
  )
}
