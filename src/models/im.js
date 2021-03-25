import * as im from 'services/im'

export default {
  namespace: 'im',
  state: {
    // 单条的发票详情 用于修改 和 详情页面
    invoice: {},
    list: {},
  },
  reducers: {},
  effects: {
    *fetchDialog({ payload }, { call }) {
      const data = yield call(im.fetchDialog, payload)
      return data.data
    },
    *sendMessage({ payload }, { call }) {
      const data = yield call(im.sendMessage, payload)
      return data.data
    },
    *fetchMsgDialog({ payload }, { call }) {
      const data = yield call(im.fetchMsgDialog, payload)
      return data.data
    },
    *clearBadge({ payload }, { call }) {
      const data = yield call(im.clearBadge, payload)
      return data.data
    },
    *fetchUnrmsg({ payload }, { call }) {
      const data = yield call(im.fetchUnrmsg, payload)
      return data.data
    },
    *fetchMyMessages({ payload }, { call }) {
      const data = yield call(im.fetchMyMessages, payload)
      return data.data
    },
    *getFile({ payload }, { call }) {
      const data = yield call(im.getFile, payload)
      return data.data
    },
  },
}
