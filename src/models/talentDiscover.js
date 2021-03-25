/* eslint-disable max-lines */
import * as talentDiscover from 'services/talentDiscover'
import * as globalService from 'services/global'
import {
  CURRENT_TAB,
  INIT_ADVANCE_SEARCH,
  EVENETS_NAME_MAP,
  TABTYPEMAP,
} from 'constants/talentDiscover'
import {
  replaceCompanySpecialCharacter,
  GUID,
  arrToJson,
  appendTalentsList,
  dispatchGlobalMask,
} from 'utils'
import * as R from 'ramda'

const searchFields = [
  'cities',
  'companys',
  'degrees',
  'positions',
  'professions',
  'provinces',
  'query',
  'schools',
  'worktimes',
]

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

function checkConditionIsEmpty(currentGroup, advancedSearch) {
  return (
    R.isEmpty(currentGroup) &&
    R.all(R.isEmpty, Object.values(R.pickAll(searchFields, advancedSearch)))
  )
}

function getDynamicParam(data, payload) {
  const {
    currentGroup,
    advancedSearch,
    filter,
    paginationParam,
    currentDynamicCategory,
    isConditionEmpty,
  } = data
  // const conditionIsEmpty = checkConditionIsEmpty(currentGroup, advancedSearch)
  const param = {
    search: {
      ...formatAdvancedSearch(advancedSearch),
      ...filter,
      ...paginationParam,
      page: paginationParam.page - 1,
      event_types: currentDynamicCategory,
      ...payload,
    },
    ...(isConditionEmpty
      ? { sources: [{ talent_source: 0 }] }
      : R.pathOr({}, ['post_param'], currentGroup)),
  }
  return param
}

// eslint-disable-next-line max-statements
function* fetchFeedList(payload, { call, put, select }) {
  const {
    currentGroup,
    advancedSearch,
    filter,
    paginationParam,
    sortby,
    currentTab,
    isConditionEmpty,
    sid,
  } = yield select(R.path(['talentDiscover']))
  const { currentUser } = yield select(R.path(['global']))
  const { isNewSid } = payload
  let newSid = ''
  // a new sid is needed when isNewSid = undefined(true)
  if (isNewSid !== false) {
    newSid = GUID()
    yield put({
      type: 'talentDiscover/setSid',
      payload: newSid,
    })
  }
  const param = {
    search: {
      ...formatAdvancedSearch(advancedSearch),
      ...filter,
      ...paginationParam,
      page: paginationParam.page - 1,
      sortby,
      // ab实验
      is_exclude_low_user: R.pathOr(
        0,
        ['abtest', 'jobs_ent_search_filter_low'],
        currentUser
      ),
      sid: newSid || sid,
      sessionid: newSid || sid,
    },
    ...(isConditionEmpty
      ? { sources: [{ talent_source: 0 }] }
      : R.pathOr({}, ['post_param'], currentGroup)),
  }
  if (payload.need_update_cache_time && param.search.page === 0) {
    param.search.need_update_cache_time = 1
  }
  trackEvents(EVENETS_NAME_MAP.discover_search, {
    param: JSON.stringify({
      search: param.search,
      current_group: currentGroup,
    }),
    sid: newSid || sid,
    type: TABTYPEMAP[currentTab],
  })
  // const isVersion3 = R.pathOr(null, ['data_version'], payload) === '3.0'
  const isMapping = R.pathOr(null, ['search_type'], payload) === 'mapping'
  // 空条件展示空状态
  if (isConditionEmpty) {
    yield put({
      type: 'talentDiscover/setTalentList',
      payload: [],
    })
    yield put({
      type: 'talentDiscover/setDynamic',
      payload: {},
    })
    yield put({
      type: 'talentDiscover/setFeedList',
      payload: [],
    })
    yield put({
      type: 'talentDiscover/setPaginationParam',
      payload: {
        ...paginationParam,
        total: 0,
      },
    })
    return
  }
  const companyscope = R.pathOr(0, ['search', 'companyscope'], param)
  const companys = R.pathOr('', ['search', 'companys'], param)
  // todo mapping的字段和后端协商 放一个字段里面，删除时就只删一个
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
    if (companyscope === 0) {
      param.search.allcompanies = companys
    }
    if (companyscope === 1) {
      param.search.companies = companys
    }
    if (companyscope === 2) {
      param.search.excompanies = companys
    }
    yield put({
      type: 'talentDiscover/setMappingTags',
      payload: [],
    })
  } else {
    if (companyscope === 0) {
      param.search.allcompanies = companys
    }
    if (companyscope === 1) {
      param.search.companies = companys
    }
    if (companyscope === 2) {
      param.search.excompanies = companys
    }
  }
  const { data } = yield call(talentDiscover.fetchFeedList, param)
  yield put({
    type: 'talentDiscover/setFeedList',
    payload: R.pathOr([], ['data', 'list'], data),
  })
  yield put({
    type: 'talentDiscover/setPaginationParam',
    payload: {
      ...paginationParam,
      total: R.pathOr(0, ['data', 'total'], data),
    },
  })
  return data
}

