import request from 'utils/request'
import { getCookie } from 'tiny-cookie'

// 获取相册分组的接口
export function fetchAlbumList(payload) {
  return request('/company/getPhotoClassList', {
    query: {
      ...payload,
      u: getCookie('u'),
    },
  })
}

// 获取相册分组内图片列表的接口
export function fetchAlbumPhoto(payload) {
  return request('/company/getPhotoListByClass', {
    query: {
      ...payload,
    },
  })
}

// add album
export function addAlbum(payload) {
  return request('/company/createPhotoClass', {
    query: {
      ...payload,
    },
  })
}

// edit album
// status: 0编辑，1删除
export function editAlbum(payload) {
  return request('/company/editPhotoClass', {
    query: {
      ...payload,
    },
  })
}

export function addVideo(payload) {
  return request('/company/addVideoClassList', {
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
    method: 'POST',
    body: payload,
  })
}

// add photo to album
export function addPhoto(payload) {
  return request('/company/addPhotoClassList', {
    method: 'POST',
    query: {
      webcid: payload.webcid,
      id: payload.id,
    },
    body: [payload.photo],
  })
}

// delete photo
export function deletePhoto(payload) {
  return request('/company/delPhotoClassList', {
    method: 'POST',
    query: {
      webcid: payload.webcid,
      id: payload.albumId,
    },
    body: [payload.photoId],
  })
}

// 获取视频列表
export function fetchVideoList(payload) {
  return request('/company/getVideoClassList', {
    query: {
      ...payload,
      u: getCookie('u'),
    },
  })
}

// 修改视频
export function editeVideo(payload) {
  return request('/company/editVideoClass', {
    query: {
      ...payload,
      u: getCookie('u'),
    },
  })
}
