/* eslint-disable */
import React, { useState, useEffect } from 'react'
import { message, Popover, Modal } from 'antd'
import {
  MoreOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Button, Text } from 'mm-ent-ui'
import { connect } from 'react-redux'
import * as R from 'ramda'
import styles from './index.less'
import UploadUi from 'componentsV3/Upload/reactUI/index'
import EditVideoForm from './EditVideoForm'
const { confirm } = Modal

function VideoWrap({ videoData, currentUser, dispatch }) {
  const [showFormModal, setShowFormModal] = useState(false)
  const [uploadData, setUploadData] = useState()
  const [file, setFile] = useState({})
  const [fileInfo, setFileInfo] = useState({})
  const [uploaderCore, setUploaderCore] = useState({})
  const cuid = R.pathOr(
    '',
    ['bprofileCompanyUser', 'company', 'cuid'],
    currentUser
  )
  const webcid = R.pathOr(
    '',
    ['bprofileCompanyUser', 'company', 'webcid'],
    currentUser
  )
  const hideFormModal = () => {
    // 取消上传
    uploaderCore.cancel()
    setShowFormModal(false)
  }
  const showFormModalHandle = () => {
    setShowFormModal(true)
  }
  const berforeHanlde = (file) => {
    if (file.size > 1024 * 1024 * 50) {
      message.warning('请上传少于50M的视频')
      uploaderCore.cancel()
    } else {
      setFile(file)
      setShowFormModal(true)
    }
  }
  const progressHandle = (data) => {
    setUploadData(data)
  }
  // 上传✅
  const successedHandle = (data) => {
    setUploadData({ uploadSuccess: 1, ...data })
    setFileInfo(data)
  }

  // add video
  const saveVideoData = (data) => {
    if (data.id) {
      dispatch({
        type: 'companyAlbum/editeVideo',
        payload: {
          webcid,
          title: data.title,
          cover_uri: data.cover_uri,
          video_id: data.id,
          status: 0,
        },
      }).then((res) => {
        const { result = {} } = res || {}
        const { msg } = result
        if (msg) {
          message.error(msg)
        } else {
          message.success('编辑视频成功')
          hideFormModal()
          setTimeout(() => {
            fetchVideoData()
          }, 100)
        }
      })
    } else {
      dispatch({
        type: 'companyAlbum/addVideo',
        payload: {
          ...data,
          file_id: fileInfo.file_id,
          video_uri: fileInfo.url,
          webcid,
        },
      }).then((res) => {
        const { result = {} } = res || {}
        const { msg } = result
        if (msg) {
          message.error(msg)
        } else {
          message.success('添加视频成功, 视频转码中，稍后可播放')
          hideFormModal()
          setTimeout(() => {
            fetchVideoData()
          }, 100)
        }
      })
    }
  }

  // remove video
  const removeVideo = (id) => {
    confirm({
      title: `确认要删除当前视频内容吗？`,
      icon: <ExclamationCircleOutlined />,
      content: `在「企业号-相册」中的视频也将删除。`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'companyAlbum/removeVideo',
          payload: {
            video_id: id,
            webcid,
            status: 1,
          },
        }).then((res) => {
          fetchVideoData()
        })
      },
      onCancel() {},
    })
  }

  // edit video
  const editVideo = ({ cover_uri, title, id }) => {
    // 不显示上传进度条
    setUploadData(null)
    // 设置名称
    setFile({ name: title, coverImage: cover_uri, id })
    setShowFormModal(true)
  }

  // get video list
  const fetchVideoData = () => {
    dispatch({ type: 'companyAlbum/fetchVideoList', payload: { webcid } })
  }

  const beforeUploadHander = (e) => {
    if (videoData.length > 9) {
      message.warning('添加视频的数目已超出限制')
      e.stopPropagation()
      e.preventDefault()
    }
  }
  const onUplaodRef = (core) => {
    setUploaderCore(core)
  }

  const reloadVideo = (id) => {
    setTimeout(() => {
      document.getElementById(String(id)).load()
    }, 2000)
  }

  useEffect(() => {
    if (!webcid) return
    fetchVideoData()
  }, [])

  return (
    <div className={styles.videoWrap}>
      <div className={styles.title}>
        <Text type="title" size={18} className="ellipsis">
          企业视频
        </Text>
        <Button
          type="button_s_fixed_blue150"
          onClick={beforeUploadHander}
          style={{
            position: 'relative',
          }}
        >
          <PlusOutlined />
          <UploadUi
            onBerforeUpload={berforeHanlde}
            onProgress={progressHandle}
            onSuccessed={successedHandle}
            webcid={webcid}
            cuid={cuid}
            maxSize={50}
            maxDuration={30}
            onRef={onUplaodRef}
          />
          添加视频
        </Button>
        {showFormModal ? (
          <Modal
            visible={true}
            maskClosable={false}
            onCancel={hideFormModal}
            title={uploadData ? '创建视频' : '编辑视频'}
            footer={null}
          >
            <EditVideoForm
              formParams={{ webuid: cuid }}
              file={file}
              processData={uploadData}
              onOk={saveVideoData}
              needName={true}
            />
          </Modal>
        ) : null}
      </div>
      <div className={styles.videoList}>
        {videoData.map(({ video_uri, cover_uri, title, id }) => (
          <div className={styles.videoItem} key={id}>
            <div className={styles.video}>
              <video
                id={id}
                src={video_uri}
                poster={cover_uri}
                controls
                crossOrigin="anonymous"
                onError={() => reloadVideo(id)}
              />
              <div className={styles.videoActionMask}>
                <Popover
                  placement="bottomRight"
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                  title={null}
                  content={
                    <div className={styles.videoAction}>
                      <div
                        onClick={() => {
                          editVideo({ video_uri, cover_uri, title, id })
                        }}
                      >
                        编辑视频
                      </div>
                      <div
                        onClick={() => {
                          removeVideo(id)
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
            <span className={styles.text}>{title}</span>
          </div>
        ))}
        {videoData.length === 0 ? (
          <div className={styles.empty}>无视频</div>
        ) : null}
      </div>
    </div>
  )
}

export default connect((state, dispatch) => ({
  currentUser: state.global.currentUser,
  videoData: state.companyAlbum.videoData,
  dispatch,
}))(VideoWrap)
