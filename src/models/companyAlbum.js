/**
 * @file 企业相册
 */

import * as companyAlbum from 'services/companyAlbum'

export default {
  namespace: 'companyAlbum',

  state: {
    albumList: [],
    albumPhoto: [],
    videoData: [],
  },

  effects: {
    *fetchAlbumList({ payload }, { call, put }) {
      const { data } = yield call(companyAlbum.fetchAlbumList, payload)
      yield put({
        type: 'companyAlbum/setData',
        payload: {
          albumList: data.result.data,
        },
      })
      return data
    },
    *fetchAlbumPhoto({ payload }, { call, put }) {
      const { data } = yield call(companyAlbum.fetchAlbumPhoto, payload)
      yield put({
        type: 'companyAlbum/setData',
        payload: {
          albumPhoto: data.result.data.photo_list,
        },
      })
      return data
    },
    *addAlbum({ payload }, { call }) {
      const { data } = yield call(companyAlbum.addAlbum, payload)
      return data
    },
    *editAlbum({ payload }, { call }) {
      const params = { ...payload, title: payload.album_name }
      const { data } = yield call(companyAlbum.editAlbum, params)
      return data
    },
    *addVideo({ payload }, { call }) {
      const { data } = yield call(companyAlbum.addVideo, payload)
      return data
    },
    *removeVideo({ payload }, { call }) {
      const { data } = yield call(companyAlbum.editeVideo, payload)
      return data
    },
    *editeVideo({ payload }, { call }) {
      const { data } = yield call(companyAlbum.editeVideo, payload)
      return data
    },
    *addPhoto({ payload }, { call }) {
      const { data } = yield call(companyAlbum.addPhoto, payload)
      return data
    },
    *deletePhoto({ payload }, { call }) {
      const { data } = yield call(companyAlbum.deletePhoto, payload)
      return data
    },
    *fetchVideoList({ payload }, { call, put }) {
      const { data } = yield call(companyAlbum.fetchVideoList, payload)
      yield put({
        type: 'companyAlbum/setData',
        payload: {
          videoData: data.result.data.video_list,
        },
      })
      return data
    },
  },
  reducers: {
    setData(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
