import * as users from 'services/users'

export default {
  namespace: 'users',
  state: {
    // 单条的发票详情 用于修改 和 详情页面
    invoice: {},
    list: {
      data: [],
      param: {
        page: 0,
        pageSize: 20,
      },
    },
  },
  reducers: {},
  effects: {
    *find({ payload }, { call }) {
      const data = yield call(users.find, payload)
      return data.data
    },
    *updateConfig({ payload }, { call }) {
      const data = yield call(users.updateConfig, payload)
      return data.data
    },
  },
}
