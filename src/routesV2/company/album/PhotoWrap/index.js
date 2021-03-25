import React, { useState, useEffect } from 'react'
import { Upload, message, Popover, Modal } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { Button, Text } from 'mm-ent-ui'
import { connect } from 'react-redux'
import * as R from 'ramda'
import styles from './index.less'
import AddAlbumModal from './AddAlbumModal'

const { confirm } = Modal

function PhotoWrap({ albumList, albumPhoto, currentUser, dispatch }) {
  const [addAlbumModalVisible, setaddAlbumModalVisible] = useState()
  const [editAlbum, seteditAlbum] = useState({})

  const webuid = R.pathOr(
    '',
    ['bprofileCompanyUser', 'company', 'webuid'],
    currentUser
  )
  const webcid = R.pathOr(
    '',
    ['bprofileCompanyUser', 'company', 'webcid'],
    currentUser
  )

  const fetchAlbumData = () => {
    dispatch({ type: 'companyAlbum/fetchAlbumList', payload: { webcid } })
  }

  const fetchAlbumPhoto = () => {
    dispatch({
      type: 'companyAlbum/fetchAlbumPhoto',
      payload: {
        webcid,
      },
    })
  }

  const addAlbum = (values) => {
    const type = editAlbum.id
      ? 'companyAlbum/editAlbum'
      : 'companyAlbum/addAlbum'
    dispatch({
      type,
      payload: {
        webcid,
        status: 0,
        ...values,
      },
    }).then(() => {
      fetchAlbumData()
      setaddAlbumModalVisible(false)
      seteditAlbum({})
    })
  }

  const deleteAlbum = (id, photoLen) => {
    confirm({
      title: `确定要删除该相册吗？当前有${photoLen}张照片`,
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      cancelText: '取消',
      content: (
        <span>
          即将删除该相册中所有图片或视频。
          <br />
          在「企业号-相册」中的图片也将删除。
        </span>
      ),
      onOk() {
        const type = 'companyAlbum/editAlbum'
        dispatch({
          type,
          payload: {
            webcid,
            status: 1,
            album_id: id,
          },
        }).then(() => {
          fetchAlbumData()
        })
      },
      onCancel() {},
    })
  }

  const addPhoto = (file, id) => {
    dispatch({
      type: 'companyAlbum/addPhoto',
      payload: {
        webcid,
        id,
        photo: {
          file_id: file.id,
          file_uri: file.file_path,
        },
      },
    }).then((res) => {
      if (res.code === 0) {
        fetchAlbumPhoto()
      }
    })
  }

  const deletePhoto = (albumId, photoId) => {
    confirm({
      title: `确认要删除当前图片内容吗？`,
      icon: <ExclamationCircleOutlined />,
      content: `在「企业号-相册」中的图片也将删除。`,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        const type = 'companyAlbum/deletePhoto'
        dispatch({
          type,
          payload: {
            webcid,
            albumId,
            photoId,
          },
        }).then(() => {
          fetchAlbumPhoto()
        })
      },
      onCancel() {},
    })
  }

  const handleUploadChange = ({ file }, albumId) => {
    const { response: { file_path, id } = {} } = file
    if (file_path) {
      addPhoto({ file_path, id }, albumId)
    }
    if (file.status === 'error') {
      message.error('文件太大')
    }
  }

  const goAddAlbum = () => {
    if (albumList.length >= 5) {
      message.warn('创建相册的数目已超出限制')
      return
    }
    setaddAlbumModalVisible(true)
  }

  const goEditAlbum = (album) => {
    seteditAlbum(album)
    setaddAlbumModalVisible(true)
  }

  // const setCoverUri = () => {}

  useEffect(() => {
    if (!webcid) return
    fetchAlbumData()
    fetchAlbumPhoto()
  }, [])

  return (
    <div className={styles.photoWrap}>
      <div className={styles.title}>
        <Text type="title" size={18} className="ellipsis">
          照片
        </Text>
        <Button type="button_s_fixed_blue150" onClick={goAddAlbum}>
          <PlusOutlined />
          创建相册
        </Button>
      </div>
      <div className={styles.albumWrap}>
        {albumList.map((album) => {
          const photoList = albumPhoto.filter((p) => p.album_id === album.id)
          return (
            <div className={styles.album} key={album.id}>
              <h3>
                {album.collection_name}
                <Popover
                  placement="right"
                  getPopupContainer={(triggerNode) => triggerNode.parentElement}
                  title={null}
                  content={
                    <div className={styles.photoAction}>
                      <div onClick={() => goEditAlbum(album)}>编辑</div>
                      <div
                        onClick={() =>
                          deleteAlbum(album.id, photoList.length + 1)
                        }
                      >
                        删除相册
                      </div>
                    </div>
                  }
                  trigger="click"
                >
                  <EditOutlined className={styles.editAlbumIcon} />
                </Popover>
              </h3>
              <div className={styles.photos}>
                <div className={styles.photoItem}>
                  <img src={album.cover_uri} alt="empty" />
                  <span className={styles.coverTag}>封面</span>
                  <div className={styles.photoActionMask}>
                    <Popover
                      placement="bottomRight"
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentElement
                      }
                      title={null}
                      content={
                        <div className={styles.photoAction}>
                          <div onClick={() => goEditAlbum(album)}>编辑封面</div>
                        </div>
                      }
                      trigger="click"
                    >
                      <MoreOutlined className={styles.photoActionIcon} />
                    </Popover>
                  </div>
                </div>
                {photoList.map((photo) => (
                  <div className={styles.photoItem} key={photo.id}>
                    <img src={photo.file_uri} alt="empty" />
                    <div className={styles.photoActionMask}>
                      <Popover
                        placement="bottomRight"
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentElement
                        }
                        title={null}
                        content={
                          <div className={styles.photoAction}>
                            {/* <p onClick={() => setCoverUri}>设为封面</p> */}
                            <div
                              onClick={() => deletePhoto(album.id, photo.id)}
                            >
                              删除图片
                            </div>
                          </div>
                        }
                        trigger="click"
                      >
                        <MoreOutlined className={styles.photoActionIcon} />
                      </Popover>
                    </div>
                  </div>
                ))}
                <Upload
                  accept=".png,.jpg,.jpeg"
                  action="/upfile_for_company"
                  listType="picture-card"
                  multiple={true}
                  showUploadList={false}
                  name="fdata"
                  data={() => ({
                    kos: 1,
                    ftype: 2,
                    webuid,
                  })}
                  className={styles.photoUploader}
                  onChange={(e) => handleUploadChange(e, album.id)}
                >
                  {photoList.length < 19 ? (
                    <div>
                      <PlusOutlined />
                      <div className="ant-upload-text">上传图片</div>
                    </div>
                  ) : null}
                </Upload>
              </div>
            </div>
          )
        })}
        {albumList.length === 0 ? (
          <div className={styles.empty}>无相册</div>
        ) : null}
      </div>
      {addAlbumModalVisible ? (
        <AddAlbumModal
          formParams={{
            webuid,
          }}
          editAlbum={editAlbum}
          onCancel={() => {
            setaddAlbumModalVisible(false)
            seteditAlbum({})
          }}
          onOk={(values) => addAlbum(values)}
        />
      ) : null}
    </div>
  )
}

export default connect((state, dispatch) => ({
  currentUser: state.global.currentUser,
  albumList: state.companyAlbum.albumList,
  albumPhoto: state.companyAlbum.albumPhoto,
  dispatch,
}))(PhotoWrap)
