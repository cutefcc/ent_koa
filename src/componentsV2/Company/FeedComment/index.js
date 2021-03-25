import * as R from 'ramda'
import React, { useState } from 'react'
import { Input, Avatar, Tooltip, Menu, Dropdown, Skeleton, Empty } from 'antd'
import { Text, Button, Icon, RichText } from 'mm-ent-ui'
import EmojiPanel from '../PublishDynamic/EmojiPanel'
import styles from './index.less'

const { TextArea } = Input

const CommentTextArea = ({
  onSubmit,
  submitting,
  placeholder = '',
  showAvatar = true,
  width = 746,
  avatar,
}) => {
  const [textValue, settextValue] = useState('')
  const [selectionStart, setselectionStart] = useState(0)

  const onChange = (e) => {
    settextValue(e.target.value)
    setselectionStart(e.target.selectionStart)
  }

  const addEmoji = (name) => {
    if ((name + textValue).length > 650) return
    settextValue(
      textValue.slice(0, selectionStart) +
        name +
        textValue.slice(selectionStart)
    )
    setselectionStart(selectionStart + name.length)
  }

  const publishReplay = () => {
    onSubmit(textValue)
    settextValue('')
  }

  return (
    <div className={styles.commentBox}>
      {Boolean(showAvatar) && (
        <Avatar size={32} style={{ marginTop: '4px' }} src={avatar} />
      )}
      <div className={styles.textAreaBox}>
        <TextArea
          className={styles.textarea}
          style={{ width: `${width}px` }}
          autoSize={{ minRows: 1, maxRows: 5 }}
          placeholder={placeholder || '写下你的评论'}
          value={textValue}
          onChange={onChange}
          onBlur={onChange}
        />
        <span className={styles.emoji}>
          <Tooltip
            placement="bottomRight"
            trigger="click"
            overlayClassName={styles.tooltip}
            title={<EmojiPanel onSelect={addEmoji} />}
          >
            <img
              alt="empty"
              src="https://i9.taou.com/maimai/p/24045/845_53_8QmI5NmAyyJ5nZ"
            />{' '}
          </Tooltip>
        </span>
      </div>
      <Button
        className="margin-left-16"
        style={{ width: '64px', height: '40px' }}
        htmlType="submit"
        loading={submitting}
        onClick={() => publishReplay()}
        type="primary"
      >
        发表
      </Button>
    </div>
  )
}

