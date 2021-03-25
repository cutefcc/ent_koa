import * as positions from 'services/positions'
import { dispatchGlobalMask } from 'utils'

export default {
  namespace: 'positions',
  state: {
    // 单条的发票详情 用于修改 和 详情页面
    invoice: {},
    list: {},
    // 发布职位相关数据
    majorList: [],
    majorLv2List: [],
    constData: {},
    // 职位状态数据
  },
  reducers: {
    setData(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: {
    *fetch({ payload }, { call }) {
      const data = yield call(positions.fetch, payload)
      return data.data
    },
    *updateState({ payload }, { call }) {
      const data = yield call(positions.updateState, payload)
      return data.data
    },
    *add({ payload }, { call }) {
      const data = yield call(positions.add, payload)
      return data.data
    },
    *open({ payload }, { call }) {
      const data = yield call(positions.open, payload)
      return data.data
    },
    *close({ payload }, { call }) {
      const data = yield call(positions.close, payload)
      return data.data
    },
    *fetchDetailForEdit({ payload }, { call }) {
      const data = yield call(positions.fetchDetailForEdit, payload)
      return data.data
    },
    *fetchDetail({ payload }, { call }) {
      const data = yield call(positions.fetchDetail, payload)
      return data.data
    },
    *agreeConnect({ payload }, { call }) {
      const data = yield call(positions.agree, payload)
      return data.data
    },
    *disAgreeConnect({ payload }, { call }) {
      const data = yield call(positions.disAgree, payload)
      return data.data
    },
    *fetchExposureStatus({ payload }, { call }) {
      const data = yield call(positions.fetchExposureStatus, payload)
      return data.data
    },
    *addExposure({ payload }, { call }) {
      const data = yield call(positions.addExposure, payload)
      return data.data
    },
    *fetchRealRecommend({ payload }, { call, put }) {
      const data = yield call(positions.fetchRealRecommend, payload)
      data.data.data.list = yield dispatchGlobalMask(data.data.data.list, put)
      return data.data
    },
    *fetchVisitor({ payload }, { call, put }) {
      const data = yield call(positions.fetchVisitor, payload)
      data.data.data.list = yield dispatchGlobalMask(data.data.data.list, put)
      return data.data
    },
    *fetchCanChat({ payload }, { call, put }) {
      const data = yield call(positions.fetchCanChat, payload)
      data.data.data.list = yield dispatchGlobalMask(data.data.data.list, put)
      return data.data
    },
    *fetchFormInfo({ payload }, { call }) {
      const fn = payload.ejid
        ? positions.fetchUpdateInfo
        : positions.fetchFormInfo
      const data = yield call(fn, payload)
      return data.data
    },
    *prePublish({ payload }, { call }) {
      const data = yield call(positions.prePublish, payload)
      return data.data
    },
    *preUpdate({ payload }, { call }) {
      const data = yield call(positions.preUpdate, payload)
      return data.data
    },
    *fetchSug({ payload }, { call }) {
      const data = yield call(positions.fetchSug, payload)
      return data.data
    },
    *fetchIsHunterJob({ payload }, { call }) {
      const data = yield call(positions.fetchIsHunterJob, payload)
      return data.data
    },
    *hunterApply({ payload }, { call }) {
      const data = yield call(positions.hunterApply, payload)
      return data.data
    },
    *censorJob({ payload }, { call }) {
      const data = yield call(positions.censorJob, payload)
      return data.data
    },
    *addJob({ payload }, { call }) {
      const data = yield call(positions.addJob, payload)
      return data.data
    },
    *updateJob({ payload }, { call }) {
      const data = yield call(positions.updateJob, payload)
      return data.data
    },
    *updateJobAuthStatus({ payload }, { call }) {
      const data = yield call(positions.updateJobAuthStatus, payload)
      return data.data
    },
    *getPayBanners({ payload }, { call }) {
      const data = yield call(positions.getPayBanners, payload)
      return data.data
    },
    *fetchProfession({ payload }, { call }) {
      const data = yield call(positions.fetchProfession, payload)
      return data.data
    },
    *fetchMajor({ payload }, { call, put }) {
      const data = yield call(positions.fetchMajor, payload)
      const formatMajor = (items = []) => {
        return items.map((v) => ({
          value: v.code,
          label: v.name,
        }))
      }
      yield put({
        type: 'positions/setData',
        payload: {
          majorList:
            data.data && data.data.major && formatMajor(data.data.major[0]),
          // majorLv2List: [],
        },
      })
      return data.data
    },
    *fetchMajorNewLv2({ payload }, { call, put }) {
      const data = yield call(positions.fetchMajorNewLv2, payload)
      const formatMajor = (items = []) => {
        return items.map((v) => ({
          value: v.code,
          label: v.name,
        }))
      }
      yield put({
        type: 'positions/setData',
        payload: {
          majorLv2List:
            data.data && data.data.major && formatMajor(data.data.major[0]),
        },
      })
      return data.data
    },
    *fetchConstData({ payload }, { call, put }) {
      const data = yield call(positions.fetchConstData, payload)
      yield put({
        type: 'positions/setData',
        payload: {
          constData: data.data,
        },
      })
      return data.data
    },
    *meetLimit({ payload }, { call }) {
      let data
      try {
        data = yield call(positions.meetLimit, payload)
      } catch (e) {
        return {}
      }
      return data.data
    },
  },
}