function* fetchExtendData({ payload }, { call, put, select }) {
  const { to_uids } = payload
  let { talentList } = yield select(R.path(['talentDiscover']))
  let extendData = {}

  try {
    extendData = yield call(globalService.fetchExtendData, { to_uids })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }

  const extraInfo = R.pathOr({}, ['data', 'data', 'dict'], extendData)

  talentList.forEach((item) => {
    if (extraInfo[item.id]) {
      // eslint-disable-next-line no-param-reassign
      Object.assign(item, {}, extraInfo[item.id])
    }
  })

  talentList = yield dispatchGlobalMask(talentList, put)

  yield put({
    type: 'talentDiscover/setTalentList',
    payload: [...talentList],
  })
}

function* fetchExtendDataNew({ payload }, { call, put, select, all }) {
  const { to_uids } = payload
  let { talentList } = yield select(R.path(['talentDiscover']))
  let extendData = {}
  let virtualPhoneData = {}
  let contactBtn = {}

  try {
    ;({ extendData, virtualPhoneData, contactBtn } = yield all({
      extendData: call(globalService.fetchExtendDataNew, { to_uids }),
      virtualPhoneData: call(globalService.fetchVirtualPhone, { to_uids }),
      contactBtn: call(talentDiscover.fetchTalentListContactBtn, { to_uids }),
    }))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }
  const extraInfo = R.pathOr({}, ['data', 'data', 'extend', 'dict'], extendData)
  const latestDynamic = R.pathOr(
    {},
    ['data', 'data', 'dynamic', 'dict'],
    extendData
  )
  const contactBtnData = R.pathOr({}, ['data', 'contact_btn_types'], contactBtn)
  let virtualPhoneObj = {}
  R.pathOr({}, ['data', 'data'], virtualPhoneData).forEach((item) => {
    virtualPhoneObj = Object.assign(virtualPhoneObj, item)
  })
  talentList.forEach((item) => {
    if (extraInfo[item.id]) {
      Object.assign(item, {}, extraInfo[item.id])
    }
    if (latestDynamic[item.id]) {
      Object.assign(item, { latestDynamic: latestDynamic[item.id] })
    }
    if (virtualPhoneObj[item.id]) {
      Object.assign(item, {}, virtualPhoneObj[item.id])
    }
    if (contactBtnData[item.id]) {
      Object.assign(
        item,
        {},
        { recent_dc_chat: contactBtnData[item.id] === 7 ? true : false }
      )
    }
  })

  talentList = yield dispatchGlobalMask(talentList, put)

  yield put({
    type: 'talentDiscover/setTalentList',
    payload: [...talentList],
  })
}

function* fetchDynamicData({ payload }, { call, put, select }) {
  const { currentGroup, isConditionEmpty, talentList } = yield select(
    R.path(['talentDiscover'])
  )
  const { to_uids } = payload
  const fetchDynamicAndNumParams = {
    query: {
      to_uids,
      channel: 'www',
      version: '1.0.0',
      version_type: 2,
    },
    param: {
      ...(isConditionEmpty
        ? { sources: [{ talent_source: 0 }] }
        : R.pathOr({}, ['post_param'], currentGroup)),
    },
  }

  let latestDynamic = {}
  try {
    const dynamicData = yield call(
      talentDiscover.fetchLatestDynamicAndNumNew,
      fetchDynamicAndNumParams
    )
    latestDynamic = R.propOr({}, 'data', dynamicData)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }

  const latestDynamicLists = R.pathOr({}, ['data', 'dict'], latestDynamic)
  talentList.forEach((item) => {
    if (latestDynamicLists[item.id]) {
      // eslint-disable-next-line no-param-reassign
      item.latestDynamic = latestDynamicLists[item.id]
    }
  })

  yield put({
    type: 'talentDiscover/setTalentList',
    payload: talentList,
  })
}