const CommentDetailItem = (props) => {
  const {
    hasComment = true,
    CommentWidth = 746,
    id,
    u = {},
    t = '',
    mylike = 0,
    likes = 0,
    time_str: timeStr,
    cmt = [],
    onCmtLike,
    onSubmitFeedCmt,
    onDelCmts,
    commpanyAvatar,
    n = 1,
    lv = 1,
    lv1U = {},
    ru = {},
    more,
    onRelayMoreClick,
  } = props

  const optionMenu = (
    <Menu>
      <Menu.Item onClick={() => onDelCmts(props)}>
        <a>删除</a>
      </Menu.Item>
    </Menu>
  )

  const { realname, position, career } = u
  const { realname: replayRealName } = lv1U
  const { realname: ruReplayRealName } = ru
  const [showComment, setShowComment] = useState(false)
  const onChange = () => {
    setShowComment(!showComment)
  }
  const likeText = mylike === 1 ? '已赞' : '赞'
  const likeNum = likes > 0 ? ` ${likes}` : ''
  return (
    <div>
      <div className={styles.commentDetailItem}>
        <div className={styles.avatar}>
          <Avatar size={32} src={u.avatar} />
        </div>
        <div className={styles.content}>
          <div className={styles.companyInfo}>
            <div>
              {' '}
              <Text className={styles.companyName}>{realname}</Text>
              {lv === 1 && (
                <span>
                  {' '}
                  {'·'}{' '}
                  <Text className={styles.companyNumIcon}>
                    {position || career}
                  </Text>
                </span>
              )}
              {lv === 2 && (
                <span>
                  {' '}
                  回复{' '}
                  <Text className={styles.companyName}>
                    {ruReplayRealName || replayRealName}{' '}
                  </Text>
                  {'：'}
                </span>
              )}
              {lv === 2 && (
                <span>
                  <RichText text={t} />
                </span>
              )}
            </div>
          </div>
          {lv === 1 && (
            <div className={styles.companyText}>
              <RichText text={t} />
            </div>
          )}
          <div className={styles.companyBar}>
            <span onClick={() => onCmtLike(props)}>
              <Text className={styles.like}>{`${likeText}${likeNum}`}</Text>
            </span>{' '}
            {' · '}{' '}
            <span onClick={onChange}>
              <Text className={styles.replay}>回复</Text>
            </span>{' '}
            {' · '} <Text className={styles.time}>{timeStr}</Text>
            <Dropdown overlay={optionMenu} placement="topLeft">
              <Icon
                style={{
                  verticalAlign: 'middle',
                  marginLeft: '8px',
                  cursor: 'pointer',
                }}
                type="more_bar_nor"
              />
            </Dropdown>
          </div>
        </div>
      </div>
      {hasComment && showComment && (
        <div className="margin-left-32">
          <div className="margin-bottom-16">
            <CommentTextArea
              showAvatar={false}
              avatar={commpanyAvatar}
              width={CommentWidth}
              placeholder={`回复 ${realname} ：`}
              onSubmit={(textValue) => onSubmitFeedCmt(textValue, props)}
            />
          </div>
        </div>
      )}

      <div className="margin-left-32">
        {cmt &&
          cmt.length > 0 &&
          cmt.map((item, index) => (
            <CommentDetailItem
              key={index}
              lv={2}
              lv1U={u}
              commpanyAvatar={commpanyAvatar}
              onCmtLike={onCmtLike}
              onSubmitFeedCmt={onSubmitFeedCmt}
              onDelCmts={() => onDelCmts(item)}
              CommentWidth={706}
              {...item}
              onRelayMoreClick={onRelayMoreClick}
            />
          ))}
      </div>
      {n > 1 && more === 1 && (
        <div
          className={styles.more}
          style={{ marginLeft: '40px' }}
          onClick={() => onRelayMoreClick(id)}
        >
          <Text> 查看更多回复</Text>
          <span style={{ verticalAlign: 'middle', marginLeft: '4px' }}>
            <Icon type="down_unfold" />
          </span>
        </div>
      )}
    </div>
  )
}

const Comment = (props) => {
  const {
    data = {},
    currentUser = {},
    onClickMore,
    onSubmitFeedCmt,
    onCmtLike,
    onDelCmts,
    onRelayMoreClick,
  } = props

  const { n: total, lst: list, more = 0, loading = false } = data || {}
  const clogo = R.pathOr(
    '',
    ['company', 'clogo'],
    currentUser.bprofileCompanyUser || {}
  )
  return (
    <div className={styles.wrap}>
      {/* {!loading && <CommentTextArea showAvatar onSubmit={onSubmitFeedCmt} avatar={clogo} />}  */}
      <CommentTextArea showAvatar onSubmit={onSubmitFeedCmt} avatar={clogo} />
      {loading && (
        <div className="margin-top-16">
          <Skeleton avatar paragraph={{ rows: 4 }} />
        </div>
      )}
      <div
        className={styles.line}
        style={{ marginTop: '16px', marginBottom: '16px' }}
      />
      <div className={styles.total}>全部{total}条评论</div>
      {!loading && total === 0 && (
        <Empty description="暂无评论" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
      {!loading && total > 0 && (
        <div>
          {list.map((item) => (
            <CommentDetailItem
              key={item.id}
              lv={1}
              commpanyAvatar={clogo}
              {...item}
              onCmtLike={onCmtLike}
              onSubmitFeedCmt={onSubmitFeedCmt}
              onDelCmts={onDelCmts}
              onRelayMoreClick={onRelayMoreClick}
            />
          ))}
          {Boolean(more) && (
            <div className={styles.more} onClick={onClickMore}>
              <Text> 查看更多评论</Text>
              <span style={{ verticalAlign: 'middle', marginLeft: '4px' }}>
                <Icon type="down_unfold" />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Comment
