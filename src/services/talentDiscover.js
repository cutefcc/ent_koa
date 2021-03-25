import request from 'utils/request'
import { getUid } from 'utils'

const getAuth = () => {
  const u = getUid()

  return {
    u,
  }
}

// export function fetchGroups(payload) {
//   return request('/api/talent/channel/list', {
//     query: {
//       ...payload,
//       channel: 'www',
//       version: '1.0.0',
//       navigator_type: 3,
//     },
//   })
// }

export function fetchTalentList(payload) {
  return request('/api/ent/discover/search', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}

export function fetchTalentListBasic(payload) {
  return request('/api/ent/v3/search/basic', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}

export function fetchTalentListContactBtn(payload) {
  return request('/api/ent/v3/search/contact_btn', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
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

export function fetchGroups(payload) {
  return request('/api/ent/talent/pool/enterprise/navigator', {
    query: {
      ...payload,
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
    },
    body: payload,
  })
}

export function fetchDynamicNew(payload) {
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

export function fetchLatestDynamicAndNum(payload) {
  return request('/api/ent/company/dynamic/detail_count_and_recent', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload.query,
    },
    body: payload.param,
  })
}

export function fetchLatestDynamicAndNumNew(payload) {
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

export function fetchSubscription(payload) {
  return request('/api/ent/channel/list', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function saveSubscription(payload) {
  return request('/api/ent/channel/list', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function updateSubscription(payload) {
  return request('/api/ent/channel/list', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// export function fetchDynamicDetails(query) {
//   return request(` /api/ent/company/dynamic/detail`, {
//     query: {
//       ...query,
//       channel: 'www',
//       version: '1.0.0',
//     },
//   })
// }

export function fetchDynamicDetails(payload) {
  return request(` /api/ent/company/dynamic/detail`, {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload.payload,
    },
    body: payload.param,
  })
}

export function fetchDynamicDetailsNew(payload) {
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
  return request(` /api/ent/company/dynamic/detail_by_event_type`, {
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

export function fetchExtraOptions(query) {
  return request('/api/ent/talent/search/options', {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchDynamicNavigator(query) {
  return request('/api/ent/dynamic/navigator', {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchDynamicNavigator3(query) {
  return request('/api/ent/dynamic/navigator', {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
      data_version: '3.0',
    },
  })
}

// open 关注
export function openSpecialAttention(query) {
  return request('/api/ent/talent/pool/v3/special_attention', {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// open 关注
export function closeSpecialAttention(query) {
  return request('/api/ent/talent/pool/v3/cancel_special_attention', {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 请求banner相关数据
export function fetchBanner(query) {
  const auth = getAuth()
  return request('/sdk/jobs/company_invitation/getApplyEntryForTalentBlank', {
    query: {
      ...query,
      ...auth,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 关闭banner
export function closeBanner(query) {
  const auth = getAuth()
  return request('/sdk/jobs/company_invitation/closeEntryForTalentBlank', {
    query: {
      ...query,
      ...auth,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 岗位效果
export function recruiterBadge(query) {
  const auth = getAuth()
  return request('/api/ent/job/v3/recruiter_badge_info', {
    query: {
      ...query,
      ...auth,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 优质人才与高速成长型人才标签
export function fetchHighQualityTalent(query) {
  return request(`/api/ent/talent/tags`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// module_type: 1,  # 模块类型：1 特别关注，2 关注公司
export function fetchCareList(query) {
  return request(`/api/ent/talent/pool/v3/talent_list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 是否绑定过座机
export function fetchTelBindCheck(query) {
  return request(`/api/ent/reach/b/virtual/telephone/binding/check`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 绑定/修改座机号
export function fetchVirPhoneTelBind(query) {
  return request(`/api/ent/reach/b/virtual/telephone/bind`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 获取虚拟号
export function fetchGetVirtualTel(query) {
  return request(`/api/ent/reach/b/get/virtual/telephone`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 虚拟号是否过期
export function fetchVirtualTelValidation(query) {
  return request(`/api/ent/reach/b/virtual/telephone/validation/check`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 获取座机
export function fetchVirtualGetLandline(query) {
  return request(`/api/ent/reach/b/virtual/get/binding/telephone`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
