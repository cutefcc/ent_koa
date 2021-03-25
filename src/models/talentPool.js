import * as talentPool from 'services/talentPool'
import * as R from 'ramda'

export default {
  namespace: 'talentPool',
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
    customEntGroups: [],
    companyGroups: [],
    activityList: [],
    showActivity: 0,
    dashboard: {
      param: {
        page: 0,
        last_time: '',
      },
      list: [],
      remain: 0,
      pos: 0,
    },
    navigator: [],
    stat: {},
  },
  reducers: {
    setCustomEntGroups: (state, { payload }) => {
      return {
        ...state,
        customEntGroups: payload,
      }
    },
    setCompanyGroups: (state, { payload }) => {
      return {
        ...state,
        companyGroups: payload,
      }
    },
    setActivityList: (state, { payload }) => {
      return {
        ...state,
        activityList: R.pathOr([], ['data', 'list'], payload),
        showActivity: R.pathOr(0, ['data', 'is_show'], payload),
      }
    },
    setDashboard: (state, { payload }) => {
      const oldlist = R.pathOr([], ['dashboard', 'list'], state)
      const newList = R.propOr([], 'list', payload)
      const isNewPage = payload.param.page === 0
      const uniqById = (data) => R.uniqBy(R.prop('id'), data)
      const listResult = isNewPage
        ? newList
        : uniqById([...oldlist, ...newList])
      const offset = payload.begin === undefined ? payload.count : payload.begin
      const dashboard = {
        ...payload,
        list: listResult,
        maxShow: isNewPage ? payload.count : oldlist.length + offset,
      }
      return {
        ...state,
        dashboard,
      }
    },
    clearDashboard: (state) => {
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          list: [],
          remain: 0,
        },
      }
    },
    setNavigator: (state, { payload }) => {
      return {
        ...state,
        navigator: payload,
      }
    },
    setStat: (state, { payload }) => {
      return {
        ...state,
        stat: R.propOr({}, 'data', payload),
      }
    },
  },
  effects: {
    *fetch({ payload }, { call }) {
      const data = yield call(talentPool.fetch, payload)
      return data.data
    },
    *fetchNew({ payload }, { call }) {
      const data = yield call(talentPool.fetchNew, payload)
      return data.data
    },
    *add({ payload }, { call }) {
      const data = yield call(talentPool.add, payload)
      return data
    },
    *fetchOpportunityList({ payload }, { call }) {
      const data = yield call(talentPool.fetchOpportunityList, payload)
      return data.data
    },
    *fetchFilterOptions({ payload }, { call }) {
      const data = yield call(talentPool.fetchFilterOptions, payload)
      return data.data
    },
    *fetchStatic({ payload }, { call }) {
      const data = yield call(talentPool.fetchStatic, payload)
      return data.data
    },
    *fetchAmountTrend({ payload }, { call }) {
      const data = yield call(talentPool.fetchAmountTrend, payload)
      return data.data
    },
    *fetchContributionList({ payload }, { call }) {
      const data = yield call(talentPool.fetchContributionList, payload)
      return data.data
    },
    *fetchNavigator({ payload }, { call, put }) {
      const { data } = yield call(talentPool.fetchNavigator, payload)
      yield put({
        type: 'talentPool/setNavigator',
        payload: R.propOr([], 'data', data),
      })
      return data
    },
    *fetchStat({ payload }, { call, put }) {
      const data = yield call(talentPool.fetchStat, payload)
      yield put({
        type: 'talentPool/setStat',
        payload: R.propOr([], 'data', data),
      })
      return data
    },
    *addGroup({ payload }, { call }) {
      const data = yield call(talentPool.addGroup, payload)
      return data.data
    },
    *modifyGroup({ payload }, { call }) {
      const data = yield call(talentPool.modifyGroup, payload)
      return data.data
    },
    *deleteGroup({ payload }, { call }) {
      const data = yield call(talentPool.deleteGroup, payload)
      return data.data
    },
    *fetchGroups({ payload }, { call, put }) {
      const { data } = yield call(talentPool.fetchGroups, payload)
      yield put({
        type: 'talentPool/setCustomEntGroups',
        payload: R.propOr([], 'list', data.data),
      })
      return data
    },
    *fetchGroupsByUid({ payload }, { call }) {
      const data = yield call(talentPool.fetchGroupsByUid, payload)
      return data.data
    },
    *addTalents({ payload }, { call }) {
      const data = yield call(talentPool.addTalents, payload)
      return data.data
    },
    *search({ payload }, { call }) {
      const data = yield call(talentPool.search, payload)
      return data.data
    },
    *searchV2({ payload }, { call }) {
      const data = yield call(talentPool.searchV2, payload)
      return data.data
    },
    *fetchCompanyGroups({ payload }, { call, put }) {
      const { data } = yield call(talentPool.fetchCompanyGroups, payload)
      yield put({
        type: 'talentPool/setCompanyGroups',
        payload: R.pathOr([], ['data', 'list'], data),
      })
      return data
    },
    *addCompanyGroup({ payload }, { call }) {
      const data = yield call(talentPool.addCompanyGroup, payload)
      return data.data
    },
    *modifyCompanyGroup({ payload }, { call }) {
      const data = yield call(talentPool.modifyCompanyGroup, payload)
      return data.data
    },
    *deleteCompanyGroup({ payload }, { call }) {
      const data = yield call(talentPool.deleteCompanyGroup, payload)
      return data.data
    },
    *fetchActivityList({ payload }, { call, put }) {
      const { data } = yield call(talentPool.fetchActivityList, payload)
      yield put({
        type: 'talentPool/setActivityList',
        payload: data,
      })
      return data
    },
    *fetchAnalysis({ payload }, { call }) {
      const { data } = yield call(talentPool.fetchAnalysis, payload)
      return data
    },
    *fetchContribution({ payload }, { call }) {
      const { data } = yield call(talentPool.fetchContribution, payload)
      return data
    },
    *fetchDashboard({ payload }, { call, put }) {
      if (payload.page === 0) {
        yield put({
          type: 'talentPool/clearDashboard',
        })
      }
      const { data } = yield call(talentPool.fetchDashboard, payload)
      yield put({
        type: 'talentPool/setDashboard',
        payload: {
          param: payload,
          ...R.propOr({}, 'data', data),
        },
      })
      return data
    },
    *fetchGrownTrendService({ payload }, { call }) {
      const { data } = yield call(talentPool.fetchGrownTrendService, payload)
      return data
    },
    *fetchSourceDistributionService({ payload }, { call }) {
      const { data } = yield call(
        talentPool.fetchSourceDistributionService,
        payload
      )
      return data
    },
    *fetchExtraOptions({ payload }, { call }) {
      const { data } = yield call(talentPool.fetchExtraOptions, payload)
      return data
    },
    *setSuitable({ payload }, { call }) {
      const { data } = yield call(talentPool.setSuitable, payload)
      return data
    },
    *setUnSuitable({ payload }, { call }) {
      const { data } = yield call(talentPool.setUnSuitable, payload)
      return data
    },
    *fetchDynamicDetails({ payload }, { call }) {
      const { data } = yield call(talentPool.fetchDynamicDetails, payload)
      return data
    },
    *fetchDynamicDetailsByEventType({ payload }, { call }) {
      const { data } = yield call(
        talentPool.fetchDynamicDetailsByEventType,
        payload
      )
      return data
    },
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({
        type: 'fetchStat',
        payload: {},
      })
    },
  },
}
