import * as channel from 'services/channel'

export default {
  namespace: 'channels',
  state: {
    list: {}, // 频道列表数
    currentChannel: {},
  },
  reducers: {
    setList(state, { payload: { data = [] } }) {
      return {
        ...state,
        list: data,
      }
    },
    setCurrentChannel(state, { payload: { data = {} } }) {
      return {
        ...state,
        currentChannel: data,
      }
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const data = yield call(channel.fetch, payload)
      yield put({
        type: 'channels/setList',
        payload: data.data,
      })
      return data.data
    },
    *fetchTalents({ payload }, { call }) {
      const data = yield call(channel.fetchTalents, payload)
      return data.data
    },
    *send({ payload }, { call }) {
      const data = yield call(channel.send, payload)
      return data.data
    },
    *fetchUnavailableTalents({ payload }, { call }) {
      const data = yield call(channel.fetchUnavailableTalents, payload)
      return data.data
    },
    *fetchCurrentChannel({ payload }, { call, put }) {
      const data = yield call(channel.fetchStat, payload)
      yield put({
        type: 'channels/setCurrentChannel',
        payload: data.data,
      })
      return data.data
    },
  },
}
