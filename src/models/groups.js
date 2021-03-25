import * as groups from 'services/groups'
import * as globalService from 'services/global'
import { GROUP_UPPER_LIMIT } from 'constants'
import { INIT_SEARCH_GROUP } from 'constants/groups'
import * as R from 'ramda'
import { CURRENT_TAB } from 'constants/talentDiscover'
import {
  getModuleName,
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
  const {
    currentGroup,
    searchParam,
    advanceParams,
    paginationParam,
    currentDynamicCategory,
    subGroup,
  } = data
  const sources = subGroup.post_param
    ? subGroup.post_param.sources
    : R.pathOr([], ['post_param', 'sources'], currentGroup)
  const param = {
    search: {
      ...formatAdvancedSearch(searchParam),
      ...formatAdvancedSearch(advanceParams),
      ...paginationParam,
      page: paginationParam.page - 1,
      event_types: currentDynamicCategory,
      ...payload,
    },
    sources,
  }
  return param
}
function* fetchMappingData(payload, { call, put, select }) {
  const { searchParam, currentGroup, subGroup, advanceParams } = yield select(
    R.path(['groups'])
  )
  const sources = subGroup.post_param
    ? subGroup.post_param.sources
    : R.pathOr([], ['post_param', 'sources'], currentGroup)
  const param = {
    search: {
      ...formatAdvancedSearch(searchParam),
      ...formatAdvancedSearch(advanceParams),
    },
    sources,
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

  const data = yield call(groups.fetchMappingData, param)
  yield put({
    type: 'groups/setAnalysis',
    payload: data.data,
  })
  return data.data
}

// eslint-disable-next-line max-statements
function* fetchTalentsLists(payload, { call, put, select }) {
  const {
    paginationParam,
    currentGroup,
    searchParam,
    subGroup,
    advanceParams,
    sid,
  } = yield select(R.path(['groups']))
  let newSid = ''
  const { isNewSid } = payload
  if (isNewSid !== false) {
    newSid = GUID()
    yield put({
      type: 'groups/setSid',
      payload: newSid,
    })
  }
  const sources = subGroup.post_param
    ? subGroup.post_param.sources
    : R.pathOr([], ['post_param', 'sources'], currentGroup)
  const param = {
    search: {
      ...searchParam,
      ...advanceParams,
      ...paginationParam,
      page: paginationParam.page - 1,
      sid: newSid || sid,
      sessionid: newSid || sid,
    },
    sources,
  }
  const companyscope = R.pathOr(0, ['search', 'companyscope'], param)
  const companys = R.pathOr('', ['search', 'companys'], param)
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

    delete param.search.companies
    delete param.search.excompanies
    delete param.search.allcompanies
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
  const { data } = yield call(groups.fetchTalentsLists, {
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
      groups.fetchLatestDynamicAndNum,
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
    type: 'groups/setTalentList',
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
    type: 'groups/setPaginationParam',
    payload: {
      ...paginationParam,
      total: R.pathOr(0, ['data', 'total'], data),
      total_match: R.pathOr(0, ['data', 'total_match'], data),
    },
  })
  return data.data
}

function* fetchFeedList(payload, { call, put, select }) {
  const {
    paginationParam,
    currentGroup,
    searchParam,
    subGroup,
    advanceParams,
  } = yield select(R.path(['groups']))
  const sid = GUID()
  const sources = subGroup.post_param
    ? subGroup.post_param.sources
    : R.pathOr([], ['post_param', 'sources'], currentGroup)
  const param = {
    search: {
      ...searchParam,
      ...advanceParams,
      ...paginationParam,
      page: paginationParam.page - 1,
      sid,
      sessionid: sid,
    },
    sources,
  }
  const companyscope = R.pathOr(0, ['search', 'companyscope'], param)
  const companys = R.pathOr('', ['search', 'companys'], param)
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

    delete param.search.companies
    delete param.search.excompanies
    delete param.search.allcompanies
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
  const { data } = yield call(groups.fetchFeedList, {
    ...param,
    ...payload,
  })

  yield put({
    type: 'groups/setFeedList',
    payload: R.pathOr([], ['data', 'list'], data),
  })

  yield put({
    type: 'groups/setPaginationParam',
    payload: {
      ...paginationParam,
      total: R.pathOr(0, ['data', 'total'], data),
      total_match: R.pathOr(0, ['data', 'total_match'], data),
    },
  })
  return data
}

// eslint-disable-next-line max-statements
function* fetchDynamic(payload, { call, put, select }) {
  const stateData = yield select(R.path(['groups']))
  const { paginationParam } = stateData
  const param = getDynamicParam(stateData)
  let data = null
  const companyscope = R.pathOr(0, ['search', 'companyscope'], param)
  const companys = R.pathOr('', ['search', 'companys'], param)
  const isMapping = R.pathOr(null, ['search_type'], payload) === 'mapping'
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
    yield put({
      type: 'groups/setMappingTags',
      payload: [],
    })
    data = R.pathOr(null, ['data'], yield call(groups.fetchDynamic, param))
  } else {
    data = R.pathOr(null, ['data'], yield call(groups.fetchDynamic, param))
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
    groups.fetchLatestDynamicAndNum,
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
    type: 'groups/setDynamic',
    payload: {
      param: payload,
      ...R.propOr({}, 'data', data),
    },
  })
  yield put({
    type: 'groups/setPaginationParam',
    payload: {
      ...paginationParam,
      total: R.pathOr(0, ['data', 'total'], data),
      total_match: R.pathOr(0, ['data', 'total_match'], data),
    },
  })
}

