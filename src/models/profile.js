import * as profile from 'services/profile'
import * as R from 'ramda'

export default {
  namespace: 'profile',
  state: {
    visible: false, // 是否展示 profile
    uids: [], // profile队列中所有 uid，每次关闭 profile 的时候会清空
    currentIndex: 0, // 当前显示 uid 的 index
    currentUid: 0, // 当前显示的 uid
    trackParam: {}, // 进入profile的trackParam
    fr: '', // 进入profile的fr
  },
  reducers: {
    setInfo: (state, { payload }) => {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: {
    *fetchInterestContact({ payload }, { call }) {
      const params = {
        uid: window.uid,
        to_uid: payload.uid,
      }
      const data = yield call(profile.fetchInterestContactNew, params)
      return { data: R.pathOr([], ['data', 'data', 'list'], data) }
    },
    *fetchCommentList({ payload }, { call }) {
      const data = yield call(profile.fetchCommentList, payload)
      return data.data
    },
    *fetchUserTag({ payload }, { call }) {
      const data = yield call(profile.fetchUserTag, payload)
      return data.data
    },
    *fetchRealnameStatus({ payload }, { call }) {
      const data = yield call(profile.fetchRealnameStatus, payload)
      return data.data
    },
    *fetchBasicInfo({ payload }, { call }) {
      const data = yield call(profile.fetchBasicInfo, payload)
      return data.data
    },
    *fetchJobPreference({ payload }, { call }) {
      const data = yield call(profile.fetchJobPreference, payload)
      return data.data
    },
    *fetchTabs({ payload }, { call }) {
      const data = yield call(profile.fetchTabs, payload)
      return data.data
    },
    *fetchWorkAndEduExp({ payload }, { call }) {
      const data = yield call(profile.fetchWorkAndEduExp, payload)
      return data.data
    },
    *fetchCardList({ payload }, { call }) {
      const data = yield call(profile.fetchCardList, payload)
      return data.data
    },
  },
}
