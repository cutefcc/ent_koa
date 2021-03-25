/* eslint-disable max-lines */
import * as homeSubscribe from 'services/homeSubscribe'
import * as globalService from 'services/global'
import {
  CURRENT_TAB,
  INIT_ADVANCE_SEARCH,
  EVENETS_NAME_MAP,
  TABTYPEMAP,
} from 'constants/talentDiscover'
import { replaceCompanySpecialCharacter, GUID, arrToJson } from 'utils'
import {
  call,
  put,
  takeEvery,
  takeLatest,
  all,
  select,
} from 'redux-saga/effects'
import * as R from 'ramda'

// 打点通用方法
const trackEvents = (name, trackParam) => {
  if (window.voyager) {
    const param = {
      datetime: new Date().getTime(),
      uid: window.uid,
      ...trackParam,
    }
    window.voyager.trackEvent(name, name, param)
  }
}

// function* fetchData({ payload }, param) {
//   const { select, put } = param
//   const { currentTab, currentGroup } = yield select(R.path(['talentDiscover']))
//   const { isNewSid } = payload

//   if (currentGroup && currentGroup.action_code === 1) {
//     yield put({
//       type: 'homeSubscribe/resetDatas',
//     })
//     return
//   }

//   // a new sid is needed when isNewSid = undefined(true)
//   if (isNewSid !== false) {
//     yield put({
//       type: 'homeSubscribe/setSid',
//       payload: GUID(),
//     })
//   }

//   if (currentTab === 'talent') {
//     try {
//       yield fetchTalentList(payload, param)
//       yield fetchAnalysis({}, param)
//       yield fetchDynamicHook({}, param)
//     } catch (e) {
//       // console.log(e)
//     }
//   } else if (currentTab === 'dynamic') {
//     yield fetchDynamic({}, param)
//   }
// }

function* fetchSubscribeList({ payload }, param) {
  const { put, call, select } = param
  const stateData = yield select(R.path(['homeSubscribe']))
  const { paginationParam } = stateData
  const requestParam = {
    ...paginationParam,
    page: payload.page ? payload.page - 1 : 0,
  }
  const data = yield call(homeSubscribe.fetchSubscribeList, requestParam)

  if (data && data.data && data.data.code === 0) {
    const {
      list,
      subscribe_current_count,
      subscribe_max_count,
    } = data.data.data
    // const { pagination } = yield select(R.path(['homeSubscribe']))
    yield put({
      type: 'homeSubscribe/setSubscribeList',
      payload: list,
    })

    yield put({
      type: 'homeSubscribe/setPaginationParam',
      payload: {
        ...paginationParam,
        total: subscribe_current_count || 0,
        page: R.pathOr(1, ['page'], payload),
      },
    })

    yield put({
      type: 'homeSubscribe/setSubscribeCurrentCount',
      payload: subscribe_current_count,
    })

    yield put({
      type: 'homeSubscribe/setSubscribeCurrentCount',
      payload: subscribe_current_count,
    })

    yield put({
      type: 'homeSubscribe/setSubscribeMaxCount',
      payload: subscribe_max_count,
    })

    // yield put({
    //   type: 'setPagination',
    //   payload: Object.assign({}, pagination, { total: data.data.data.count }),
    // })
  }

  yield put({
    type: 'homeSubscribe/setSubscribeListLoading',
    payload: false,
  })

  return data.data
}

function* fetchNotifications({ payload }, param) {
  const { put, call, select } = param
  const { subscribeList } = yield select(R.path(['homeSubscribe']))
  const data = yield call(homeSubscribe.fetchNotifications, payload)

  if (data && data.data && data.data.code === 0) {
    const list = subscribeList.map((item) => {
      if (item.id === payload.id) {
        item.is_notify = payload.is_notify
      }
      return item
    })
    yield put({
      type: 'homeSubscribe/setSubscribeList',
      payload: list,
    })
  }

  return data.data
}

function* fetchSwitch({ payload }, param) {
  const { put, call, select } = param
  const { subscribeList } = yield select(R.path(['homeSubscribe']))
  const data = yield call(homeSubscribe.fetchSwitch, payload)
  if (data && data.data && data.data.code === 0) {
    const index = subscribeList.findIndex((item) => item.id === payload.id)
    const item = subscribeList.splice(index, 1)
    subscribeList.unshift(item[0])
    yield put({
      type: 'homeSubscribe/setSubscribeList',
      payload: [...subscribeList],
    })
  }

  return data.data
}

function* fetchTrendsData({ payload }, param) {
  const { put, call } = param
  const data = yield call(homeSubscribe.fetchTrendsData, payload)
  if (data && data.data && data.data.code === 0) {
    yield put({
      type: 'homeSubscribe/setTrendsData',
      payload: data.data.data.list,
    })
  }

  return data.data
}

function* clearBadge({ payload }, param) {
  const { put, call, select } = param
  const { subscribeList } = yield select(R.path(['homeSubscribe']))
  const data = yield call(homeSubscribe.clearBadge, payload)

  if (data && data.data && data.data.code === 0) {
    yield put({
      type: 'homeSubscribe/setSubscribeList',
      payload: subscribeList.map((item) => {
        if (item.id === payload.id) {
          item.statistics_new_add.has_dynamic_cnt = 0
          item.statistics_new_add.fans_cnt = 0
          item.statistics_new_add.delivery_cnt = 0
        }

        return item
      }),
    })
  }

  return data.data
}

export default {
  namespace: 'homeSubscribe',
  state: {
    notifications: [],
    subscribeList: [],
    paginationParam: {
      page: 1,
      size: 10,
      total: 0,
    },
    statistics: {},
    trendsData: [],
    subscribeListLoading: true,
    // pagination: {
    //   current: 1,
    //   pageSize: 5,
    //   onChange: (page, pageSize) => {

    //   }
    // },
  },
  reducers: {
    setSwitch(state, { payload }) {
      return {
        ...state,
        switch: payload.data,
      }
    },
    setGroupList(state, { payload }) {
      return {
        ...state,
        groupList: payload.data,
      }
    },
    setNotifications(state, { payload }) {
      return {
        ...state,
        notifications: payload,
      }
    },
    setSubscribeList(state, { payload }) {
      return {
        ...state,
        subscribeList: payload,
      }
    },
    setPaginationParam(state, { payload }) {
      return {
        ...state,
        paginationParam: payload,
      }
    },
    setSubscribeCurrentCount(state, { payload }) {
      return {
        ...state,
        subscribeCurrentCount: payload,
      }
    },
    setSubscribeMaxCount(state, { payload }) {
      return {
        ...state,
        subscribeMaxCount: payload,
      }
    },
    setTrendsData(state, { payload }) {
      return {
        ...state,
        trendsData: payload,
      }
    },
    setSubscribeListLoading(state, { payload }) {
      return {
        ...state,
        subscribeListLoading: payload,
      }
    },
    // setPagination(state, {payload}) {
    //   return {
    //     ...state,
    //     pagination: payload,
    //   }
    // },
  },
  effects: {
    fetchSwitch,
    fetchNotifications,
    // *fetchDynamicTabs({ payload }, { call, put }) {
    //   const data = yield call(talentDiscover.fetchDynamicNavigator, payload)
    //   yield put({
    //     type: 'homeSubscribe/setDynamicTabs',
    //     payload: data.data,
    //   })
    //   yield put({
    //     type: 'homeSubscribe/setDynamicCategoryMap',
    //     payload: data.data,
    //   })
    //   return data.data
    // },
    fetchSubscribeList,
    fetchTrendsData,
    clearBadge,
  },
}
