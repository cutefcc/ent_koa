import * as companyAsset from 'services/companyAsset'

export default {
  namespace: 'companyAsset',
  state: {
    // 单条的发票详情 用于修改 和 详情页面
    invoice: {},
    list: {},
  },
  reducers: {},
  effects: {
    *fetch({ payload }, { call }) {
      const data = yield call(companyAsset.fetch, payload)
      return data.data
    },
    *add({ payload }, { call }) {
      const data = yield call(companyAsset.add, payload)
      return data.data
    },
    *del({ payload }, { call }) {
      const data = yield call(companyAsset.del, payload)
      return data.data
    },
    *recycle({ payload }, { call }) {
      const data = yield call(companyAsset.recycle, payload)
      return data.data
    },
    *assign({ payload }, { call }) {
      const data = yield call(companyAsset.assign, payload)
      return data.data
    },
    *fetchDealRecord({ payload }, { call }) {
      const data = yield call(companyAsset.fetchDealRecord, payload)
      return data.data
    },
  },
}
