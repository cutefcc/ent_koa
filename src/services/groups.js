import request from 'utils/request'

// 3.0请求分组导航
export function fetchNav(query) {
  return request(`/api/ent/talent/pool/v3/navigator`, {
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
    },
    body: payload,
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

export function fetchDynamicDetails(payload) {
  // return request(`/api/ent/company/dynamic/detail`, {
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

export function fetchDynamicDetailsByEventType(query) {
  return request(`/api/ent/company/dynamic/detail_by_event_type`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
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

export function fetchMappingData(body) {
  return request(`/api/ent/discover/search/analysis`, {
    method: 'POST',
    body,
    query: {
      channel: 'www',
      version: '1.0.0',
      data_version: '3.0',
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
    },
    body: payload,
  })
}

// 查询个人分组列表
export function fetch(query) {
  return request(`/api/ent/group/list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 添加个人分组
export function add(payload) {
  return request('/api/ent/group/add', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 删除个人分组
export function del(payload) {
  return request('/api/ent/group/delete', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 编辑个人分组
export function edit(payload) {
  return request('/api/ent/group/edit', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 从个人分组移除人才
export function removeTalent(payload) {
  return request('/api/ent/group/talents/remove', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 为个人分组添加人才
export function addTalent(payload) {
  return request('/api/ent/group/talents/add', {
    method: 'POST',
    query: {
      // ...payload,
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}

// 查询个人分组中的候选人
export function fetchTalents(payload) {
  return request('/api/ent/group/talents', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 查询企业分组列表
export function fetchEntGroups(query) {
  return request(`/api/ent/talent/pool/enterprise/group/list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function addEnt(query) {
  return request(`/api/ent/talent/pool/enterprise/group/add`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function modifyEnt(query) {
  return request(`/api/ent/talent/pool/enterprise/group/modify`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function deleteEnt(query) {
  return request(`/api/ent/talent/pool/enterprise/group/delete`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 查询人才所在分组
export function fetchTalentGroups(query) {
  return request(`/api/ent/talent_pool/group/list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
// 修改人才分组
export function modifyTalentGroups(query) {
  return request(`/api/ent/talent_pool/group_talent/modify`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
// 批量修改人才分组
export function batchModifyTalentGroups(query) {
  return request(`/api/ent/talent_pool/group_talent/add`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
