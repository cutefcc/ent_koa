import request from 'utils/request'

export function fetch(query) {
  return request(`/api/ent/talent/record`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchNew(query) {
  return request(`/api/ent/talent/pool`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function add(payload) {
  return request('/api/ent/talent/v1/add', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchOpportunityList(query) {
  return request(`/api/ent/talent/opportunity`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchFilterOptions(query) {
  return request(`/api/ent/talent/pool/filter_options`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 第一版人才库需要的数据，等第一版人才库下线之后，就可以删除了
export function fetchStatic(query) {
  return request(`/api/ent/talent/pool/static`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchAmountTrend(query) {
  return request(`/api/ent/talent/pool/amount_trend`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchContributionList(query) {
  return request(`/api/ent/talent/pool/contribution_list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchNavigator(query) {
  return request(`/api/ent/talent/pool/enterprise/navigator`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchStat(query) {
  return request(`/api/ent/talent/pool/enterprise/stat`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function addGroup(query) {
  return request(`/api/ent/talent/pool/enterprise/group/add`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function modifyGroup(query) {
  return request(`/api/ent/talent/pool/enterprise/group/modify`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function deleteGroup(query) {
  return request(`/api/ent/talent/pool/enterprise/group/delete`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchGroups(query) {
  return request(`/api/ent/talent/pool/enterprise/group/list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchGroupsByUid(query) {
  return request(`/api/ent/talent/pool/group/fetch_by_uid`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function addTalents(query) {
  return request(`/api/ent/talent/pool/enterprise/group/talents/add`, {
    method: 'POST',
    query: {
      // ...query,
      channel: 'www',
      version: '1.0.0',
    },
    body: query,
  })
}

export function search(query) {
  return request(`/api/ent/talent/pool/search`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function searchV2(body) {
  return request(`/api/ent/talent/pool/search_v2`, {
    method: 'POST',
    body,
    query: {
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function addCompanyGroup(query) {
  return request(`/api/ent/talent/pool/enterprise/attention/add`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function modifyCompanyGroup(query) {
  return request(`/api/ent/talent/pool/enterprise/attention/modify`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function deleteCompanyGroup(query) {
  return request(`/api/ent/talent/pool/enterprise/attention/delete`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchCompanyGroups(query) {
  return request(`/api/ent/talent/pool/enterprise/attention/list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchActivityList(query) {
  return request(`/api/ent/talent/pool/enterprise/activity/list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchAnalysis(body) {
  return request(`/api/ent/talent/pool/search/analysis`, {
    method: 'POST',
    body,
    query: {
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchContribution(query) {
  return request(`/api/ent/talent/board/contribution`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchDashboard(body) {
  return request(`/api/ent/company/dynamic/search`, {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
    },
    body,
  })
}

export function fetchGrownTrendService(query) {
  return request(`/api/ent/talent/board/growth/trend`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchSourceDistributionService(query) {
  return request(`/api/ent/talent/board/source/distribution`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchExtraOptions(query) {
  return request(`/api/ent/talent/search/options`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function setSuitable(query) {
  return request(`/api/ent/talent/op/state/suitable`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function setUnSuitable(query) {
  return request(`/api/ent/talent/op/state/unsuitable`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchDynamicDetails(query) {
  return request(` /api/ent/company/dynamic/detail`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
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
