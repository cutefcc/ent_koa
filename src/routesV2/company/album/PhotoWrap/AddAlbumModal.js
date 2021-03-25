import React, { useState } from 'react'
import * as R from 'ramda'
import { Modal, Upload, Form, Input, message } from 'antd'
import styles from './index.less'

const AddAlbumModal = (props) => {
  const { formParams, editAlbum = {}, onCancel, onOk } = props
  const [formImage, setFormImage] = useState(editAlbum.cover_uri)
  const [albumName, setalbumName] = useState(editAlbum.collection_name || '')

  const mode = editAlbum.id ? 'edit' : 'add'

  const onChangeText = (e) => {
    setalbumName(e.target.value)
  }
  const handleUploadChange = ({ file }) => {
    const { response: { file_path } = {} } = file
    setFormImage(file_path)
    if (file.status === 'error') {
      message.error('文件太大')
    }
  }

  function beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 5
    if (!isLt2M) {
      message.error('图片大小不超过5M')
    }
    return isLt2M
  }

  return (
    <Modal
      visible={true}
      maskClosable={false}
      onCancel={onCancel}
      onOk={() => {
        if (!R.trim(albumName) || !formImage) {
          message.warn('相册名称和封面不能为空')
          return
        }
        onOk({
          album_name: albumName,
          cover_uri: formImage,
          album_id: editAlbum.id,
        })
      }}
      title={mode === 'add' ? '创建相册' : '编辑相册'}
    >
      <div>
        <Form layout="vertical">
          <Form.Item
            initialValue={albumName}
            label={
              <label>
                相册名称<span style={{ color: '#ff4d4f' }}>*</span>
              </label>
            }
          >
            <Input
              defaultValue={albumName}
              placeholder="请输入相册名称"
              onChange={onChangeText}
              maxLength={20}
              suffix={`${albumName.length}/20`}
            />
          </Form.Item>

          <Form.Item
            label={
              <label>
                相册封面<span style={{ color: '#ff4d4f' }}>*</span>
              </label>
            }
          >
            <div className={styles.coverWrap}>
              <div style={{ display: 'flex' }}>
                <Upload
                  className={styles.videoUploader}
                  accept=".png,.jpg,.jpeg"
                  action="/upfile_for_company"
                  showUploadList={false}
                  onChange={handleUploadChange}
                  beforeUpload={beforeUpload}
                  name="fdata"
                  data={() => ({
                    kos: 1,
                    ftype: 2,
                    ...formParams,
                  })}
                >
                  <div className={styles.coverUpload}>
                    {formImage ? <img src={formImage} alt="empty" /> : null}
                    <p>设置图片封面</p>
                  </div>
                </Upload>
                <div className={styles.imgDes}>
                  *最多创建5个相册，每个相册最多20张相片。图片格式为JPG，尺寸不限，大小不超过5M。
                </div>
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  )
}

export default AddAlbumModal
