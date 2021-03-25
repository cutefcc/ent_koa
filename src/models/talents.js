import * as talents from 'services/talents'

export default {
  namespace: 'talents',
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
    *fetch({ payload }, { call }) {
      const data = yield call(talents.fetch, payload)
      return data.data
    },
    *archive({ payload }, { call }) {
      const data = yield call(talents.archive, payload)
      return data
    },
    *modifyState({ payload }, { call }) {
      const data = yield call(talents.modifyState, payload)
      return data
    },
    *fetchPromoteList({ payload }, { call }) {
      const data = yield call(talents.fetchPromoteList, payload)
      return data.data
    },
    *fetchProfile({ payload }, { call }) {
      const data = yield call(talents.fetchProfile, payload)
      return data.data
    },
    *fetchMicroProfile({ payload }, { call }) {
      const data = yield call(talents.fetchMicroProfile, payload)
      return data.data
    },
    *searchV2({ payload }, { call }) {
      const data = yield call(talents.searchV2, payload)
      return data.data
    },
    *fetchCoBrowser({ payload }, { call }) {
      const data = yield call(talents.fetchCoBrowser, payload)
      return data.data
    },
    *fetchCoContactor({ payload }, { call }) {
      const data = yield call(talents.fetchCoContactor, payload)
      return data.data
    },
    *fetchRemarks({ payload }, { call }) {
      const data = yield call(talents.fetchRemarks, payload)
      return data.data
    },
    *addRemark({ payload }, { call }) {
      const data = yield call(talents.addRemark, payload)
      return data.data
    },
    *fetchInterestedList({ payload }, { call }) {
      const data = yield call(talents.fetchInterestedList, payload)
      return data.data
    },
    *fetchExpect({ payload }, { call }) {
      const { data } = yield call(talents.fetchExpect, payload)
      return data
    },
    *fetchHasIntention({ payload }, { call }) {
      const { data } = yield call(talents.fetchHasIntention, payload)
      return data
    },
    *fetchContact({ payload }, { call }) {
      const { data } = yield call(talents.fetchContact, payload)
      return data
    },
    *fetchListUserLimit({ payload }, { call }) {
      const { data } = yield call(talents.fetchListUserLimit, payload)
      return data
    },
    *fetchDynamicDetail({ payload }, { call }) {
      const { data } = yield call(talents.fetchDynamicDetail, payload)
      return data
    },
    *fetchResumeDelivery({ payload }, { call }) {
      const { data } = yield call(talents.fetchResumeDelivery, payload)
      return data
    },
    *fetchCompanyFansDetails({ payload }, { call }) {
      const { data } = yield call(talents.fetchCompanyFansDetails, payload)
      return data
    },
  },
}
