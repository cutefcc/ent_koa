import * as statCompany from 'services/statCompany'

export default {
  namespace: 'statCompany',
  state: {},
  reducers: {},
  effects: {
    *fetchUsed({ payload }, { call }) {
      const data = yield call(statCompany.fetchUsed, payload)
      return data.data
    },
    *fetchRight({ payload }, { call }) {
      const data = yield call(statCompany.fetchRight, payload)
      return data.data
    },
    *fetchRightScenes({ payload }, { call }) {
      const data = yield call(statCompany.fetchRightScenes, payload)
      return data.data
    },
    *fetchDetail({ payload }, { call }) {
      const data = yield call(statCompany.fetchDetail, payload)
      return data.data
    },
    *fetchDetail2({ payload }, { call }) {
      const data = yield call(statCompany.fetchDetail2, payload)
      return data.data
    },
    *fetchDetailV2({ payload }, { call }) {
      const data = yield call(statCompany.fetchDetailV2, payload)
      return data.data
    },
    *fetchCompanyTotal({ payload }, { call }) {
      const data = yield call(statCompany.fetchCompanyTotal, payload)
      return data.data
    },
    *fetchCompanyDaily({ payload }, { call }) {
      const data = yield call(statCompany.fetchCompanyDaily, payload)
      return data.data
    },
    *fetchLicenseRank({ payload }, { call }) {
      const data = yield call(statCompany.fetchLicenseRank, payload)
      return data.data
    },
    *fetchLicenseDetail({ payload }, { call }) {
      const data = yield call(statCompany.fetchLicenseDetail, payload)
      return data.data
    },
  },
}