function* fetchAnalysis(payload, { call, put, select }) {
  const { currentGroup, advancedSearch, filter } = yield select(
    R.path(['talentDiscover'])
  )
  if (R.isEmpty(currentGroup)) {
    return {}
  }
  const param = {
    filter: {},
    search: {
      ...formatAdvancedSearch(advancedSearch),
      ...filter,
      ...R.pathOr({}, ['post_param'], currentGroup),
    },
  }
  const data = yield call(talentDiscover.fetchAnalysis, param)
  yield put({
    type: 'talentDiscover/setAnalysis',
    payload: data.data,
  })
  return data.data
}

function* fetchDynamicHook({ payload }, { call, put, select }) {
  const stateData = yield select(R.path(['talentDiscover']))
  const { currentGroup, currentTab, sid } = stateData

  /**
   * TODO: this is temporary logic, when back-end realize Long-range program, remove it
   * if current group is "不合适", do not fetch data
   */
  if (currentGroup && currentGroup.key === 'other') {
    yield put({
      type: 'talentDiscover/setDynamicHook',
      payload: {
        param: [],
      },
    })
    return
  }

  const param = getDynamicParam(stateData, payload)

  param.search.page = 0
  param.search.size = 3

  // const param = {
  //   search: {
  //     page: 0,
  //     size: 20,
  //     ...formatAdvancedSearch(advancedSearch),
  //     event_types: currentDynamicCategory,
  //     ...filter,
  //   },
  //   ...R.pathOr({}, ['post_param'], currentGroup),
  // }

  trackEvents(EVENETS_NAME_MAP.dynamic_search, {
    param: JSON.stringify({
      search: param.search,
      current_group: currentGroup,
    }),
    sid,
    type: TABTYPEMAP[currentTab],
  })

  const { data } = yield call(talentDiscover.fetchDynamic, param)
  yield put({
    type: 'talentDiscover/setDynamicHook',
    payload: data.data,
  })
  // return data.data
}