function* fetchData({ payload }, param) {
  const { select, put } = param
  const { currentTab } = yield select(R.path(['groups']))
  const { search_type, pagination } = payload
  const { currentUser } = yield select(R.path(['global']))
  const {
    currentGroup: { key: currentGroupKey },
  } = yield select(R.path(['groups']))
  const tlv = R.pathOr(2, ['talent_lib_version'], currentUser)
  if (
    tlv === 2 &&
    getModuleName() === 'groups' &&
    currentGroupKey === 'attention'
  ) {
    yield put({
      type: 'groups/setFeedList',
      payload: [],
    })
    yield put({
      type: 'groups/setFeedList',
      payload: [],
    })
    yield put({
      type: 'groups/setTalentList',
      payload: [],
    })
    yield put({
      type: 'groups/setDynamic',
      payload: {},
    })
    yield put({
      type: 'groups/setAnalysis',
      payload: [],
    })
    return
  }
  if (currentTab === 'talent') {
    if (pagination) {
      yield fetchTalentsLists(payload, param)
    } else {
      yield fetchTalentsLists(payload, param)
      yield fetchMappingData(payload, param)
    }
  }
  if (currentTab === 'dynamic') {
    if (pagination) {
      yield fetchDynamic(payload, param)
    } else {
      yield fetchDynamic(payload, param)
      yield fetchMappingData(payload, param)
    }
  }
  if (currentTab === 'realName') {
    if (pagination) {
      yield fetchFeedList(payload, param)
    } else {
      yield fetchFeedList(payload, param)
      yield fetchMappingData(payload, param)
    }
  }
}

