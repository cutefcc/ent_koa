import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Icon, Avatar } from 'mm-ent-ui'
import { Icon as LegacyIcon } from '@ant-design/compatible'
import { Modal, Input, Upload, message } from 'antd'
import * as R from 'ramda'
import styles from './ProveFakeModal.less'

const { TextArea } = Input

function ProveFakeModal({
  users,
  status,
  bprofileUser,
  onOk,
  onCancel,
  dispatch,
}) {
  const [file, setfile] = useState({})
  const [proveText, setproveText] = useState()
  const [loading, setloading] = useState(false)
  const webcid = R.pathOr('', ['company', 'webcid'], bprofileUser)
  const [reason, placeholder] = {
    1: ['在职', '请详细描述情况并上传证明材料'],
    2: ['已离职', '请详细描述情况并上传证明材料，如：离职证明'],
    3: ['身份作假', '请详细描述情况并上传证明材料，如：单位证明'],
  }[status]

  const onSubmit = () => {
    if (!proveText || !file.response || !file.response.id) {
      message.info('要求同时提交文字+图片')
      return
    }
    setloading(true)
    dispatch({
      type: 'companyIdentify/authAdd',
      payload: {
        webcid,
        op: {
          type: status,
          reason: `[${reason}]${proveText}`,
          file_id: file.response.id,
          uids: users.map((user) => user.uid),
        },
      },
    }).then(() => {
      message.success('已提交审核')
      onOk()
      setloading(false)
    })
  }

  const handleUploadChange = (data) => {
    setfile(data.file)
    if (data.file.status === 'error') {
      message.error('文件太大')
      setfile({})
    }
  }

  return (
    <Modal
      className={styles.modalWrap}
      visible={true}
      title="请提交证明材料"
      onOk={onSubmit}
      onCancel={onCancel}
      confirmLoading={loading}
    >
      <div className={styles.infos}>
        <span>{status === '1' ? '被认证人：' : '被举报人：'}</span>
        <div>
          {users.map((user) => (
            <div key={user.uid}>
              <Avatar size={20} src={user.avatar} />
              <span>
                {user.name}·{user.company}
                {user.position}
              </span>
              {user.judge === 1 && (
                <Icon
                  type="v"
                  className="color-orange2 margin-left-4 font-size-16"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.infos}>
        <span>操作理由：</span>
        <span>{reason}</span>
      </div>
      <TextArea
        rows={3}
        value={proveText}
        placeholder={placeholder}
        onChange={(e) => setproveText(e.target.value)}
      />
      <Upload
        accept=".png,.jpg,.jpeg"
        action="/upfile_for_company"
        listType="picture-card"
        showUploadList={false}
        data={(data) => ({
          fdata: data,
          kos: 1,
          ftype: 2,
          webuid: bprofileUser.company.webuid,
        })}
        className={styles.uploader}
        onChange={handleUploadChange}
      >
        {file.response && file.response.file_path ? (
          <img
            src={file.response.file_path}
            alt="empty"
            style={{ maxWidth: '100%', maxHeight: 112 }}
          />
        ) : (
          <div>
            <LegacyIcon
              type={file.status === 'uploading' ? 'loading' : 'plus'}
            />
            <div className="ant-upload-text">上传图片</div>
          </div>
        )}
      </Upload>
      <p className={styles.tips}>
        <span style={{ color: '#FF4D3C' }}>*</span>
        图片格式为JPG/PNG，尺寸不限，大小不超过5M。
      </p>
    </Modal>
  )
}

export default connect((state, dispatch) => ({
  tab: state.companyIdentify.tab,
  bprofileUser: state.global.bprofileUser,
  config: state.global.config,
  dispatch,
}))(ProveFakeModal)