// eslint-disable-next-line max-statements
function* fetchTalentList(payload, { call, put, select }) {
  const {
    currentGroup,
    advancedSearch,
    filter,
    paginationParam,
    sortby,
    currentTab,
    isConditionEmpty,
    sid,
  } = yield select(R.path(['talentDiscover']))
  const { currentUser, polarisVariables } = yield select(R.path(['global']))
  const { isNewSid } = payload
  let newSid = ''
  // a new sid is needed when isNewSid = undefined(true)
  if (isNewSid !== false) {
    newSid = GUID()
    yield put({
      type: 'talentDiscover/setSid',
      payload: newSid,
    })
  }
  const param = {
    search: {
      ...formatAdvancedSearch(advancedSearch),
      ...filter,
      ...paginationParam,
      page: paginationParam.page - 1,
      sortby,
      // ab实验
      is_exclude_low_user: R.pathOr(
        0,
        ['abtest', 'jobs_ent_search_filter_low'],
        currentUser
      ),
      sid: newSid || sid,
      sessionid: newSid || sid,
    },
    ...(isConditionEmpty
      ? { sources: [{ talent_source: 0 }] }
      : R.pathOr({}, ['post_param'], currentGroup)),
  }
  if (payload.need_update_cache_time && param.search.page === 0) {
    param.search.need_update_cache_time = 1
  }
  trackEvents(EVENETS_NAME_MAP.discover_search, {
    param: JSON.stringify({
      search: param.search,
      current_group: currentGroup,
    }),
    sid: newSid || sid,
    type: TABTYPEMAP[currentTab],
  })
  const isVersion3 = R.pathOr(null, ['data_version'], payload) === '3.0'
  const isMapping = R.pathOr(null, ['search_type'], payload) === 'mapping'
  if (isVersion3) {
    // 空条件展示空状态
    if (isConditionEmpty) {
      yield put({
        type: 'talentDiscover/setTalentList',
        payload: [],
      })
      yield put({
        type: 'talentDiscover/setDynamic',
        payload: {},
      })
      yield put({
        type: 'talentDiscover/setPaginationParam',
        payload: {
          ...paginationParam,
          total: 0,
          total_match: 0,
        },
      })
      return
    }
    const companyscope = R.pathOr(0, ['search', 'companyscope'], param)
    const companys = R.pathOr('', ['search', 'companys'], param)
    // todo mapping的字段和后端协商 放一个字段里面，删除时就只删一个
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
      if (companyscope === 0) {
        param.search.allcompanies = companys
      }
      if (companyscope === 1) {
        param.search.companies = companys
      }
      if (companyscope === 2) {
        param.search.excompanies = companys
      }
      yield put({
        type: 'talentDiscover/setMappingTags',
        payload: [],
      })
    } else {
      if (companyscope === 0) {
        param.search.allcompanies = companys
      }
      if (companyscope === 1) {
        param.search.companies = companys
      }
      if (companyscope === 2) {
        param.search.excompanies = companys
      }
    }
    delete param.search.companys
  }
  // 先改v3的搜索，后续切换到v2
  let data = {}
  const search_basic_v3_switch = R.pathOr(
    'a',
    ['search_basic_v3_switch'],
    polarisVariables
  )
  if (isVersion3 && search_basic_v3_switch === 'b') {
    const { data: basicDataList } = yield call(
      talentDiscover.fetchTalentListBasic,
      param
    )
    data = basicDataList
  } else {
    const { data: searchList } = yield call(globalService.fetchUrl, {
      url: R.pathOr(
        `/api/ent/discover/search${isVersion3 ? '?data_version=3.0' : ''}`,
        ['url'],
        currentGroup
      ),
      param,
      method: 'POST',
    })
    data = searchList
  }
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
    param: {
      ...(isConditionEmpty
        ? { sources: [{ talent_source: 0 }] }
        : R.pathOr({}, ['post_param'], currentGroup)),
    },
  }

  // TODO 获取最新动态，这部分最好能独立出去,否则会影响整体获取数据的进度  @liuhao
  let latestDynamic = {}
  if (!isVersion3) {
    try {
      const dynamicData = yield call(
        isVersion3
          ? talentDiscover.fetchLatestDynamicAndNumNew
          : talentDiscover.fetchLatestDynamicAndNum,
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
  }
  yield put({
    type: 'talentDiscover/setTalentList',
    payload: R.pathOr([], ['data', 'list'], data),
  })
  yield put({
    type: 'talentDiscover/setHighLight',
    payload: R.pathOr([], ['data', 'segment_words'], data),
  })

  // if (toUids) {
  //   yield appendTalentsList(call(globalService.fetchExtendData, { to_uids: toUids }), talentLists, put);
  // }
  yield put({
    type: 'talentDiscover/setPaginationParam',
    payload: {
      ...paginationParam,
      total: R.pathOr(0, ['data', 'total'], data),
      total_match: R.pathOr(0, ['data', 'total_match'], data),
    },
  })
  return data
}
function* fetchMappingData(payload, { call, put, select }) {
  const { advancedSearch, isConditionEmpty } = yield select(
    R.path(['talentDiscover'])
  )
  if (isConditionEmpty) {
    yield put({
      type: 'talentDiscover/setAnalysis',
      payload: [],
    })
    yield put({
      type: 'talentDiscover/setMappingTags',
      payload: [],
    })
    return
  }
  const isMapping = R.pathOr(null, ['search_type'], payload) === 'mapping'
  const param = {
    search: {
      ...formatAdvancedSearch(advancedSearch),
    },
  }
  const sortby = Number(R.pathOr(0, ['search', 'sortby'], param))
  const companyscope = R.pathOr(0, ['search', 'companyscope'], param)
  const companys = R.pathOr('', ['search', 'companys'], param)
  param.search.sortby = sortby
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
  } else {
    if (companyscope === 0) {
      param.search.allcompanies = companys
    }
    if (companyscope === 1) {
      param.search.companies = companys
    }
    if (companyscope === 2) {
      param.search.excompanies = companys
    }
  }

  const data = yield call(talentDiscover.fetchMappingData, param)
  yield put({
    type: 'talentDiscover/setAnalysis',
    payload: data.data,
  })
}
// eslint-disable-next-line max-statements
function* fetchDynamic(payload, { call, put, select }) {
  const stateData = yield select(R.path(['talentDiscover']))
  const {
    currentGroup,
    paginationParam,
    currentTab,
    sid,
    advancedSearch,
  } = stateData
  const conditionIsEmpty = checkConditionIsEmpty(currentGroup, advancedSearch)
  /**
   * TODO: this is temporary logic, when back-end realize Long-range program, remove it
   * if current group is "不合适", do not fetch data
   */
  if (currentGroup && currentGroup.key === 'other') {
    yield put({
      type: 'talentDiscover/setDynamic',
      payload: {
        param: [],
      },
    })
    yield put({
      type: 'talentDiscover/setPaginationParam',
      payload: {
        ...paginationParam,
        total: 0,
      },
    })
    return
  }

  const param = getDynamicParam(stateData)

  trackEvents(EVENETS_NAME_MAP.dynamic_search, {
    param: JSON.stringify({
      search: param.search,
      current_group: currentGroup,
    }),
    sid,
    type: TABTYPEMAP[currentTab],
  })
  let data = null
  const isVersion3 = R.pathOr(null, ['data_version'], payload) === '3.0'
  const isMapping = R.pathOr(null, ['search_type'], payload) === 'mapping'
  if (isVersion3) {
    if (conditionIsEmpty) {
      yield put({
        type: 'talentDiscover/setDynamic',
        payload: {},
      })
      return
    }
    const sortby = Number(R.pathOr(0, ['search', 'sortby'], param))
    param.search.sortby = sortby
    const companyscope = R.pathOr(0, ['search', 'companyscope'], param)
    const companys = R.pathOr('', ['search', 'companys'], param)
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

    // const event_types = Number(R.pathOr(0, ['search', 'event_types'], param))
    // todo mapping的字段和后端协商 放一个字段里面，删除时就只删一个
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
        type: 'talentDiscover/setMappingTags',
        payload: [],
      })
      data = R.pathOr(
        null,
        ['data'],
        yield call(talentDiscover.fetchDynamicNew, param)
      )
    } else {
      data = R.pathOr(
        null,
        ['data'],
        yield call(talentDiscover.fetchDynamicNew, param)
      )
    }
  } else {
    data = R.pathOr(
      null,
      ['data'],
      yield call(talentDiscover.fetchDynamic, param)
    )
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
    param: {
      ...(conditionIsEmpty
        ? { sources: [{ talent_source: 0 }] }
        : R.pathOr({}, ['post_param'], currentGroup)),
    },
  }
  const { data: latestDynamic } = yield call(
    isVersion3
      ? talentDiscover.fetchLatestDynamicAndNumNew
      : talentDiscover.fetchLatestDynamicAndNum,
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
    type: 'talentDiscover/setDynamic',
    payload: {
      param: payload,
      ...R.propOr({}, 'data', data),
    },
  })
  yield put({
    type: 'talentDiscover/setPaginationParam',
    payload: {
      ...paginationParam,
      total: R.pathOr(0, ['data', 'total'], data),
    },
  })
  // return data.data
}