export default {
  namespace: 'groups',
  state: {
    // 单条的发票详情 用于修改 和 详情页面
    list: [],
    // 企业分组数据，新增分组时展示用
    entGroups: [],
    entGroupMax: 20,
    // v3储备人才分类
    groupNav: [],
    currentGroup: {},
    subGroup: {},
    // v3 分页
    paginationParam: {
      page: 1,
      size: 20,
      total_match: 0,
    },
    dynamicCategoryMap: {},
    // v3 搜索 人才列表数据
    searchParam: { ...INIT_SEARCH_GROUP },
    talentList: [],
    dynamic: {},
    // 实名动态
    feedList: [],
    currentTab: CURRENT_TAB.talent,
    // 是否展开数据分析
    isShowDataAnalysis: false,
    // 分析数据
    analysis: [],
    // mappingTags
    mappingTags: [],
    advanceSearchModal: false,
    advanceParams: {},
    currentDynamicCategory: '16',
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
    setDynamicTabs(state, { payload }) {
      return {
        ...state,
        dynamicTabs: payload.data,
      }
    },
    setAdvanceParams(state, { payload }) {
      return {
        ...state,
        advanceParams: payload,
      }
    },
    setDynamicCategoryMap(state, { payload }) {
      const res = arrToJson(payload.data || [], ['post_param', 'event_types'])
      return {
        ...state,
        dynamicCategoryMap: res,
      }
    },
    setCheckboxGroup(state, { payload }) {
      return {
        ...state,
        checkboxGroup: payload,
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
    setDynamic(state, { payload }) {
      return {
        ...state,
        dynamic: payload,
      }
    },
    setAdvanceSearchModal(state, { payload }) {
      return {
        ...state,
        advanceSearchModal: payload,
      }
    },
    setIsShowDataAnalysis(state, { payload }) {
      return {
        ...state,
        isShowDataAnalysis: payload,
      }
    },
    setMappingTags(state, { payload }) {
      return {
        ...state,
        mappingTags: payload,
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
    setList(state, { payload: { data: list } }) {
      return {
        ...state,
        list,
      }
    },
    setEntGroups: (state, { payload }) => {
      return {
        ...state,
        entGroups: R.propOr([], 'list', payload),
        entGroupMax: R.propOr([], 'group_max', payload),
      }
    },
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
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
        feedList: [...payload],
      }
    },
    setSubGroup(state, { payload }) {
      return {
        ...state,
        subGroup: payload,
      }
    },
    setPaginationParam(state, { payload }) {
      return {
        ...state,
        paginationParam: payload,
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
  },
  effects: {
    fetchData,
    fetchDynamic,
    fetchFeedList,
    fetchTalentsLists,
    *fetchDynamicTabs({ payload }, { call, put }) {
      const data = yield call(groups.fetchDynamicNavigator, payload)
      yield put({
        type: 'groups/setDynamicTabs',
        payload: data.data,
      })
      yield put({
        type: 'groups/setDynamicCategoryMap',
        payload: data.data,
      })
      return data.data
    },
    *fetchDynamicDetails({ payload }, { call, select }) {
      const { data } = yield call(groups.fetchDynamicDetails, {
        payload,
      })
      return data
    },
    *fetchDynamicDetailsByEventType({ payload }, { call }) {
      const { data } = yield call(
        groups.fetchDynamicDetailsByEventType,
        payload
      )
      return data
    },
    *fetchNav({ payload }, { call, put, select }) {
      // const {currentGroup} = yield select(R.path(['groups']))
      const { data } = yield call(groups.fetchNav, {
        ...payload,
      })
      yield put({
        type: 'groups/setState',
        payload: {
          groupNav: [...data.data],
          // currentGroup: currentGroup.key ? currentGroup : data.data[0],
        },
      })
      return data.data
    },
    *fetch({ payload }, { call, put }) {
      //商业引导v3中个人分组数目的限制为100
      const { editionThree } = payload
      delete payload.editionThree
      const { data } = yield call(
        groups.fetch,
        editionThree === true
          ? {
              ...payload,
              size: 100,
              page: 0,
            }
          : {
              ...payload,
              size: GROUP_UPPER_LIMIT,
              page: 0,
            }
      )
      yield put({
        type: 'groups/setList',
        payload: data,
      })
      return data
    },
    *add({ payload }, { call }) {
      const data = yield call(groups.add, payload)
      return data.data
    },
    *delete({ payload }, { call }) {
      const data = yield call(groups.del, payload)
      return data.data
    },
    *edit({ payload }, { call }) {
      const data = yield call(groups.edit, payload)
      return data.data
    },
    *fetchTalents({ payload }, { call }) {
      const data = yield call(groups.fetchTalents, payload)
      return data.data
    },
    *removeTalent({ payload }, { call }) {
      const data = yield call(groups.removeTalent, payload)
      return data.data
    },
    *addTalent({ payload }, { call }) {
      const data = yield call(groups.addTalent, payload)
      return data.data
    },
    *fetchEntGroups({ payload }, { call, put }) {
      const { data } = yield call(groups.fetchEntGroups, payload)
      yield put({
        type: 'groups/setEntGroups',
        payload: data.data,
      })
      return data
    },
    *addEnt({ payload }, { call }) {
      const data = yield call(groups.addEnt, payload)
      return data.data
    },
    *modifyEnt({ payload }, { call }) {
      const data = yield call(groups.modifyEnt, payload)
      return data.data
    },
    *deleteEnt({ payload }, { call }) {
      const data = yield call(groups.deleteEnt, payload)
      return data.data
    },
    *fetchTalentGroups({ payload }, { call }) {
      const data = yield call(groups.fetchTalentGroups, payload)
      return data
    },
    *modifyTalentGroups({ payload }, { call }) {
      const data = yield call(groups.modifyTalentGroups, payload)
      return data
    },
    *batchModifyTalentGroups({ payload }, { call }) {
      const data = yield call(groups.batchModifyTalentGroups, payload)
      return data
    },
  },
}
