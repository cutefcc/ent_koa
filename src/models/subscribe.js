import * as subscribe from 'services/subscribe'
import * as globalService from 'services/global'
import * as R from 'ramda'
import { INIT_SEARCH_GROUP } from 'constants/groups'
import { CURRENT_TAB } from 'constants/talentDiscover'
import {
  replaceCompanySpecialCharacter,
  GUID,
  arrToJson,
  appendTalentsList,
} from 'utils'

const formatAdvancedSearch = (values) => {
  // 搜索的时候需要替换 BAT 和 TMDJ
  if (!values.companys) {
    return values
  }

  return {
    ...values,
    companys: replaceCompanySpecialCharacter(`${values.companys}`),
  }
}
function getDynamicParam(data, payload) {
  const { currCondition, paginationParam, currentDynamicCategory, searchParam } = data
  const param = {
    search: {
      ...formatAdvancedSearch(searchParam),
      ...formatAdvancedSearch(currCondition),
      ...paginationParam,
      page: paginationParam.page - 1,
      event_types: currentDynamicCategory,
      ...payload,
    },
  }
  return param
}
function* fetchMappingData(payload, { call, put, select }) {
  const { currCondition, paginationParam, searchParam } = yield select(
    R.path(['subscribe'])
  )
  const sid = GUID()
  const param = {
    search: {
      ...formatAdvancedSearch(searchParam),
      ...formatAdvancedSearch(currCondition),
      ...paginationParam,
      page: paginationParam.page - 1,
      sid,
      sessionid: sid,
      subscribe_id: currCondition.id,
    },
  }
  const sortby = Number(R.pathOr(0, ['search', 'sortby'], param))
  param.search.sortby = sortby

  const companys = R.pathOr('', ['search', 'companys'], param)
  const companyscope = R.pathOr(0, ['search', 'companyscope'], param)
  const isMapping = R.pathOr(null, ['search_type'], payload) === 'mapping'
  if (!isMapping) {
    delete param.search.sub_cities
    delete param.search.sub_schools
    delete param.search.sub_worktimes
    delete param.search.sub_professions
    delete param.search.sub_companies
    delete param.search.sub_excompanies
    delete param.search.sub_allcompanies
    delete param.search.excids
    delete param.search.cids
  }

  delete param.search.companies
  delete param.search.excompanies
  delete param.search.allcompanies
  if (companyscope === 0) {
    param.search.allcompanies = companys
  }
  if (companyscope === 1) {
    param.search.companies = companys
  }
  if (companyscope === 2) {
    param.search.excompanies = companys
  }
  delete param.search.companys
  delete param.search.companyscope

  // param.search.allcompanies = companys
  // delete param.search.excompanies
  // delete param.search.companies
  // delete param.search.companys
  // delete param.search.companyscope

  const data = yield call(subscribe.fetchMappingData, param)
  yield put({
    type: 'subscribe/setAnalysis',
    payload: data.data,
  })
  return data.data
}

