import request from 'utils/request'
import { getUid } from 'utils'

const getAuth = () => {
  const u = getUid()

  return {
    u,
  }
}
export function addCondition(query) {
  return request(`/api/ent/subscribe/condition/add`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
      init_from: 1,
    },
  })
}

export function importSubscribes(query) {
  return request(`/api/ent/subscribe/condition/import`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchConditionList(query) {
  return request(`/api/ent/subscribe/condition/list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function modifyCondition(query) {
  return request(`/api/ent/subscribe/condition/modify`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
      modify_from: 1,
    },
  })
}

export function fetchFeedList(payload) {
  return request('/api/ent/feed/search', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '3.0',
      data_version: '3.0',
    },
    body: payload,
  })
}

export function fetchDynamicNavigator(query) {
  return request('/api/ent/dynamic/navigator', {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
      data_version: '3.0',
    },
  })
}

export function fetchDynamicDetails(payload) {
  return request(`/api/ent/dynamic/detail`, {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload.payload,
    },
    body: payload.param,
  })
}

export function fetchLatestDynamicAndNum(payload) {
  return request('/api/ent/dynamic/detail_count_and_recent', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload.query,
    },
    body: payload.param,
  })
}

export function fetchDynamicDetailsByEventType(query) {
  return request(` /api/ent/company/dynamic/detail_by_event_type`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchSwitch(payload) {
  const auth = getAuth()
  return request('/api/ent/subscribe/condition/up', {
    method: 'GET',
    query: {
      // channel: 'www',
      version: '1.0.0',
      ...auth,
      ...payload,
    },
  })
}

export function deleteCondition(query) {
  return request(`/api/ent/subscribe/condition/delete`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchConditionDetail(query) {
  return request(`/api/ent/subscribe/condition/detail`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchStat(query) {
  return request(`/api/ent/subscribe/stat`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 3.0分组导航-请求列表数据
export function fetchTalentsLists(payload) {
  return request('/api/ent/discover/search', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
      data_version: '3.0',
      subscribe_id: payload.search.subscribe_id,
    },
    body: payload,
  })
}

export function fetchMappingData(body) {
  return request(`/api/ent/discover/search/analysis`, {
    method: 'POST',
    body,
    query: {
      channel: 'www',
      version: '1.0.0',
      data_version: '3.0',
      subscribe_id: body.search.subscribe_id,
    },
  })
}

export function fetchDynamic(payload) {
  return request('/api/ent/dynamic/search', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
      data_version: '3.0',
      subscribe_id: payload.search.subscribe_id,
      update_time: payload.search.update_time,
    },
    body: payload,
  })
}
