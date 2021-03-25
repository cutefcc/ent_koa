import * as memberApply from 'services/memberApply'

export default {
  namespace: 'memberApply',

  state: {
    applys: [],
  },

  effects: {
    *getMemberApply({ payload }, { call, put }) {
      const { data } = yield call(memberApply.getMemberApply, payload)
      yield put({
        type: 'memberApply/setApplys',
        payload: data.data,
      })
      return data.data
    },
    *addMemberApply({ payload }, { call, put }) {
      const { data } = yield call(memberApply.addMemberApply, payload)
      yield put({
        type: 'memberApply/setApplys',
        payload: data.data,
      })
      return data.data
    },
    *updateMemberApply({ payload }, { call, put }) {
      const { data } = yield call(memberApply.updateMemberApply, payload)
      yield put({
        type: 'memberApply/setApplys',
        payload: data.data,
      })
      return data.data
    },
  },

  reducers: {
    setApplys(state, { payload: { applys = [] } }) {
      return {
        ...state,
        applys,
      }
    },
  },
}
