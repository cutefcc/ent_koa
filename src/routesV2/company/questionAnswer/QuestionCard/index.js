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
import FeedComment from '../AnswerCard/index'

export default function DynamicCard(props) {
  const {
    data = {},
    commendKey,
    type = '',
    currentUser = {},
    onClickMore,
    feedActionClick,
    onSubmitFeedCmt,
    onCmtLike,
    onDelCmts,
    onRelayMoreClick,
    questionList,
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
  const { follow_cnt, answer_cnt } = questionList
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
  const [showComment, setCommentStatus] = useState(false)
  const isEntDynamic = type === 'ent'

  // const handleRedirectToDetail = () => {
  //   window.open(`https://maimai.cn/web/feed_detail?fid=${id}&efid=${efid}`)
  // }

  const line1 = (
    <div className="flex  flex-align-center">
      <RichText
        linkStyle={{ color: '#1890ff' }}
        text={questionList.text}
        closeJump={false}
      />
    </div>
  )

  const line2 = (
    <div>
      <Text type="text_primary" size={14}>
        <RichText linkStyle={{ color: '#222' }} text={questionList.desc} />
      </Text>
    </div>
  )
  const line_time = (
    <div style={{ color: '#999EAA', fontSize: 14 }}>{questionList.crtime}</div>
  )

  const getLine4 = () => {
    const res = []
    if (questionList.imgs.length && questionList.imgs.length > 0) {
      res.push(
        <FeedMultiImg
          pics={questionList.imgs}
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

  const getLine5 = () => {
    const [hoveStat, setHoverStat] = useState({
      showCnt: false,
      comment_cnt: false,
    })

    const barLabelMap = [
      {
        key: 'follow_cnt',
        iconNor: 'view_nor',
        default: '0',
        iconHover: 'view_hover',
        colorNor: '#999999',
        colorHover: '#666666',
      },
      {
        key: 'answer_cnt',
        default: '评论',
        iconNor: 'comment_nor',
        myiconNor: 'comment_sel',
        iconHover: 'comment_hover',
        colorNor: '#999999',
        colorHover: '#666666',
        colorClick: '#3375FF',
      },
    ]

    const getContent = (key) => {
      let msg = ''
      if (key === 'follow_cnt') {
        msg = `该条动态关注了${follow_cnt || 0}次`
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
      if (key === 'follow_cnt') {
        trigger = 'click'
      }
      return trigger
    }

    const getIconType = (conf) => {
      if (conf.key === 'answer_cnt' && showCmt) {
        return conf.myiconNor
      }
      if (hoveStat[conf.key]) {
        return conf.iconHover
      }
      return conf.iconNor
    }

    const getColor = (conf) => {
      if (conf.key === 'answer_cnt' && showCmt) {
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
        className={conf.key === 'follow_cnt' ? '' : 'margin-left-32'}
        key={conf.key}
        style={{
          cursor: 'pointer',
        }}
        onClick={() => {
          feedActionClick(conf.key), setCommentStatus(!showComment)
        }}
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
          {conf.key == 'answer_cnt' && (
            <Text
              style={{
                lineHeight: '20px',
                verticalAlign: 'top',
                color: `${getColor(conf)}`,
              }}
              className="font-size-14"
            >
              {answer_cnt ? getfriendNum(answer_cnt) : conf.default}
            </Text>
          )}
          {conf.key == 'follow_cnt' && (
            <Text
              style={{
                lineHeight: '20px',
                verticalAlign: 'top',
                color: `${getColor(conf)}`,
              }}
              className="font-size-14"
            >
              {follow_cnt ? getfriendNum(follow_cnt) : conf.default}
            </Text>
          )}
        </Popover>
      </span>
    )
    const bars = barLabelMap.map(renderBarItem)
    return (
      <div className="flex space-between">
        <Text type="text_common">{bars}</Text>
      </div>
    )
  }

  return (
    <div className={styles.main} key={data.gfid} ref={setContainer}>
      <FeedCard
        logoProps={{}}
        hideUser={true}
        line1={line1}
        line2={line2}
        line4={getLine4()}
        line_time={line_time}
        line5={getLine5()}
        className="width-p100"
      />

      <FeedComment
        currentUser={currentUser}
        data={cmt}
        header={header}
        onClickMore={onClickMore}
        onSubmitFeedCmt={(textValue, lv2Item) =>
          onSubmitFeedCmt(textValue, lv2Item)
        }
        showComment={showComment}
        onCmtLike={onCmtLike}
        onDelCmts={onDelCmts}
        onRelayMoreClick={onRelayMoreClick}
      />
    </div>
  )
}
