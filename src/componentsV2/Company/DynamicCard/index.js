import React, { useState } from 'react'
import {
  Text,
  RichText,
  FeedMultiImg,
  ArticleCard,
  FeedCard,
  Button,
  Popover,
  Icon,
} from 'mm-ent-ui'
import styles from './index.less'
import FeedComment from '../FeedComment'

export default function DynamicCard(props) {
  const {
    data = {},
    type = '',
    residueTimes = 0,
    currentUser = {},
    onClickMore,
    feedActionClick,
    onSubmitFeedCmt,
    onCmtLike,
    onDelCmts,
    onRelayMoreClick,
  } = props
  const {
    style1 = {},
    common = {},
    id,
    efid,
    is_on_top: isOnTop = 0,
    cmt,
    showCmt,
  } = data
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

  const handleRedirectToDetail = () => {
    window.open(`https://maimai.cn/web/feed_detail?fid=${id}&efid=${efid}`)
  }

  const line1 = (
    <div className="flex space-between flex-align-center">
      <span>
        <Text type="title" size={14}>
          {header.clean_title || '-'}
        </Text>
        <Text type="text_common" size={14} className="margin-left-8">
          {header.clean_desc || ''}
        </Text>
      </span>
      {/* TODO 这里填充时间 */}
      <Text type="text_week">{header.time_subtitle || ''}</Text>
    </div>
  )

  const line3 = showText ? (
    <div onClick={handleRedirectToDetail}>
      <Text type="text_primary" size={14}>
        <RichText text={showText} />
      </Text>
    </div>
  ) : (
    ''
  )

  const getLine4 = () => {
    const res = []
    if (imgs.length && imgs.length > 0) {
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

          {/* TODO 这里填充时间 */}
          {/* <Text type="text_week">{header.time_subtitle || ''}</Text> */}
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
    const btnText = isOnTop === 0 ? '置顶' : '取消置顶'
    return (
      <Button type="button_m_exact_link_blue" onClick={props.onToTop}>
        {btnText}
      </Button>
    )
  }

  const getPushButton = () => {
    return (
      <Button
        type="button_m_exact_link_blue"
        className="margin-left-32"
        onClick={() => {
          window.open('/ent/v2/company/ope/employerSpread')
        }}
      >
        推广
      </Button>
    )
  }

  const toTopButton = getToTopButton()
  const toPushButton = getPushButton()
  const renderActionButtons = () => {
    if (isEntDynamic) {
      const pushButtonPopContent = (
        <div className="flex">
          <Icon
            type="star_circle_tip"
            className="margin-right-16 margin-top-6 color-orange500"
          />
          <div>
            <Text type="title" size={16} className="display-block">
              是否通过消息直接推送给所有粉丝?
            </Text>
            <Text
              type="text_primary"
              size={14}
              className="display-block margin-top-12"
            >
              该功能为企业号付费客户特权，本周可使用{residueTimes}次
            </Text>
          </div>
        </div>
      )

      const pushButton =
        residueTimes > 0 ? (
          <Popover.Confirm
            trigger="click"
            onConfirm={props.onSendToFans}
            title={pushButtonPopContent}
            placement="topRight"
            getPopupContainer={() => container || document.body}
            key="push"
            okText="确定推送"
            overlayClassName={styles.pushConfirmContent}
            width={384}
          >
            <Popover
              trigger="hover"
              content={
                <div className="margin-top-4 margin-bottom-4">
                  付费客户专属特权
                </div>
              }
              getPopupContainer={() => container || document.body}
              type="blue"
            >
              <Button
                type="button_m_exact_link_blue"
                className="margin-left-32"
              >
                推送给粉丝
              </Button>
            </Popover>
          </Popover.Confirm>
        ) : (
          <Popover
            trigger="hover"
            content="本周粉丝推送次数已达上限"
            getPopupContainer={() => container || document.body}
            width={200}
          >
            <span className={[styles.pushToFansDisabled, 'margin-left-32']}>
              推送给粉丝
            </span>
          </Popover>
        )
      return [
        toTopButton,
        toPushButton,
        // pushButton,
        <Popover.Confirm
          trigger="click"
          onConfirm={props.onDelete}
          title={<div className="ont-size-16">确定删除该动态？</div>}
          showIcon
          placement="topRight"
          getPopupContainer={() => container || document.body}
          key="delete"
          width={172}
        >
          <Button type="button_m_exact_link_blue" className="margin-left-32">
            删除
          </Button>
        </Popover.Confirm>,
      ]
    }
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
      like_cnt: false,
      comment_cnt: false,
      share_cnt: false,
    })

    const barLabelMap = [
      {
        key: 'show_cnt',
        iconNor: 'view_nor',
        default: '0',
        iconHover: 'view_hover',
        colorNor: '#999999',
        colorHover: '#666666',
      },
      {
        key: 'like_cnt',
        default: '点赞',
        iconNor: 'like_nor',
        myiconNor: 'like_sel',
        iconHover: 'like_hove',
        colorNor: '#999999',
        colorHover: '#666666',
        colorClick: '#3375FF',
      },
      {
        key: 'comment_cnt',
        default: '评论',
        iconNor: 'comment_nor',
        myiconNor: 'comment_sel',
        iconHover: 'comment_hover',
        colorNor: '#999999',
        colorHover: '#666666',
        colorClick: '#3375FF',
      },
      {
        key: 'share_cnt',
        default: '分享',
        iconNor: 'spread_nor',
        iconHover: 'spread_hover',
        colorNor: '#999999',
        colorHover: '#666666',
      },
    ]

    const getContent = (key) => {
      let msg = ''
      if (key === 'show_cnt') {
        msg = `该条动态曝光了${actionBar[key] || 0}次`
      }

      if (key === 'share_cnt') {
        msg = `该条动态分享了${actionBar[key] || 0}次`
      }
      return msg
    }

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
      if (key === 'show_cnt' || key === 'share_cnt') {
        trigger = 'click'
      }
      return trigger
    }

    const getIconType = (conf) => {
      if (conf.key === 'like_cnt' && actionBar.liked === 1) {
        return conf.myiconNor
      }
      if (conf.key === 'comment_cnt' && showCmt) {
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
      if (conf.key === 'comment_cnt' && showCmt) {
        return conf.colorClick
      }

      if (hoveStat[conf.key]) {
        return conf.colorHover
      }

      return conf.colorNor
    }

    const mouseEnterHandler = (key) => {
      const newHoverstat = {}
      newHoverstat[key] = true
      setHoverStat({ ...hoveStat, ...newHoverstat })
    }

    const mouseLeaveHandler = (key) => {
      const newHoverstat = {}
      newHoverstat[key] = false
      setHoverStat({ ...hoveStat, ...newHoverstat })
    }

    const renderBarItem = (conf) => (
      <span
        className={conf.key === 'show_cnt' ? '' : 'margin-left-32'}
        key={conf.key}
        style={{
          cursor: 'pointer',
        }}
        onClick={() => feedActionClick(conf.key)}
        onMouseLeave={() => {
          mouseLeaveHandler(conf.key)
        }}
        onMouseEnter={() => {
          mouseEnterHandler(conf.key)
        }}
      >
        {' '}
        <Popover
          content={getContent(conf.key)}
          trigger={getPopoverTrigger(conf.key)}
        >
          <Icon
            style={{ width: '16px', height: '16px' }}
            className="margin-right-4"
            type={getIconType(conf)}
          />
          <Text
            style={{
              lineHeight: '20px',
              verticalAlign: 'top',
              color: `${getColor(conf)}`,
            }}
            className="font-size-14"
          >
            {actionBar[conf.key]
              ? getfriendNum(actionBar[conf.key])
              : conf.default}
          </Text>
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
        // onClick={(e) => handleRedirectToDetail(e)}
        line1={line1}
        line3={line3}
        line4={getLine4()}
        line5={getLine5()}
        className="width-p100"
      />
      {showCmt && (
        <FeedComment
          currentUser={currentUser}
          data={cmt}
          header={header}
          onClickMore={onClickMore}
          onSubmitFeedCmt={(textValue, lv2Item) =>
            onSubmitFeedCmt(textValue, lv2Item)
          }
          onCmtLike={onCmtLike}
          onDelCmts={onDelCmts}
          onRelayMoreClick={onRelayMoreClick}
        />
      )}
    </div>
  )
}