// eslint-disable-next-line max-statements
function* fetchTalentsLists(payload, { call, put, select }) {
  const { paginationParam, searchParam, currCondition, sid } = yield select(
    R.path(['subscribe'])
  )
  let newSid = ''
  const { isNewSid } = payload
  if (isNewSid !== false) {
    newSid = GUID()
    yield put({
      type: 'subscribe/setSid',
      payload: newSid,
    })
  }
  const param = {
    search: {
      ...formatAdvancedSearch(searchParam),
      ...formatAdvancedSearch(currCondition),
      ...paginationParam,
      page: paginationParam.page - 1,
      sid: newSid || sid,
      sessionid: newSid || sid,
      subscribe_id: currCondition.id,
    },
  }
  const companys = R.pathOr('', ['search', 'companys'], param)
  const companyscope = R.pathOr('', ['search', 'companyscope'], param)
  const isMapping = R.pathOr(null, ['search_type'], payload) === 'mapping'
  if (!isMapping) {
    delete param.search.sub_cities
    delete param.search.sub_schools
    delete param.search.sub_worktimes
    delete param.search.sub_professions
    delete param.search.sub_companies
    delete param.search.sub_excompanies
    delete param.search.sub_allcompanies
    delete param.search.excids
    delete param.search.cids
  }

  delete param.search.companies
  delete param.search.excompanies
  delete param.search.allcompanies
  if (companyscope === 0) {
    param.search.allcompanies = companys
  }
  if (companyscope === 1) {
    param.search.companies = companys
  }
  if (companyscope === 2) {
    param.search.excompanies = companys
  }
  delete param.search.companys
  delete param.search.companyscope

  // param.search.allcompanies = companys
  // delete param.search.excompanies
  // delete param.search.companies
  // delete param.search.companys
  // delete param.search.companyscope

  const { data } = yield call(subscribe.fetchTalentsLists, {
    ...param,
    ...payload,
  })
  const toUids = R.pathOr([], ['data', 'list'], data)
    .map((item) => item.id)
    .join(',')
  const fetchDynamicAndNumParams = {
    query: {
      to_uids: toUids,
      channel: 'www',
      version: '1.0.0',
      version_type: 2,
    },
  }

  let latestDynamic = {}
  try {
    const dynamicData = yield call(
      subscribe.fetchLatestDynamicAndNum,
      fetchDynamicAndNumParams
    )
    latestDynamic = R.propOr({}, 'data', dynamicData)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
  const talentLists = R.pathOr([], ['data', 'list'], data)
  const latestDynamicLists = R.pathOr({}, ['data', 'dict'], latestDynamic)
  talentLists.forEach((item) => {
    if (latestDynamicLists[item.id]) {
      // eslint-disable-next-line no-param-reassign
      item.latestDynamic = latestDynamicLists[item.id]
    }
  })
  yield put({
    type: 'subscribe/setTalentList',
    payload: talentLists,
  })

  if (toUids) {
    yield appendTalentsList(
      call(globalService.fetchExtendData, { to_uids: toUids }),
      talentLists,
      put
    )
  }

  yield put({
    type: 'subscribe/setPaginationParam',
    payload: {
      ...paginationParam,
      total: R.pathOr(0, ['data', 'total'], data),
      total_match: R.pathOr(0, ['data', 'total_match'], data),
    },
  })
  return data.data
}

function* fetchFeedList(payload, { call, put, select }) {
  const { paginationParam, searchParam, currCondition } = yield select(
    R.path(['subscribe'])
  )
  const sid = GUID()
  const param = {
    search: {
      ...formatAdvancedSearch(searchParam),
      ...formatAdvancedSearch(currCondition),
      ...paginationParam,
      page: paginationParam.page - 1,
      sid,
      sessionid: sid,
      subscribe_id: currCondition.id,
    },
  }
  const companys = R.pathOr('', ['search', 'companys'], param)
  const companyscope = R.pathOr('', ['search', 'companyscope'], param)
  const isMapping = R.pathOr(null, ['search_type'], payload) === 'mapping'
  if (!isMapping) {
    delete param.search.sub_cities
    delete param.search.sub_schools
    delete param.search.sub_worktimes
    delete param.search.sub_professions
    delete param.search.sub_companies
    delete param.search.sub_excompanies
    delete param.search.sub_allcompanies
    delete param.search.excids
    delete param.search.cids
  }

  delete param.search.companies
  delete param.search.excompanies
  delete param.search.allcompanies
  if (companyscope === 0) {
    param.search.allcompanies = companys
  }
  if (companyscope === 1) {
    param.search.companies = companys
  }
  if (companyscope === 2) {
    param.search.excompanies = companys
  }
  delete param.search.companys
  delete param.search.companyscope

  const { data } = yield call(subscribe.fetchFeedList, {
    ...param,
    ...payload,
  })

  yield put({
    type: 'subscribe/setFeedList',
    payload: R.pathOr([], ['data', 'list'], data),
  })

  yield put({
    type: 'subscribe/setPaginationParam',
    payload: {
      ...paginationParam,
      total: R.pathOr(0, ['data', 'total'], data),
      total_match: R.pathOr(0, ['data', 'total_match'], data),
    },
  })
  return data.data
}

// eslint-disable-next-line max-statements
function* fetchDynamic(payload, { call, put, select }) {
  const stateData = yield select(R.path(['subscribe']))
  const { paginationParam } = stateData
  const param = getDynamicParam(stateData)
  let data = null
  const companyscope = R.pathOr(0, ['search', 'companyscope'], param)
  const companys = R.pathOr('', ['search', 'companys'], param)
  const isMapping = R.pathOr(null, ['search_type'], payload) === 'mapping'
  delete param.search.companies
  delete param.search.excompanies
  delete param.search.allcompanies
  if (payload.update_time) {
    param.search.update_time = payload.update_time
  }

  if (payload.subscribe_id) {
    param.search.subscribe_id = payload.subscribe_id
  }

  if (companyscope === 0) {
    param.search.allcompanies = companys
  }
  if (companyscope === 1) {
    param.search.companies = companys
  }
  if (companyscope === 2) {
    param.search.excompanies = companys
  }
  delete param.search.companys
  delete param.search.companyscope

  if (!isMapping) {
    delete param.search.sub_cities
    delete param.search.sub_schools
    delete param.search.sub_worktimes
    delete param.search.sub_professions
    delete param.search.sub_companies
    delete param.search.sub_excompanies
    delete param.search.sub_allcompanies
    yield put({
      type: 'subscribe/setMappingTags',
      payload: [],
    })
    data = R.pathOr(null, ['data'], yield call(subscribe.fetchDynamic, param))
  } else {
    data = R.pathOr(null, ['data'], yield call(subscribe.fetchDynamic, param))
  }

  const toUids = R.pathOr([], ['data', 'list'], data)
    .map((item) => item.talent.id)
    .join(',')
  const params = {
    query: {
      to_uids: toUids,
      channel: 'www',
      version: '1.0.0',
      version_type: 2,
    },
  }
  const { data: latestDynamic } = yield call(
    subscribe.fetchLatestDynamicAndNum,
    params
  )
  const dynamicLists = R.pathOr([], ['data', 'list'], data)
  const latestDynamicLists = R.pathOr({}, ['data', 'dict'], latestDynamic)
  dynamicLists.forEach((item) => {
    if (latestDynamicLists[item.talent.id]) {
      // eslint-disable-next-line no-param-reassign
      item.talent.latestDynamic = latestDynamicLists[item.talent.id]
    }
  })
  yield put({
    type: 'subscribe/setDynamic',
    payload: {
      param: payload,
      ...R.propOr({}, 'data', data),
    },
  })
  yield put({
    type: 'subscribe/setPaginationParam',
    payload: {
      ...paginationParam,
      total: R.pathOr(0, ['data', 'total'], data),
      total_match: R.pathOr(0, ['data', 'total_match'], data),
    },
  })
}

function* fetchData({ payload }, param) {
  const { select, put } = param
  const { currentTab } = yield select(R.path(['subscribe']))
  const { search_type, pagination } = payload
  if (currentTab === 'talent') {
    if (pagination) {
      yield fetchTalentsLists(payload, param)
    } else {
      yield fetchTalentsLists(payload, param)
      yield fetchMappingData(payload, param)
    }
  } else if (currentTab === 'dynamic') {
    if (pagination) {
      yield fetchDynamic(payload, param)
    } else {
      yield fetchDynamic(payload, param)
      yield fetchMappingData(payload, param)
    }
  } else if (currentTab === 'realName') {
    if (pagination) {
      yield fetchFeedList(payload, param)
    } else {
      yield fetchFeedList(payload, param)
      yield fetchMappingData(payload, param)
    }
  }
}

function* fetchSwitch({ payload }, param) {
  const { put, call, select } = param
  const { conditionList } = yield select(R.path(['subscribe']))
  const data = yield call(subscribe.fetchSwitch, payload)
  if (data && data.data && data.data.code === 0) {
    const index = conditionList.findIndex((item) => item.id === payload.id)
    const item = conditionList.splice(index, 1)
    conditionList.unshift(item[0])
    yield put({
      type: 'subscribe/setConditionList',
      payload: [...conditionList],
    })
  }

  return data.data
}

export default {
  namespace: 'subscribe',
  state: {
    currentConditionId: 0,
    conditionChangeNum: 0,
    conditionList: [],
    conditionStat: {},

    // 3.0
    editCondition: {},
    currCondition: {},
    // 订阅分页
    conditionPaginationParam: {
      page: 0,
      size: 20,
      total: 0,
    },
    // 是否展开数据分析
    isShowDataAnalysis: false,
    // 分析数据
    analysis: [],
    searchParam: { ...INIT_SEARCH_GROUP },
    mappingTags: [],
    paginationParam: {
      page: 1,
      size: 20,
      total: 0,
      total_match: 0,
    },
    // v3 搜索 人才列表数据
    talentList: [],
    dynamic: {},
    feedList: [],
    currentTab: CURRENT_TAB.talent,
    currentDynamicCategory: '16',
    dynamicCategoryMap: {},
    // filter 多选框
    checkboxGroup: [],
    dynamicTabs: [],
  },
  reducers: {
    setSid(state, { payload }) {
      return {
        ...state,
        sid: payload,
      }
    },
    setDynamicCategoryMap(state, { payload }) {
      const res = arrToJson(payload.data || [], ['post_param', 'event_types'])
      return {
        ...state,
        dynamicCategoryMap: res,
      }
    },
    setPaginationParam(state, { payload }) {
      return {
        ...state,
        paginationParam: payload,
      }
    },
    setCurrentDynamicCategory(state, { payload }) {
      return {
        ...state,
        paginationParam: {
          ...state.paginationParam,
          page: 1,
        },
        currentDynamicCategory: payload,
      }
    },
    setCurrentTab(state, { payload }) {
      return {
        ...state,
        paginationParam: {
          ...state.paginationParam,
          page: 1,
        },
        currentTab: payload,
      }
    },
    setDynamic(state, { payload }) {
      return {
        ...state,
        dynamic: payload,
      }
    },
    setCheckboxGroup(state, { payload }) {
      return {
        ...state,
        checkboxGroup: payload,
      }
    },
    setTalentList(state, { payload }) {
      return {
        ...state,
        talentList: [...payload],
      }
    },
    setFeedList(state, { payload }) {
      return {
        ...state,
        feedList: payload,
      }
    },
    setMappingTags(state, { payload }) {
      return {
        ...state,
        mappingTags: payload,
      }
    },
    setCurrCondition(state, { payload }) {
      return {
        ...state,
        currCondition: payload,
      }
    },
    setConditionPaginationParam(state, { payload }) {
      return {
        ...state,
        conditionPaginationParam: payload,
      }
    },
    setAnalysis(state, { payload }) {
      const data = R.mapObjIndexed((num, key, obj) =>
        R.filter((y) => y.count > 0 || y.count > '0')(obj[key])
      )(payload.data)

      return {
        ...state,
        analysis: data,
      }
    },
    setSearchParam(state, { payload }) {
      return {
        ...state,
        paginationParam: {
          ...state.paginationParam,
          page: 1,
        },
        searchParam: payload,
      }
    },
    setIsShowDataAnalysis(state, { payload }) {
      return {
        ...state,
        isShowDataAnalysis: payload,
      }
    },
    setCurrentCondictionId(state, { payload }) {
      return {
        ...state,
        currentConditionId: payload,
        conditionChangeNum: state.conditionChangeNum + 1,
      }
    },
    setConditionList(state, { payload }) {
      return {
        ...state,
        conditionList: payload,
      }
    },
    setConditionStat(state, { payload }) {
      return {
        ...state,
        conditionStat: payload,
      }
    },
    setEditCondition(state, { payload }) {
      return {
        ...state,
        editCondition: payload,
      }
    },
  },
  effects: {
    fetchData,
    fetchFeedList,
    fetchSwitch,
    *fetchDynamicTabs({ payload }, { call, put }) {
      const data = yield call(subscribe.fetchDynamicNavigator, payload)
      yield put({
        type: 'subscribe/setDynamicTabs',
        payload: data.data,
      })
      yield put({
        type: 'subscribe/setDynamicCategoryMap',
        payload: data.data,
      })
      return data.data
    },
    *fetchDynamicDetails({ payload }, { call, select }) {
      const { data } = yield call(subscribe.fetchDynamicDetails, {
        payload,
      })
      return data
    },
    *fetchDynamicDetailsByEventType({ payload }, { call }) {
      const { data } = yield call(
        subscribe.fetchDynamicDetailsByEventType,
        payload
      )
      return data
    },
    *addCondition({ payload }, { call }) {
      const data = yield call(subscribe.addCondition, payload)
      return data.data
    },
    *importSubscribes({ payload }, { call }) {
      const data = yield call(subscribe.importSubscribes, payload)
      return data.data
    },
    *modifyCondition({ payload }, { call }) {
      const data = yield call(subscribe.modifyCondition, payload)
      return data.data
    },
    *fetchConditionList({ payload }, { call, put }) {
      const data = yield call(subscribe.fetchConditionList, payload)
      yield put({
        type: 'subscribe/setConditionList',
        payload: R.pathOr([], ['data', 'data', 'list'], data),
      })
      yield put({
        type: 'subscribe/setCurrCondition',
        payload: R.pathOr({}, ['data', 'data', 'list', '0'], data),
      })
      if (payload) {
        yield put({
          type: 'subscribe/setConditionPaginationParam',
          payload: {
            ...payload,
            total: R.pathOr(
              0,
              ['data', 'data', 'subscribe_current_count'],
              data
            ),
          },
        })
      }
      return data.data
    },
    // eslint-disable-next-line
    *fetchConditionListMore({}, { call, put, select }) {
      const { conditionPaginationParam, conditionList } = yield select(
        R.path(['subscribe'])
      )
      const params = {
        page: conditionPaginationParam.page + 1,
        size: conditionPaginationParam.size,
      }
      const data = yield call(subscribe.fetchConditionList, params)
      yield put({
        type: 'subscribe/setConditionList',
        payload: R.concat(
          conditionList,
          R.pathOr([], ['data', 'data', 'list'], data)
        ),
      })
      yield put({
        type: 'subscribe/setConditionPaginationParam',
        payload: {
          ...conditionPaginationParam,
          total: R.pathOr(0, ['data', 'data', 'subscribe_current_count'], data),
          page: R.pathOr(0, ['page'], params),
        },
      })
      return data.data
    },
    *fetchConditionDetail({ payload }, { call }) {
      const data = yield call(subscribe.fetchConditionDetail, payload)
      return data.data
    },
    *deleteCondition({ payload }, { call }) {
      const data = yield call(subscribe.deleteCondition, payload)
      return data.data
    },
    *fetchStat({ payload }, { call, put }) {
      const data = yield call(subscribe.fetchStat, payload)
      yield put({
        type: 'subscribe/setConditionStat',
        payload: R.pathOr([], ['data', 'data'], data),
      })
      return data.data
    },
  },
}
