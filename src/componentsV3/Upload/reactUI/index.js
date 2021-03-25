/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Tooltip, message } from 'antd'
import request from 'utils/request'
import { dataURItoBlob } from 'utils'
import Uploader from '../uploader'
import styles from './style.less'

export default function UploadUi({
  onRef,
  onBerforeUpload,
  onProgress,
  onSuccessed,
  accept = 'video/mp4,audio/mp4',
  maxSize = 200, // 大小上限，M
  maxDuration = 30, // 时长上限，min
  cuid,
  webuid,
}) {
  const [uploader, setuploader] = useState(new Uploader())
  const [fileData, setfileData] = useState({})
  const [blobUrl, setblobUrl] = useState()

  useEffect(() => {
    onRef && onRef(uploader)
  })

  const handleVideoError = function(e) {
    setfileData({})
    // 限制视频时长5分钟
    if (this.duration > maxDuration * 60) {
      message.warn(`上传视频时长不得超过${maxDuration}分钟`)
      return
    }
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

  const handleLoadVideo = function() {
    // 限制视频时长
    if (this.duration > maxDuration * 60) {
      message.warn(`上传视频时长不得超过${maxDuration}分钟`)
      setfileData({})
      uploader.cancel()
      return
    }
    // 限制视频大小
    if (fileData.size > maxSize * 1024 * 1024) {
      message.warn(`上传视频不得超过${maxSize}M`)
      setfileData({})
      uploader.cancel()
      return
    }

    // 截视频第一帧作为封面图上传
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const videoWidth = this.videoWidth || 1125
    const videoHeight = this.videoHeight || 630
    canvas.width = videoWidth
    canvas.height = videoHeight
    ctx.drawImage(this, 0, 0, videoWidth, videoHeight)
    const base64Data = canvas.toDataURL('image/jpeg')
    // 封装blob对象
    const blob = dataURItoBlob(base64Data)

    // 组装formdata
    const fd = new FormData()

    fd.append('fdata', blob)
    fd.append('kos', 1)
    fd.append('ftype', 2)
    fd.append('webuid', webuid)
    request('/upfile_for_company', {
      method: 'POST',
      body: fd,
    }).then(res => {
      const { id, file_path } = res.data
      const newFileData = {
        name: fileData.name,
        coverImage: file_path,
        coverImageId: id,
        duration: parseInt(this.duration),
      }
      setfileData(newFileData)

      // 开始上传前
      onBerforeUpload && onBerforeUpload(newFileData)

      uploader.start(fileData, {
        cuid,
        xsize: videoWidth,
        ysize: videoHeight,
        duration: parseInt(this.duration),
      })

      uploader.on('onProgress', data => {
        // setfileData(data)
        onProgress && onProgress(data)
      })

      uploader.on('onSuccessed', data => {
        setfileData({ ...newFileData, ...data })
        onSuccessed && onSuccessed({ ...newFileData, ...data })
      })
    })
  }

  useEffect(() => {
    const video = document.getElementById('hide-video')
    video && video.addEventListener('loadeddata', handleLoadVideo)
    video && video.addEventListener('error', handleVideoError)
    return () => {
      video && video.removeEventListener('loadeddata', handleLoadVideo)
    }
  }, [blobUrl])

  const fileChange = e => {
    const files = e.target.files
    const file = files[0]
    setblobUrl(URL.createObjectURL(file))
    setfileData(file)
  }

  return (
    <Tooltip
      placement="top"
      title={`仅支持mp4格式，${maxSize}M以内，不超过${maxDuration}分钟`}
    >
      <div className={styles.fileButton}>
        <input
          type="file"
          accept={accept}
          capture="camcorder"
          onChange={fileChange}
          onClick={e => {
            e.target.value = ''
          }}
        />
        {blobUrl && (
          <video
            preload="auto"
            id="hide-video"
            src={blobUrl}
            crossOrigin="anonymous"
            style={{ display: 'none' }}
          />
        )}
      </div>
    </Tooltip>
  )
}
