/**
 * @file 企业号相关数据
 */

import * as companyIdentify from 'services/companyIdentify'

export default {
  namespace: 'companyIdentify',

  state: {
    invitations: [],
    employerList: [],
    operatePagination: { pageSize: 20, current: 1 },
    recordList: [],
    recordPagination: { pageSize: 20, current: 1 },
    // 职位展台
    // normal_data是常规职位列表；
    // stick_data是有"急招"标签且置顶的 职位列表；
    companyJobList: { normal_data: [], stick_data: [] },
    jobListPagination: { pageSize: 20, current: 0 },
  },

  effects: {
    *fetchEmployerList({ payload }, { call, put }) {
      const { data } = yield call(companyIdentify.fetchEmployerList, payload)
      yield put({
        type: 'companyIdentify/setData',
        payload: {
          employerList: data.list,
          operatePagination: {
            pageSize: 20,
            total: data.total,
            current: payload.page + 1,
          },
        },
      })
      return data
    },
    *fetchRecordList({ payload }, { call, put }) {
      const { data } = yield call(companyIdentify.fetchRecordList, payload)
      yield put({
        type: 'companyIdentify/setData',
        payload: {
          recordList: data.list,
          recordPagination: {
            pageSize: 20,
            total: data.total,
            current: payload.page + 1,
          },
        },
      })
      return data
    },
    *authAdd({ payload }, { call }) {
      const { data } = yield call(companyIdentify.authAdd, payload)
      return data
    },
    *fetchCompanyJobList({ payload }, { call, put, select }) {
      const { data } = yield call(companyIdentify.fetchCompanyJobList, payload)
      const companyIdentifyState = yield select(
        (state) => state.companyIdentify
      )

      yield put({
        type: 'companyIdentify/setData',
        payload: {
          companyJobList: data.data,
          jobListPagination: {
            pageSize: 20,
            total:
              data.job_count || companyIdentifyState.jobListPagination.total,
            current: payload.page + 1,
          },
        },
      })
      return data
    },
    *changeCompanyJobList({ payload }, { call }) {
      const { data } = yield call(companyIdentify.changeCompanyJobList, payload)
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
