export default {
  namespace: 'loading',
  state: {
    effects: {},
  },
  reducers: {
    setLoadingStart(state, { payload }) {
      const { effects } = state
      effects[payload] = true
      return {
        ...state,
      }
    },
    setLoadingEnd(state, { payload }) {
      const { effects } = state
      effects[payload] = false
      return {
        ...state,
      }
    },
  },
  effects: {},
}
