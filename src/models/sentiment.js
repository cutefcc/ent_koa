import * as sentiment from 'services/sentiment'
import { CURRENT_TAB } from 'constants/sentiment'
import * as R from 'ramda'

function* fetchSentimentList({ payload }, { call, put, select }) {
  const stateData = yield select(R.path(['sentiment']))
  const global = yield select(R.path(['global']))
  const { listDefaultParam, currentSubscribe } = stateData
  const param = {
    ...payload,
    ...listDefaultParam,
    webcid: R.path(['bprofileUser', 'company', 'webcid'], global),
  }
  const { data } = yield call(sentiment.fetchSentimentList, param)

  const list = R.pathOr([], ['data', 'list'], data)

  yield put({
    type: 'sentiment/setSubscribeList',
    payload: list,
  })

  // 如果未选中任何关键词，默认选中第一个
  if (R.isEmpty(currentSubscribe)) {
    yield put({
      type: 'sentiment/setCurrentSubscribe',
      payload: list.length > 0 ? list[0] : {},
    })
  }

  return data.data
}

function* fetchSentimentData({ payload }, { call, put, select }) {
  const stateData = yield select(R.path(['sentiment']))
  const global = yield select(R.path(['global']))
  const {
    currentSubscribe,
    sentimentData,
    paginationParam,
    currentTab,
    sortby,
  } = stateData

  if (R.isEmpty(currentSubscribe)) {
    if (!R.isEmpty(sentimentData)) {
      yield put({
        type: 'sentiment/setSentimentData',
        payload: {},
      })
      yield put({
        type: 'sentiment/setPaginationParam',
        payload: {
          ...paginationParam,
          page: 1,
          total: 0,
        },
      })
    }
    return
  }

  const param = {
    ...payload,
    ...paginationParam,
    page: paginationParam.page - 1,
    sortby,
    data_type: currentTab === CURRENT_TAB.gossip ? 1 : 2,
    words_id: +R.path(['id'], currentSubscribe),
    webcid: R.path(['bprofileUser', 'company', 'webcid'], global),
  }

  const { data } = yield call(sentiment.fetchSentimentData, param)

  const list = R.pathOr([], ['data', 'list'], data)
  list.forEach((item) => {
    const obj = item
    obj.enableShowMore = true
    obj.pagination = {
      page: 0,
      size: 8,
    }
  })

  yield put({
    type: 'sentiment/setSentimentData',
    payload: data.data,
  })
  yield put({
    type: 'sentiment/setPaginationParam',
    payload: {
      ...paginationParam,
      total: R.pathOr(0, ['data', 'total'], data),
    },
  })
  // return data.data
}

export default {
  namespace: 'sentiment',
  state: {
    currentSubscribe: {},
    sortby: 1, // 排序方式。1：综合排序，2：时间排序，3：热度排序
    paginationParam: {
      page: 1,
      size: 20,
    },
    listDefaultParam: {
      page: 0,
      size: 20,
    },
    subscribeList: [],
    currentTab: CURRENT_TAB.gossip,
    sentimentData: {},
  },
  reducers: {
    setSubscribeList(state, { payload }) {
      return {
        ...state,
        subscribeList: payload,
      }
    },
    setCurrentSubscribe(state, { payload }) {
      return {
        ...state,
        paginationParam: {
          ...state.paginationParam,
          page: 1,
        },
        sortby: 1,
        currentSubscribe: payload,
      }
    },
    setCurrentTab(state, { payload }) {
      return {
        ...state,
        paginationParam: {
          ...state.paginationParam,
          page: 1,
        },
        sortby: 1,
        currentTab: payload,
      }
    },
    setSentimentData(state, { payload }) {
      return {
        ...state,
        sentimentData: payload,
      }
    },
    setPaginationParam(state, { payload }) {
      return {
        ...state,
        paginationParam: payload,
      }
    },
    setSort(state, { payload }) {
      return {
        ...state,
        paginationParam: {
          ...state.paginationParam,
          page: 1,
        },
        sortby: parseInt(payload, 10) || 0,
      }
    },
  },
  effects: {
    fetchSentimentList,
    fetchSentimentData,
    *addSentimentWord({ payload }, { call }) {
      const data = yield call(sentiment.addSentimentWord, payload)
      return data.data
    },
    *fetchSentimentComment({ payload }, { call }) {
      const data = yield call(sentiment.fetchSentimentComment, payload)
      return data.data
    },
    *deleteSentimentWord({ payload }, { call }) {
      const data = yield call(sentiment.deleteSentimentWord, payload)
      return data.data
    },
  },
}
