import React from 'react'
import * as R from 'ramda'
import { Text, UploadImg, FeedMultiImg, Loading } from 'mm-ent-ui'
import { Input, Radio, Select } from 'antd'
import JobSelect from 'componentsV2/Position/Recommend/JobSelect'
import ItemTitle from './ItemTitle'
import styles from './SpreadContent.less'

const { TextArea } = Input

export default function SpreadContent(props) {
  const {
    handleTextAreaChange,
    contentValue,
    handleUploadImgChange,
    handleJumpUrlChange,
    handlePushTypChange,
    handleDynamicChange,
    loadImg,
    imgSrc,
    jobs,
    defaultValue,
    handleJidChange,
    jid,
    handleCancleImg,
    employerSpreadData,
    dynamicList,
  } = props
  const {
    promote_type: promoteType = 8,
    jump_url: jumpUrl = '',
    push_type: pushType = 0,
    fid: fid = 0,
    img_url: imgUrl,
  } = employerSpreadData
  const defaultSrc =
    'https://i9.taou.com/maimai/p/26418/8318_53_11CcjklTz8WDEn7d'
  const defalutLinkContent = `https://maimai.cn/bizjobs/company?webcid=${defaultValue.webcid}`
  const defaultContent = promoteType === 6 && defaultValue.content !== ''
  const defaultLogo = promoteType === 6 && defaultValue.tag_pic !== ''
  const defaultLink = promoteType === 6 && defaultValue.webcid !== ''
  const dynamic =
    dynamicList.find((item) => String(item.id) === String(fid)) || null

  const renderSpreadContent = () => {
    return (
      <div className={styles.spreadProcessingContent}>
        <div className={`${styles.spreadProcessingscen} flex`}>
          <div className={styles.spreadProcessingscenLeft}>
            <Text type="text_primary" size={14}>
              选择场景<span style={{ color: '#FF4D3C' }}>*</span>
            </Text>
          </div>
          <div className={styles.spreadProcessingscenRight}>
            <Radio.Group onChange={handlePushTypChange} value={pushType}>
              <Radio disabled={promoteType !== 8} value={1}>
                首页粉丝头条
              </Radio>
              <Radio value={0}>聊天消息推送</Radio>
            </Radio.Group>
          </div>
        </div>

        {promoteType === 8 && (
          <div className={`${styles.spreadProcessingContentInfo} flex`}>
            <div className={styles.spreadProcessingContentInfoLeft}>
              <Text type="text_primary" size={14}>
                选择动态<span style={{ color: '#FF4D3C' }}>*</span>
              </Text>
            </div>
            <div className={styles.spreadProcessingscenRight}>
              <Select
                onChange={(value) => handleDynamicChange(value)}
                style={{ width: 592 }}
                placeholder="请选择要推送的官方动态"
              >
                {dynamicList.map((item) => (
                  <Select.Option key={item.id}>
                    {item.style1.text}
                  </Select.Option>
                ))}
              </Select>
              {dynamic && <FeedCard {...dynamic} />}
            </div>
          </div>
        )}
        {(promoteType === 5 || promoteType === 6 || promoteType === 7) && (
          <div className={`${styles.spreadProcessingContentInfo} flex`}>
            <div className={styles.spreadProcessingContentInfoLeft}>
              <Text type="text_primary" size={14}>
                推送内容<span style={{ color: '#FF4D3C' }}>*</span>
              </Text>
            </div>
            <div className={styles.spreadProcessingContentInfoRight}>
              <TextArea
                rows={4}
                style={{ height: '120px', resize: 'none' }}
                onChange={handleTextAreaChange}
                disabled={defaultContent}
                maxLength={250}
                value={defaultContent ? defaultValue.content : contentValue}
                placeholder="请输入，建议250字内"
              />
            </div>
          </div>
        )}
        {(promoteType === 5 || promoteType === 6 || promoteType === 7) && (
          <div className={`${styles.spreadProcessingContentImg} flex`}>
            <div className={styles.spreadProcessingContentImgLeft}>
              <Text type="text_primary" size={14}>
                封面配图
              </Text>
            </div>
            <div className={styles.spreadProcessingContentImgMidd}>
              <UploadImg
                onUploadChange={handleUploadImgChange}
                loadImg={defaultLogo ? true : loadImg}
                imgSrc={defaultLogo ? defaultSrc : imgUrl || null}
                width="200px"
                height="112px"
                onCancleImg={handleCancleImg}
              />
            </div>
            <div className={styles.spreadProcessingContentImgRight}>
              <Text type="text_primary" size={12} style={{ color: '#999999' }}>
                *图片格式为JPG，尺寸为622*352px，大小不超过1M。
              </Text>
            </div>
          </div>
        )}

        {promoteType === 6 && (
          <div className={`${styles.spreadProcessingContentPos} flex`}>
            <div className={styles.spreadProcessingContentPosLeft}>
              <Text type="text_primary" size={14}>
                活动链接<span style={{ color: '#FF4D3C' }}>*</span>
              </Text>
            </div>
            <div className={styles.spreadProcessingContentPosRight}>
              <Input
                width="100%"
                placeholder="请输入活动链接"
                disabled={defaultLink}
                onChange={handleJumpUrlChange}
                value={defaultLink ? defalutLinkContent : jumpUrl}
              />
            </div>
          </div>
        )}
        {promoteType === 7 && (
          <div className={`${styles.spreadProcessingContentPos} flex`}>
            <div className={styles.spreadProcessingContentPosLeft}>
              <Text type="text_primary" size={14}>
                选择职位<span style={{ color: '#FF4D3C' }}>*</span>
              </Text>
            </div>
            <div className={styles.spreadProcessingContentPosRight}>
              {!jobs ? (
                <Loading />
              ) : (
                <JobSelect
                  data={jobs}
                  onChange={handleJidChange}
                  width="100%"
                  value={jid}
                  placeholder="请选择职位"
                  notFoundContent="暂无在招职位"
                  dropdownStyle={{
                    paddingTop: 40,
                    paddingBottom: 40,
                    textAlign: 'center',
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.employerSpreadProcessingContent}>
      <ItemTitle str="推广场景和内容" />
      {renderSpreadContent()}
    </div>
  )
}

export const FeedCard = (props) => {
  const imgs = R.path(['style1', 'imgs'])(props) || []
  const text = R.path(['style1', 'text'])(props) || ''
  const efid = R.path(['efid'])(props)
  const id = R.path(['id'])(props)
  const res = []
  const goDetailHandle = () => {
    window.open(`https://maimai.cn/web/feed_detail?fid=${id}&efid=${efid}`)
  }
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
  return (
    <div
      className={styles.spreadProcessingContentfeedRight}
      onClick={goDetailHandle}
    >
      <div className={styles.spreadProcessingContentfeedText}>{text}</div>
      {res.length > 0 && (
        <div className={styles.spreadProcessingContentfeedImage}>{res}</div>
      )}
    </div>
  )
}
