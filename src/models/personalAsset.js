import * as personalAsset from 'services/personalAsset'

export default {
  namespace: 'personalAsset',
  state: {
    // 单条的发票详情 用于修改 和 详情页面
    invoice: {},
    list: {},
  },
  reducers: {},
  effects: {
    *fetch({ payload }, { call }) {
      const data = yield call(personalAsset.fetch, payload)
      return data.data
    },
    *fetchDealRecord({ payload }, { call }) {
      const data = yield call(personalAsset.fetchDealRecord, payload)
      return data.data
    },
    *addFriend({ payload }, { call }) {
      const data = yield call(personalAsset.addFriend, payload)
      return data.data
    },
    *exchange({ payload }, { call }) {
      const data = yield call(personalAsset.exchange, payload)
      return data.data
    },
    *fetchUsedRight({ payload }, { call }) {
      const data = yield call(personalAsset.fetchUsedRight, payload)
      return data.data
    },
  },
}