function* fetchData({ payload }, param) {
  const { select, put } = param
  const { currentTab, currentGroup } = yield select(R.path(['talentDiscover']))
  const { isNewSid, data_version, pagination } = payload
  let ret = {}

  if (currentGroup && currentGroup.action_code === 1) {
    yield put({
      type: 'talentDiscover/resetDatas',
    })
    return
  }

  // a new sid is needed when isNewSid = undefined(true)
  if (isNewSid !== false) {
    yield put({
      type: 'talentDiscover/setSid',
      payload: GUID(),
    })
  }
  // 判断逻辑太多, 后期最好push 人才银行只保留一个 版本, 不然会有很多问题
  if (data_version === '3.0') {
    if (currentTab === 'talent') {
      // 分页不请求 mapping
      if (pagination) {
        try {
          ret = [yield fetchTalentList(payload, param)]
        } catch (e) {
          // console.log(e)
        }
      } else {
        try {
          // ret = yield [
          //   fetchTalentList(payload, param),
          //   fetchMappingData(payload, param),
          // ]
          const ret0 = yield fetchTalentList(payload, param)
          const ret1 = yield fetchMappingData(payload, param)
          ret = [ret0, ret1]
        } catch (e) {
          // console.log(e)
        }
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
  } else {
    // 特殊处理人才银行V2打点
    if (payload.subId === null) {
      const state = { title: '', url: window.location.href }
      // eslint-disable-next-line no-restricted-globals
      history.pushState(state, '', 'discover')
      yield put({
        type: 'talentDiscover/setSubIdForV2',
        payload: '',
      })
    } else if (payload.subId !== undefined) {
      const state = { title: '', url: window.location.href }
      // eslint-disable-next-line no-restricted-globals
      history.pushState(state, '', 'subscribe')
      yield put({
        type: 'talentDiscover/setSubIdForV2',
        payload: payload.subId,
      })
    }

    if (currentTab === 'talent') {
      try {
        const ret0 = yield fetchTalentList(payload, param)
        const ret1 = yield fetchAnalysis({}, param)
        const ret2 = yield fetchDynamicHook({}, param)
        ret = [ret0, ret1, ret2]
      } catch (e) {
        // console.log(e)
      }
    } else if (currentTab === 'dynamic') {
      yield fetchDynamic(payload, param)
    }
  }

  return ret[0] && ret[0].data
}

export default {
  namespace: 'talentDiscover',
  state: {
    groupList: [],
    currentGroup: {},
    // 当前高级筛选项
    advancedSearch: { ...INIT_ADVANCE_SEARCH },
    // 当前过滤条件
    filter: {},
    // 分页参数
    paginationParam: {
      page: 1,
      size: 20,
    },
    // 当前tab talent: 人才列表 dynamic: 动态列表
    currentTab: CURRENT_TAB.talent,
    // 动态面板选中的分类
    currentDynamicCategory: '0',
    dynamicCategoryMap: {},
    // 动态钩子数据
    dynamicHook: {},
    // 动态面板数据
    dynamic: {},
    // 人才列表数据
    talentList: [],
    // 实名动态
    feedList: [],
    // 分析数据
    analysis: [],
    // 排序
    sortby: 0,
    // 当前全部筛选条件的唯一 id 标识
    sid: '',
    companyGroups: [],
    dynamicTabs: [],
    // banner广告数据
    bannerData: {},
    // 订阅方案
    subscriptionList: [],
    // 人才订阅Id——V2专用
    subscriptionIdForV2: '',
    bannerHeight: 0,
    // 意向回流快捷提醒
    strongIntentions: {},
    viewedStrong: [],
    groupModalVisible: false,
    // 是否展示搜索关键词
    showSearchValue: true,
    // 当前选择的条件是否为空，包括高级搜索和分组
    isConditionEmpty: true,
    // 是否展开数据分析
    isShowDataAnalysis: false,
    // mappingTags
    mappingTags: [],
    checkboxGroup: [],
    debouncingFlag: false,
    highLight: [],
  },
  reducers: {
    setHighLight(state, { payload }) {
      return {
        ...state,
        highLight: payload,
      }
    },
    setGroupList(state, { payload }) {
      return {
        ...state,
        groupList: payload.data,
      }
    },
    setCurrentGroup(state, { payload, trackParam }) {
      trackEvents(EVENETS_NAME_MAP.group_change, {
        type: TABTYPEMAP[state.currentTab],
        // current_group: JSON.stringify(payload),
        ...payload,
        ...trackParam,
      })
      const { advancedSearch } = state
      return {
        ...state,
        paginationParam: {
          ...state.paginationParam,
          page: 1,
        },
        currentGroup: payload,
        filter: {},
        isConditionEmpty: checkConditionIsEmpty(payload, advancedSearch),
      }
    },
    setAdvancedSearch(state, { payload }) {
      trackEvents(EVENETS_NAME_MAP.advanced_search, {
        type: TABTYPEMAP[state.currentTab],
        advanced_search: JSON.stringify(payload),
      })
      const { currentGroup } = state
      return {
        ...state,
        paginationParam: {
          ...state.paginationParam,
          page: 1,
        },
        advancedSearch: payload,
        isConditionEmpty: checkConditionIsEmpty(currentGroup, payload),
      }
    },
    setSearchDebouncingFlag(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    setFilter(state, { payload }) {
      trackEvents(EVENETS_NAME_MAP.streamline_filter_change, {
        type: TABTYPEMAP[state.currentTab],
        streamline_filter: payload,
      })
      return {
        ...state,
        paginationParam: {
          ...state.paginationParam,
          page: 1,
        },
        filter: payload,
      }
    },
    setCheckboxGroup(state, { payload }) {
      return {
        ...state,
        checkboxGroup: payload,
      }
    },
    setSort(state, { payload }) {
      trackEvents(EVENETS_NAME_MAP.sort_change, {
        type: TABTYPEMAP[state.currentTab],
        sort: payload,
      })
      return {
        ...state,
        paginationParam: {
          ...state.paginationParam,
          page: 1,
        },
        sortby: parseInt(payload, 10) || 0,
      }
    },
    setPaginationParam(state, { payload }) {
      trackEvents(EVENETS_NAME_MAP.discover_pagination_change, {
        type: TABTYPEMAP[state.currentTab],
        pagination: payload,
      })
      return {
        ...state,
        paginationParam: payload,
      }
    },
    setCurrentTab(state, { payload }) {
      trackEvents(EVENETS_NAME_MAP.discover_tab_change, {
        type: TABTYPEMAP[payload],
        current_tab: payload,
      })
      return {
        ...state,
        paginationParam: {
          ...state.paginationParam,
          page: 1,
        },
        currentTab: payload,
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
    setDynamicHook(state, { payload }) {
      return {
        ...state,
        dynamicHook: payload,
      }
    },
    setDynamic(state, { payload }) {
      return {
        ...state,
        dynamic: payload,
      }
    },
    setTalentList(state, { payload }) {
      return {
        ...state,
        talentList: payload,
      }
    },
    setFeedList(state, { payload }) {
      return {
        ...state,
        feedList: payload,
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
    setCompanyGroups: (state, { payload }) => {
      return {
        ...state,
        companyGroups: payload,
      }
    },
    resetDatas: (state) => {
      return {
        ...state,
        paginationParam: {
          page: 1,
          size: 20,
        },
        dynamicHook: {},
        dynamic: {},
        talentList: [],
        analysis: [],
      }
    },
    setDynamicTabs(state, { payload }) {
      return {
        ...state,
        dynamicTabs: payload.data,
      }
    },
    setDynamicCategoryMap(state, { payload }) {
      const res = arrToJson(payload.data || [], ['post_param', 'event_types'])
      return {
        ...state,
        dynamicCategoryMap: res,
      }
    },
    setSid(state, { payload }) {
      return {
        ...state,
        sid: payload,
      }
    },
    setSubIdForV2(state, { payload }) {
      return {
        ...state,
        subscriptionIdForV2: payload,
      }
    },
    setBannerData(state, { payload }) {
      return {
        ...state,
        bannerData: payload,
      }
    },
    setSubscriptionList(state, { payload }) {
      return {
        ...state,
        subscriptionList: payload,
      }
    },
    setViewedStrong(state, { payload }) {
      const viewed = [...state.viewedStrong, payload]
      return {
        ...state,
        viewedStrong: viewed,
      }
    },
    setGroupModalVisible(state, { payload }) {
      return {
        ...state,
        groupModalVisible: payload,
      }
    },
    setShowSearchValue(state, { payload }) {
      return {
        ...state,
        showSearchValue: payload,
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
  },
  effects: {
    fetchData,
    fetchFeedList,
    fetchAnalysis,
    fetchDynamicHook,
    *fetchDynamicTabs({ payload }, { call, put }) {
      const data = yield call(talentDiscover.fetchDynamicNavigator, payload)
      yield put({
        type: 'talentDiscover/setDynamicTabs',
        payload: data.data,
      })
      yield put({
        type: 'talentDiscover/setDynamicCategoryMap',
        payload: data.data,
      })
      return data.data
    },
    *fetchDynamicTabs3({ payload }, { call, put }) {
      const data = yield call(talentDiscover.fetchDynamicNavigator3, payload)
      yield put({
        type: 'talentDiscover/setDynamicTabs',
        payload: data.data,
      })
      yield put({
        type: 'talentDiscover/setDynamicCategoryMap',
        payload: data.data,
      })
      return data.data
    },
    *fetchGroups({ payload }, { call, put }) {
      const data = yield call(talentDiscover.fetchGroups, {
        ...payload,
        navigator_type: 3,
      })
      yield put({
        type: 'talentDiscover/setGroupList',
        payload: data.data,
      })
      return data.data
    },
    *fetchSubscription({ payload }, { call }) {
      const data = yield call(talentDiscover.fetchSubscription, payload)
      return data.data
    },
    *saveSubscription({ payload }, { call }) {
      const data = yield call(talentDiscover.saveSubscription, payload)
      return data.data
    },
    *updateSubscription({ payload }, { call }) {
      const data = yield call(talentDiscover.updateSubscription, payload)
      return data.data
    },
    *fetchDynamicDetails({ payload }, { call, select }) {
      const { currentGroup, isConditionEmpty } = yield select(
        R.path(['talentDiscover'])
      )

      const param = {
        // ...(conditionIsEmpty ? {} : R.pathOr({}, ['post_param'], currentGroup)),
        ...(isConditionEmpty
          ? { sources: [{ talent_source: 0 }] }
          : R.pathOr({}, ['post_param'], currentGroup)),
        // sources: [{talent_source: 0}],
      }
      const { data } = yield call(talentDiscover.fetchDynamicDetails, {
        param,
        payload,
      })
      return data
    },
    *fetchDynamicDetailsNew({ payload }, { call, select }) {
      const { currentGroup, isConditionEmpty } = yield select(
        R.path(['talentDiscover'])
      )

      const param = {
        // ...(conditionIsEmpty ? {} : R.pathOr({}, ['post_param'], currentGroup)),
        ...(isConditionEmpty
          ? { sources: [{ talent_source: 0 }] }
          : R.pathOr({}, ['post_param'], currentGroup)),
        // sources: [{talent_source: 0}],
      }
      const { data } = yield call(talentDiscover.fetchDynamicDetailsNew, {
        param,
        payload,
      })
      return data
    },
    *fetchDynamicDetailsByEventType({ payload }, { call }) {
      const { data } = yield call(
        talentDiscover.fetchDynamicDetailsByEventType,
        payload
      )
      return data
    },
    *fetchCompanyGroups({ payload }, { call, put }) {
      const { data } = yield call(talentDiscover.fetchCompanyGroups, payload)
      yield put({
        type: 'talentDiscover/setCompanyGroups',
        payload: R.pathOr([], ['data', 'list'], data),
      })
      return data
    },
    *addCompanyGroup({ payload }, { call }) {
      const data = yield call(talentDiscover.addCompanyGroup, payload)
      return data.data
    },
    *modifyCompanyGroup({ payload }, { call }) {
      const data = yield call(talentDiscover.modifyCompanyGroup, payload)
      return data.data
    },
    *deleteCompanyGroup({ payload }, { call }) {
      const data = yield call(talentDiscover.deleteCompanyGroup, payload)
      return data.data
    },
    *fetchExtraOptions({ payload }, { call }) {
      const { data } = yield call(talentDiscover.fetchExtraOptions, payload)
      return data
    },
    *fetchBannerData({ payload }, { call, put }) {
      const { data } = yield call(talentDiscover.fetchBanner, payload)
      yield put({
        type: 'talentDiscover/setBannerData',
        payload: data.data,
      })
      return data.data
    },
    *closeBanner({ payload }, { call }) {
      const { data } = yield call(talentDiscover.closeBanner, payload)
      return data.data
    },
    *recruiterBadge({ payload }, { call }) {
      const { data } = yield call(talentDiscover.recruiterBadge, payload)
      return data.data
    },
    *openSpecialAttention({ payload }, { call }) {
      const { data } = yield call(talentDiscover.openSpecialAttention, payload)
      return data
    },
    *closeSpecialAttention({ payload }, { call }) {
      const { data } = yield call(talentDiscover.closeSpecialAttention, payload)
      return data
    },
    *fetchHighQualityTalent({ payload }, { call }) {
      const { data } = yield call(
        talentDiscover.fetchHighQualityTalent,
        payload
      )
      return data
    },
    *fetchCareList({ payload }, { call }) {
      const { data } = yield call(talentDiscover.fetchCareList, payload)
      return data
    },
    *fetchTelBindCheck({ payload }, { call }) {
      const { data } = yield call(talentDiscover.fetchTelBindCheck, payload)
      return data
    },
    *fetchVirPhoneTelBind({ payload }, { call }) {
      const { data } = yield call(talentDiscover.fetchVirPhoneTelBind, payload)
      return data
    },
    *fetchGetVirtualTel({ payload }, { call }) {
      const { data } = yield call(talentDiscover.fetchGetVirtualTel, payload)
      return data
    },
    *fetchVirtualTelValidation({ payload }, { call }) {
      const { data } = yield call(
        talentDiscover.fetchVirtualTelValidation,
        payload
      )
      return data
    },
    *fetchVirtualGetLandline({ payload }, { call }) {
      const { data } = yield call(
        talentDiscover.fetchVirtualGetLandline,
        payload
      )
      return data
    },
    fetchExtendData,
    fetchExtendDataNew,
    fetchDynamicData,
  },
}
