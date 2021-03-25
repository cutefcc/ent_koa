/**
 * @file 企业号基本信息管理
 */

import * as companyBaseInfo from 'services/companyBaseInfo'

export default {
  namespace: 'companyBaseInfo',

  state: {
    baseInfo: {},
    companyProgress: [],
    videoList: [],
    cityInfo: [],
    professionInfo: [],
  },

  effects: {
    *getBaseInfo({ payload }, { call, put }) {
      const { data } = yield call(companyBaseInfo.getBaseInfo, payload)
      yield put({
        type: 'companyBaseInfo/setData',
        payload: {
          baseInfo: data,
        },
      })
    },
    *getCompanyProgress({ payload }, { call, put }) {
      const { data } = yield call(companyBaseInfo.getCompanyProgress, payload)
      yield put({
        type: 'companyBaseInfo/setData',
        payload: {
          companyProgress: data.data,
        },
      })
    },
    *getVideoList({ payload }, { call, put }) {
      const { data } = yield call(companyBaseInfo.getVideoList, payload)
      yield put({
        type: 'companyBaseInfo/setData',
        payload: {
          videoList: data.data,
        },
      })
    },
    *getCity({ payload }, { call, put }) {
      const {
        data: { res },
      } = yield call(companyBaseInfo.getCity, payload)

      yield put({
        type: 'companyBaseInfo/setData',
        payload: {
          cityInfo: res,
        },
      })
    },
    *getProfession({ payload }, { call, put }) {
      const {
        data: { res },
      } = yield call(companyBaseInfo.getProfession, payload)
      yield put({
        type: 'companyBaseInfo/setData',
        payload: {
          professionInfo: res,
        },
      })
    },
    *editProgress({ payload }, { call }) {
      const { data } = yield call(companyBaseInfo.editProgress, payload)
      return data
    },
    *setIntroduce({ payload }, { call }) {
      const { data } = yield call(companyBaseInfo.setIntroduce, payload)
      return data
    },
    *setBaseInfo({ payload }, { call, put }) {
      const { webcid, ...baseInfo } = payload

      const { data } = yield call(companyBaseInfo.setBaseHeadInfo, {
        webcid,
        homepage: payload.url,
        profession: payload.domain,
        location: payload.city,
        clogo: payload.clogo,
        stage: payload.stage,
        people: payload.people,
      })
      yield put({
        type: 'companyBaseInfo/setData',
        payload: {
          baseInfo,
        },
      })
      return data
    },
    *setVideoList({ payload }, { call, put }) {
      const { data } = yield call(companyBaseInfo.setVideoList, payload)
      if (!data.result.code) {
        yield put({
          type: 'companyBaseInfo/setData',
          payload: {
            videoList: data.result,
          },
        })
      }
      return data
    },
    *delProgress({ payload }, { call }) {
      const { data } = yield call(companyBaseInfo.delProgress, payload)
      return data
    },
  },
  reducers: {
    editCompanyProgress(state, { payload }) {
      const { index } = payload
      const companyProgress = [...state.companyProgress]
      const editProgress = companyProgress[index]
      editProgress.editStatus = true

      return {
        ...state,
        ...{ companyProgress },
      }
    },
    setData(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
