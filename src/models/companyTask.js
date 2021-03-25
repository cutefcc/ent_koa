/**
 * @file 企业号任务中心
 */

import * as companyTask from 'services/companyTask'

export default {
  namespace: 'companyTask',

  state: {
    totalPoints: 0,
    taskData: {},
    goodsList: [],
    goodsRecord: [],
  },

  effects: {
    *fetchTaskData({ payload }, { call, put }) {
      const { data } = yield call(companyTask.fetchTaskData, payload)
      yield put({
        type: 'companyTask/setData',
        payload: {
          taskData: data,
          totalPoints: data.cur_points,
        },
      })
      return data
    },
    *fetchMallData({ payload }, { call, put }) {
      const { data } = yield call(companyTask.fetchMallData, payload)
      yield put({
        type: 'companyTask/setData',
        payload: {
          goodsList: data.points_goods,
        },
      })
      return data
    },
    *pointsExchange({ payload }, { call, put }) {
      const { data } = yield call(companyTask.pointsExchange, payload)
      if (data.result === 'ok') {
        yield put({
          type: 'companyTask/setData',
          payload: {
            totalPoints: data.cur_points,
          },
        })
      }
      return data
    },
    *getGoodsRecord({ payload }, { call, put }) {
      const { data } = yield call(companyTask.getGoodsRecord, payload)
      yield put({
        type: 'companyTask/setData',
        payload: {
          goodsRecord: data.exchange_info,
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
