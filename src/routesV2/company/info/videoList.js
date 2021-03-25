import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import * as qiniu from 'qiniu'
import { CloseOutlined, PlusOutlined, MoreOutlined } from '@ant-design/icons'
import { Upload, message, Progress, Popover, Modal } from 'antd'
import { dataURItoBlob } from 'utils'
import EditVideoForm from 'routesV2/company/album/VideoWrap/EditVideoForm'
import styles from './index.less'

/* eslint-disable */
function VideoList({ videoList, bprofileUser, dispatch }) {
  const [videoFile, setvideoFile] = useState({})
  const [showFormModal, setShowFormModal] = useState(false)
  const [editVideoData, seteditVideoData] = useState({})
  //   const [videoImage, setvideoImage] = useState()
  const [videoPercent, setvideoPercent] = useState(0)
  const webcid = R.pathOr('', ['company', 'webcid'], bprofileUser)

  const setVideoList = (list) => {
    dispatch({
      type: 'companyBaseInfo/setVideoList',
      payload: {
        videoList: list.map((v, i) => ({ ...v, index: i })),
        webcid,
      },
    }).then((data) => {
      if (data.result.msg) {
        message.error('上传失败')
      }
      message.success('操作成功')
      setShowFormModal(false)
      seteditVideoData({})
    })
  }

  const saveVideoCover = (data) => {
    const newVideoList = videoList.map((item) => {
      if (item.index === editVideoData.index) {
        return { ...item, img: data.cover_uri }
      }
      return item
    })
    setVideoList(newVideoList)
  }

  // key: key,    后端获取
  // token: token     后端获取
  // url: 上传成功之后的url地址。。
  const uploadVideo = (file, videoImage, { path, key, token }) => {
    const next = (response) => {
      const { total = {} } = response
      setvideoPercent(parseInt(total.percent))
      if (total.percent >= 100) {
        const newVideoList = [
          ...videoList,
          {
            img: videoImage,
            vid: `https://t9.taou.com/maimai/${path}`,
          },
        ]
        setVideoList(newVideoList)
      }
    }
    const observable = qiniu.upload(file, key, token, '', '')
    observable.subscribe(next)
  }

  const handleVideoError = function (e) {
    setvideoFile({})
    switch (this.error.code) {
      case 1: // MediaError.MEDIA_ERROR_ABORTED
        message.error('视频的下载过程被中止。')
        break
      case 2: // MediaError.MEDIA_ERROR_NETWORK
        message.error('网络发生故障，视频的下载过程被中止。')
        break
      case 3: // MediaError.MEDIA_ERROR_DECODE
        message.error('解码失败。')
        break
      case 4: // MediaError.MEDIA_ERROR_SRC_NOT_SUPPORTED
        message.error('不支持播放的视频格式。')
        break
      default:
        message.error('发生未知错误。')
    }
  }

  const handleLoadVideo = async function () {
    // 限制视频50M
    if (videoFile.size > 50 * 1024 * 1024) {
      message.warn('上传视频太大')
      return
    }

    // 截视频第一帧作为封面图上传
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = this.videoWidth || 1125
    canvas.height = this.videoHeight || 630
    ctx.drawImage(this, 0, 0, this.videoWidth, this.videoHeight)
    const base64Data = canvas.toDataURL('image/jpeg')
    // 封装blob对象
    const blob = dataURItoBlob(base64Data)
    // 组装formdata
    const fd = new FormData()

    fd.append('fdata', blob)
    fd.append('kos', 1)
    fd.append('ftype', 2)
    fd.append('webuid', bprofileUser.company.webuid)
    const { file_path: videoImage } = await dispatch({
      type: 'company/uploadImg',
      payload: fd,
    })

    // 上传视频文件https://docs.taou.com/pages/viewpage.action?pageId=9241807
    dispatch({
      type: 'company/preUpload',
      payload: {
        fname: videoFile.name,
        fuid: bprofileUser.company.cuid,
        xsize: this.videoWidth,
        ysize: this.videoHeight,
        duration: parseInt(this.duration),
        bytesize: videoFile.size,
      },
    }).then(({ data }) => {
      setvideoFile({ ...videoFile, file_id: data.file_id })
      uploadVideo(videoFile.file, videoImage, data)
    })
  }

  useEffect(() => {
    const video = document.getElementById('hide-video')
    // video && video.duration > 0 && setvideoDuration(video.duration)
    video && video.addEventListener('loadeddata', handleLoadVideo)
    video && video.addEventListener('error', handleVideoError)
    return () => {
      video && video.removeEventListener('loadeddata', handleLoadVideo)
    }
  }, [videoFile])

  const handleUploadChange = ({ file }) => {
    const { response: { file_path } = {} } = file
    if (file_path) {
      const newVideoList = [...videoList, { img: file_path, vid: '' }]
      setVideoList(newVideoList)
    }
    if (file.status === 'error') {
      message.error('文件太大')
    }
  }

  // 编辑video封面
  const editVideo = ({ index, vid, img }) => {
    seteditVideoData({ coverImage: img, id: vid, index })
    setShowFormModal(true)
  }

  const deleteVideo = (index) => {
    let newVideoList = [...videoList]
    newVideoList.splice(index, 1)
    setVideoList(newVideoList)
  }

  const handleUploadVideoFile = (file) => {
    const fileurl = URL.createObjectURL(file)
    setvideoFile({ blobUrl: fileurl, name: file.name, size: file.size, file })
  }

  const reloadVideo = (id) => {
    setTimeout(() => {
      document.getElementById(String(id)) &&
        document.getElementById(String(id)).load()
    }, 2000)
  }

  const hideFormModal = () => {
    setShowFormModal(false)
  }

  return (
    <div className={styles.infoItem}>
      <p className={styles.infoLabel}>背景图/视频</p>
      <div className={styles.videoList}>
        {videoList.length
          ? videoList.map(({ index, vid, img }) => {
              return (
                <div key={index} className={styles.videoItem}>
                  {vid ? (
                    <div>
                      <video
                        id={vid}
                        src={vid}
                        poster={img}
                        style={{ width: 200, height: 112 }}
                        controls
                        onError={() => reloadVideo(vid)}
                      />
                      <div className={styles.videoActionMask}>
                        <Popover
                          placement="bottomRight"
                          autoAdjustOverflow={false}
                          getPopupContainer={(triggerNode) =>
                            triggerNode.parentElement
                          }
                          title={null}
                          content={
                            <div className={styles.videoAction}>
                              <div
                                onClick={() => {
                                  editVideo({ index, vid, img })
                                }}
                              >
                                编辑视频
                              </div>
                              <div
                                onClick={() => {
                                  deleteVideo(index)
                                }}
                              >
                                删除视频
                              </div>
                            </div>
                          }
                          trigger="click"
                        >
                          <MoreOutlined className={styles.videoActionIcon} />
                        </Popover>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <img
                        src={img}
                        alt="empty"
                        style={{ width: 200, height: 112 }}
                      />
                      <span className={styles.close}>
                        <CloseOutlined
                          onClick={() => {
                            deleteVideo(index)
                          }}
                        />
                      </span>
                    </div>
                  )}
                </div>
              )
            })
          : null}
        {videoFile.blobUrl && (
          <video
            preload="auto"
            id="hide-video"
            src={videoFile.blobUrl}
            crossOrigin="anonymous"
            style={{ display: 'none' }}
          />
        )}
        {videoPercent > 0 && videoPercent < 100 ? (
          <div className={styles.progressWrap}>
            <Progress
              width={68}
              type="circle"
              strokeColor="#fff"
              percent={videoPercent}
            />
          </div>
        ) : (
          <Upload
            accept=".png,.jpg,.jpeg,.mp4"
            action="/upfile_for_company"
            listType="picture-card"
            showUploadList={false}
            name="fdata"
            data={() => ({
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
            className={styles.videoUploader}
            onChange={handleUploadChange}
          >
            {videoList.length < 9 ? (
              <div>
                <PlusOutlined />
                <div className="ant-upload-text">选择图片/视频</div>
              </div>
            ) : null}
          </Upload>
        )}
        <span className={styles.videoInfoTips}>
          *最多上传9张背景图/视频，建议尺寸为1125*630px或16:9，格式支持JPG、PNG、MP4，图片小于5M、视频小于50M。
        </span>
      </div>
      {showFormModal ? (
        <Modal
          visible={true}
          maskClosable={false}
          onCancel={hideFormModal}
          title={'编辑视频'}
          footer={null}
        >
          <EditVideoForm
            formParams={{ webuid: bprofileUser.company.webuid }}
            file={editVideoData}
            processData={null}
            onOk={saveVideoCover}
          />
        </Modal>
      ) : null}
    </div>
  )
}

export default connect((state, dispatch) => ({
  bprofileUser: state.global.bprofileUser,
  config: state.global.config,
  baseInfo: state.companyBaseInfo.baseInfo,
  videoList: state.companyBaseInfo.videoList,
  dispatch,
}))(VideoList)
