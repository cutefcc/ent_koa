/* eslint-disable */
import React, { useState } from 'react'
import { trackEvent } from 'utils'
import { connect } from 'react-redux'
import {
  CloseOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import {
  Modal,
  Input,
  Tooltip,
  Upload,
  Progress,
  message,
  Popconfirm,
  Popover,
} from 'antd'
import { Button } from 'mm-ent-ui'
import * as R from 'ramda'
import urlParse from 'url'
import EmojiPanel from './EmojiPanel'
import ExampleFeed from './ExampleFeed'
import AddFansTips from './AddFansTips'
import EditVideoForm from 'routesV2/company/album/VideoWrap/EditVideoForm'
import UploadUi from 'componentsV3/Upload/reactUI/index'
import styles from './index.less'

const { TextArea, Search } = Input
const { confirm } = Modal

function PublishDynamicModal({
  onOk,
  onCancel,
  currentUser,
  guideTag,
  bprofileUser,
  dispatch,
  auth,
}) {
  const [textValue, settextValue] = useState('')
  const [selectionStart, setselectionStart] = useState(0)
  const [fileList, setfileList] = useState([])

  const [uploadingVideo, setuploadingVideo] = useState({})
  const [videoFile, setvideoFile] = useState({})
  const [videoImageFileId, setvideoImageFileId] = useState()
  const [videoDuration, setvideoDuration] = useState(0)
  const [videoCoverTooltip, setvideoCoverTooltip] = useState(false)
  const [videoProcessData, setvideoProcessData] = useState()
  const [uploaderCore, setUploaderCore] = useState({})

  const [linkData, setlinkData] = useState({})
  const isVideo = (file) => file.type.slice(0, 5) === 'video'

  const fr = R.pathOr(
    '',
    ['query', 'fr'],
    urlParse.parse(window.location.href, true)
  )

  const imgUploadDisabled = (() => {
    return (
      !R.isEmpty(videoFile) ||
      fileList.length >= 9 ||
      !R.isEmpty(linkData) ||
      videoCoverTooltip
    )
  })()
  const videoUploadDisabled = (() => {
    return (
      !R.isEmpty(videoFile) ||
      !R.isEmpty(fileList) ||
      !R.isEmpty(linkData) ||
      videoCoverTooltip
    )
  })()
  const linkDisabled = (() => {
    return (
      !R.isEmpty(videoFile) ||
      !R.isEmpty(fileList) ||
      !R.isEmpty(linkData) ||
      videoCoverTooltip
    )
  })()

  const submitDisabled = (() => {
    return (
      R.isEmpty(videoFile) &&
      R.isEmpty(fileList.filter((f) => f.status === 'done')) &&
      R.isEmpty(linkData) &&
      textValue.trim().length === 0
    )
  })()

  const formatDuration = (d) => {
    let sec = parseInt(d) % 60
    let min = Math.floor(d / 60)

    sec = sec < 10 ? '0' + sec : sec
    min = min < 10 ? '0' + min : min

    return `${min}:${sec}`
  }

  const onUplaodRef = (core) => {
    setUploaderCore(core)
  }

  const onChangeText = (e) => {
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

  const handleUploadChange = ({ file, fileList: uploadFileList }) => {
    if (!isVideo(file)) {
      setfileList([...uploadFileList].slice(0, 9))
    }
    if (file.status === 'error') {
      message.error('文件太大')
      setfileList(R.without([file], fileList))
    }
  }

  // 上传前
  const beforeUploadVideoFile = (file) => {
    setuploadingVideo({ ...uploadingVideo, ...file })
    setvideoCoverTooltip(true)
  }

  // 上传进度
  const progressHandle = (data) => {
    setvideoProcessData(data)
  }

  // 上传✅
  const successedHandle = (data) => {
    setvideoProcessData({ uploadSuccess: 1, ...data })
    setuploadingVideo({ ...data })
  }

  // 选好视频封面
  const onVideoFormOk = (data) => {
    // 参数data = {cover_uri: coverImage, cover_id: coverImageId, title: videoName, id: file.id}
    setvideoFile({
      file_id: uploadingVideo.file_id,
      url: uploadingVideo.url,
      cover_uri: data.cover_uri,
    })
    setuploadingVideo({
      ...uploadingVideo,
      coverImage: data.cover_uri,
      coverImageId: data.cover_id,
    })
    setvideoImageFileId(data.cover_id)
    setvideoDuration(uploadingVideo.duration)
    setvideoCoverTooltip(false)
    setvideoProcessData()
  }

  const onDeleteVideo = () => {
    confirm({
      title: '确认要删除视频吗？',
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        setvideoFile({})
        setuploadingVideo({})
        setvideoCoverTooltip(false)
      },
      onCancel() {},
    })
  }

  const parseLink = (url) => {
    dispatch({
      type: 'company/parseUrl',
      payload: { article_source: url },
    }).then((res) => {
      setlinkData({ ...res.card, fid: res.fid })
    })
  }

  const addFeed = () => {
    if (submitDisabled) return
    if (videoFile.file_id && !textValue) {
      message.info('请输入文字内容')
      return
    }

    trackEvent('bprofile_company_manage_publish_feed_click', {
      cid: currentUser.bprofileCompanyUser.cid,
    })

    const picIds =
      (fileList.length &&
        fileList
          .map((image) => image.response && image.response.id)
          .filter((id) => !!id)
          .join(',')) ||
      null
    dispatch({
      type: 'company/addFeed',
      payload: {
        text: textValue,
        cid: currentUser.bprofileCompanyUser.cid,
        cuid: bprofileUser.company.cuid,
        pic_ids: picIds,
        video_file_id: videoFile.file_id,
        image_file_id: videoImageFileId,
        add_video: videoFile.file_id ? 1 : 0,
        share_inter_fid: linkData.fid,
        share_outter_url: linkData.target,
        hash: new Date() * 1,
      },
    }).then(({ feed, result }) => {
      if (result === 'ok') {
        onOk(!!videoFile.file_id, feed.id)
        trackEvent('bprofile_company_manage_publish_feed_success', {
          fid: feed.id,
          cid: currentUser.bprofileCompanyUser.cid,
        })
      }
    })
  }

  const importLink = () => {
    return (
      <Search
        placeholder="请在此粘贴文章链接"
        enterButton="导入"
        style={{ width: 336, margin: 16 }}
        onSearch={(value) => parseLink(value)}
      />
    )
  }

  const renderTitle = () => {
    return (
      <div className={styles.modalTitle}>
        <span>发布企业动态</span>
        {guideTag ? (
          <img src="https://i9.taou.com/maimai/p/25155/3522_53_57lQV39FyNMirz" />
        ) : null}
      </div>
    )
  }

  const renderFooter = () => {
    return (
      <div className={styles.footerWrap}>
        <div className={styles.footerChild}>
          <Tooltip
            placement="bottomLeft"
            trigger="click"
            overlayClassName={styles.tooltip}
            title={<EmojiPanel onSelect={addEmoji} />}
          >
            <p className={styles.richBar}>
              <img
                alt="empty"
                src="https://i9.taou.com/maimai/p/24045/845_53_8QmI5NmAyyJ5nZ"
              />
              <span>表情</span>
            </p>
          </Tooltip>

          <Upload
            accept=".png,.jpg,.jpeg"
            action="/upfile_for_company"
            showUploadList={false}
            multiple={true}
            disabled={imgUploadDisabled}
            data={(file) => ({
              fdata: file,
              kos: 1,
              ftype: 2,
              webuid: bprofileUser.company.webuid,
            })}
            beforeUpload={(file) => {
              if (file.type.slice(0, 5) === 'video') {
                handleUploadVideoFile(file)
                return false
              }
              return true
            }}
            fileList={fileList}
            onChange={handleUploadChange}
          >
            <Tooltip
              placement="top"
              title={`支持.png，.jpg，.jpeg格式，5M以内`}
            >
              <p
                className={`${styles.richBar} ${
                  imgUploadDisabled ? styles.richBarDisabled : ''
                }`}
              >
                <img
                  alt="empty"
                  src="https://i9.taou.com/maimai/p/24045/843_53_62ulHfODBQ06yfz1"
                />
                <span>图片</span>
              </p>
            </Tooltip>
          </Upload>
          <Tooltip
            placement="bottom"
            autoAdjustOverflow={false}
            visible={videoCoverTooltip}
            overlayClassName={styles.videoCoverTooltip}
            destroyTooltipOnHide={true}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
            title={
              <div>
                <div className={styles.editVideoFormTitle}>
                  <h3>{videoProcessData ? '上传视频' : '编辑视频'}</h3>
                  <Popconfirm
                    title={`确定放弃已上传的${
                      videoProcessData ? '视频' : '封面'
                    }吗？`}
                    onConfirm={() => {
                      // setuploadingVideo({})
                      setvideoCoverTooltip(false)
                      setvideoProcessData()
                    }}
                    onCancel={() => {}}
                    okText="确定"
                    cancelText="取消"
                    placement="top"
                  >
                    <CloseOutlined size={12} />
                  </Popconfirm>
                </div>
                <EditVideoForm
                  formParams={{ webuid: bprofileUser.company.webuid }}
                  file={uploadingVideo}
                  processData={videoProcessData}
                  onOk={onVideoFormOk}
                />
              </div>
            }
          >
            <div
              className={`${styles.richBar} ${
                videoUploadDisabled ? styles.richBarDisabled : ''
              }`}
            >
              <UploadUi
                onBerforeUpload={beforeUploadVideoFile}
                onProgress={progressHandle}
                onSuccessed={successedHandle}
                maxSize={500}
                maxDuration={5}
                cuid={bprofileUser.company.cuid}
                webuid={bprofileUser.company.webuid}
                onRef={onUplaodRef}
              />
              <img
                alt="empty"
                src="https://i9.taou.com/maimai/p/24631/5195_53_72Ql2fODbQ76qf71"
              />
              <span>视频</span>
            </div>
          </Tooltip>

          <Tooltip
            placement="bottom"
            trigger="click"
            overlayClassName={styles.tooltip}
            title={importLink()}
          >
            <p
              className={`${styles.richBar} ${
                linkDisabled ? styles.richBarDisabled : ''
              }`}
            >
              <img
                alt="empty"
                src="https://i9.taou.com/maimai/p/24045/844_53_7bqWo1A7zrRzXJ"
              />
              <span>链接</span>
            </p>
          </Tooltip>
        </div>
        <div className={styles.footerChild}>
          <p
            className={`${styles.textCount} ${
              textValue.length === 650 ? styles.textCountWarn : null
            }`}
          >
            {textValue.length}/650
          </p>
          <Button
            type={
              submitDisabled
                ? 'button_m_exact_blue100'
                : 'button_m_exact_blue450'
            }
            onClick={addFeed}
          >
            发布
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Modal
      width={560}
      style={{ top: 80 }}
      visible={true}
      maskClosable={false}
      title={renderTitle()}
      footer={renderFooter()}
      className={styles.publishModal}
      onCancel={onCancel}
    >
      <TextArea
        maxLength={650}
        placeholder={`最近发生了哪些新鲜事...`}
        autoSize
        value={textValue}
        onChange={onChangeText}
        onBlur={onChangeText}
      />
      <div className={styles.imgsContainer}>
        {fileList.map((file) => {
          return file.status === 'done' ? (
            <div key={file.id} className={styles.richContent}>
              <img
                key={file.id}
                alt={file.name}
                src={file.response.file_path}
              />
              <span className={styles.action}>
                <CloseOutlined
                  size={12}
                  onClick={() => {
                    setfileList(R.without([file], fileList))
                  }}
                />
              </span>
            </div>
          ) : (
            <div className={styles.imgProgressWrap}>
              <Progress
                width={40}
                type="circle"
                strokeColor="#fff"
                percent={96}
                status="active"
              />
            </div>
          )
        })}
        {uploadingVideo.blobUrl && (
          <video
            preload="auto"
            id="hide-video"
            src={uploadingVideo.blobUrl}
            crossOrigin="anonymous"
            style={{ display: 'none' }}
          />
        )}
        {videoFile.url && (
          <div className={styles.richContent} style={{ background: '#000' }}>
            <video
              id="video"
              src={videoFile.url}
              poster={videoFile.cover_uri}
            />
            <span className={styles.videoActionMask}>
              <Popover
                autoAdjustOverflow={false}
                placement="bottomRight"
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                title={null}
                content={
                  <div className={styles.videoAction}>
                    <div
                      onClick={() => {
                        setvideoCoverTooltip(true)
                      }}
                    >
                      编辑视频
                    </div>
                    <div onClick={onDeleteVideo}>删除视频</div>
                  </div>
                }
                trigger="click"
              >
                <MoreOutlined className={styles.videoActionIcon} />
              </Popover>
            </span>
            <span className={styles.duration}>
              {formatDuration(videoDuration)}
            </span>
          </div>
        )}
        {!R.isEmpty(linkData) && (
          <div className={styles.linkContent}>
            <img
              alt="empty"
              src={
                linkData.avatar ||
                'https://i9.taou.com/maimai/p/19616/485_103_31XJdOv7JibwCrD9'
              }
            />
            <p>{linkData.target_title}</p>
            <CloseOutlined
              size={12}
              onClick={() => {
                setlinkData({})
              }}
            />
          </div>
        )}
      </div>
      {fr === 'talent_bank' && !auth.isCompanyPayUser ? (
        <AddFansTips />
      ) : (
        <ExampleFeed />
      )}
    </Modal>
  )
}

export default connect((state, dispatch) => ({
  currentUser: state.global.currentUser,
  bprofileUser: state.global.bprofileUser,
  auth: state.global.auth,
  config: state.global.config,
  guideTag: state.company.guideTag,
  dispatch,
}))(PublishDynamicModal)
