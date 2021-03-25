import * as entInvite from 'services/entInvite'
import * as R from 'ramda'

export default {
  namespace: 'entInvite',

  state: {
    invitations: [],
  },

  effects: {
    *fetch(payload, { call, put }) {
      const { data } = yield call(entInvite.fetch, { size: 100, page: 0 })
      yield put({
        type: 'entInvite/setInvitations',
        payload: R.pathOr([], ['data', 'list'], data),
      })
      return data.data
    },
    *add({ payload }, { call }) {
      const { data } = yield call(entInvite.add, payload)
      return data
    },
    *pre({ payload }, { call }) {
      const { data } = yield call(entInvite.pre, payload)
      return data
    },
    *keepBusiness({ payload }, { call }) {
      const { data } = yield call(entInvite.keepBusiness, payload)
      return data
    },
  },

  reducers: {
    setInvitations(state, { payload = [] }) {
      return {
        ...state,
        invitations: payload,
      }
    },
  },
}
