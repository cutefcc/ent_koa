import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Modal, Upload, Input, message } from 'antd'
import React, { useState } from 'react'
import styles from './index.less'
import * as R from 'ramda'

const { TextArea } = Input
const IntroForm = (props) => {
  const { formParams, onCancel, introContent, introImg, onOk } = props
  const [formImage, setFormImage] = useState(introImg)
  const [formContent, setFormContent] = useState(introContent)

  const onChangeText = (e) => {
    setFormContent(e.target.value)
  }
  const handleUploadChange = (data) => {
    const { response: { file_path } = {} } = data.file
    setFormImage(file_path)
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

  return (
    <Modal
      visible={true}
      onCancel={onCancel}
      onOk={() => {
        if (!R.trim(formContent)) {
          message.error('公司简介不能为空')
          return
        }
        if (R.trim(formContent).length < 10) {
          message.error('公司简介不能少于10个字')
          return
        }
        onOk({ content: formContent, img: formImage })
      }}
      title="公司介绍设置"
    >
      <div>
        <Form formLayout="vertical">
          <Form.Item label="公司简介">
            <TextArea
              placeholder={'请输入公司简介，10～1000字'}
              onChange={onChangeText}
              defaultValue={introContent}
              maxlength={1000}
              rows={5}
            />
          </Form.Item>
          <Form.Item label="简介配图">
            <div className={styles.wrap}>
              {formImage ? (
                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      position: 'relative',
                    }}
                  >
                    <img
                      src={formImage}
                      alt="empty"
                      style={{ width: '200px', height: '100px' }}
                    />{' '}
                    <span className={styles.close}>
                      <CloseOutlined
                        onClick={() => {
                          setFormImage(null)
                        }}
                      />
                    </span>
                  </div>
                  <div className={styles.imgDes}>
                    *图片格式为JPG，尺寸为750*420px或1:1，大小不超过1M。
                  </div>
                </div>
              ) : (
                <Upload
                  className={styles.videoUploader}
                  accept=".png,.jpg,.jpeg"
                  action="/upfile_for_company"
                  listType="picture-card"
                  showUploadList={false}
                  onChange={handleUploadChange}
                  beforeUpload={beforeUpload}
                  data={(data) => ({
                    fdata: data,
                    kos: 1,
                    ftype: 2,
                    ...formParams,
                  })}
                >
                  {' '}
                  <div>
                    <PlusOutlined />
                    <div className="ant-upload-text">选择图片</div>
                  </div>
                </Upload>
              )}
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default IntroForm
