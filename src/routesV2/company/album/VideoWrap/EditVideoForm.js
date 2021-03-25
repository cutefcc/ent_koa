/* eslint-disable */
import { Upload, Form, Icon, Input, message, Popover, Tabs, Button } from 'antd'
import { PlusOutlined, ConsoleSqlOutlined } from '@ant-design/icons'
import React, { useState, createRef, useRef, useEffect } from 'react'
import styles from './index.less'
import * as R from 'ramda'
import { dataURItoBlob, replaceCompanySpecialCharacter } from 'utils'
import UploadProgress from 'componentsV3/Upload/reactUI/UploadProgress'
import request from 'utils/request'

const { TabPane } = Tabs

const EditVideoForm = (props) => {
  const { formParams, processData, file = {}, onCancel, onOk, needName } = props
  const { webuid } = formParams || {}
  const [coverImage, setcoverImage] = useState(file.coverImage)
  const [coverImageId, setcoverImageId] = useState(file.coverImageId)
  const [videoName, setvideoName] = useState(
    file.name ? file.name.slice(0, 20) : ''
  )
  const videoEl = useRef()

  const onseeked = function (e) {
    const video = videoEl.current
    var canvas = document.createElement('canvas')
    canvas.height = video.videoHeight
    canvas.width = video.videoWidth
    var ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
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
    }).then(({ data }) => {
      const { file_path: videoImage, id } = data || {}
      setcoverImage(videoImage)
      setcoverImageId(id)
    })
  }

  const onChangeText = (e) => {
    setvideoName(e.target.value)
  }

  const handleUploadChange = (data) => {
    const { response: { file_path, id } = {} } = data.file
    setcoverImage(file_path)
    setcoverImageId(id)
    file_path && message.success('封面上传成功')
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg'
    if (!isJpgOrPng) {
      message.error('只能上传jpg格式')
    }
    const isLt2M = file.size / 1024 / 1024 < 1
    if (!isLt2M) {
      message.error('图片大小不超过1M')
    }
    return isJpgOrPng && isLt2M
  }

  function callback(key) {
    console.log(key)
  }

  const onSubmit = () => {
    if (!R.trim(videoName) && needName) {
      message.error('视频名称不能为空')
      return
    }
    if (!coverImage) {
      message.error('封面不能为空')
      return
    }
    const { total, uploadSuccess = 0 } = processData || {}
    const { percent } = total || {}
    const done = uploadSuccess === 1 || percent === 100

    if (processData && !done) {
      message.warning('请耐心等待上传成功😃')
      return
    }
    onOk({
      cover_uri: coverImage,
      cover_id: coverImageId,
      title: videoName,
      id: file.id,
    })
  }

  const renderUploadImg = () => {
    return (
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="上传封面" key="1">
          <Upload
            accept=".png,.jpg,.jpeg"
            action="/upfile_for_company"
            listType="picture-card"
            showUploadList={false}
            name="fdata"
            data={() => ({
              kos: 1,
              ftype: 2,
              webuid: webuid,
            })}
            className={styles.videoUploader}
            onChange={handleUploadChange}
          >
            <div>
              <PlusOutlined />
              <div className="ant-upload-text">选择图片</div>
            </div>
          </Upload>
        </TabPane>
        {/* <TabPane tab="视频封面" key="2">
          <video
            ref={videoEl}
            onSeeked={onseeked}
            id="video_preview"
            src={URL.createObjectURL(file)}
            width="248px"
            height="140px"
            controls
          />
        </TabPane> */}
      </Tabs>
    )
  }

  const getFormStyle = () => {
    return processData
      ? {
          marginTop: '24px',
        }
      : null
  }

  return (
    <div className={styles.EditVideo}>
      {processData ? <UploadProgress data={processData} /> : null}
      <Form style={getFormStyle()} layout="vertical">
        {needName ? (
          <Form.Item
            label={
              <label>
                视频名称<span style={{ color: '#ff4d4f' }}>*</span>
              </label>
            }
          >
            <Input
              placeholder="请输入视频名称"
              onChange={onChangeText}
              maxLength={20}
              defaultValue={videoName}
              suffix={`${videoName.length}/20`}
            />
          </Form.Item>
        ) : null}
        <Form.Item
          label={
            <label>
              视频封面<span style={{ color: '#ff4d4f' }}>*</span>
            </label>
          }
        >
          <div className={styles.wrap}>
            <div className={styles.videoPicUploadWrap}>
              <Popover
                placement="rightBottom"
                content={renderUploadImg()}
                trigger="click"
              >
                <div className={styles.videoScreen}>
                  {coverImage ? (
                    <img
                      alt="empty"
                      src={coverImage}
                      style={{
                        width: '160px',
                        height: '90px',
                        borderRadius: '4px',
                      }}
                    />
                  ) : null}
                  <div className={styles.icon}>设置视频封面</div>
                </div>
              </Popover>
              <div className={styles.tip}>
                *封面图片格式为JPG，尺寸建议为16:9，大小不超过5M。上传后的视频不可修改视频内容，只能编辑视频名称或封面图。
              </div>
            </div>
          </div>
        </Form.Item>
      </Form>
      <Button type="primary" onClick={onSubmit}>
        确定
      </Button>
    </div>
  )
}

export default EditVideoForm
