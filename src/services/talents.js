import request from 'utils/request'
// import {GUID} from 'utils'

export function fetch(query) {
  return request(`/api/ent/discover/search`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function searchV2(query) {
  return request(`/api/ent/discover/advanced/search`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
      // sessionid: GUID(),
    },
  })
}

export function fetchCompanyFansDetails(payload) {
  return request(`/api/ent/card/hover/fans`, {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

// 归档
export function archive(payload) {
  return request('/api/ent/recruit/v1/archive', {
    method: 'POST',
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}

// 修改状态
export function modifyState(payload) {
  return request('/api/ent/resumes/modify_state', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 获取推广的列表
export function fetchPromoteList(payload) {
  return request('/api/ent/discover/promote', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 获取profile
export function fetchProfile(payload) {
  return request('/api/ent/talent/profile', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 获取微简历
export function fetchMicroProfile(payload) {
  return request('/api/ent/talent/micro_profile', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchCoBrowser(payload) {
  return request('/api/ent/talent/pool/workmate/browse', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchCoContactor(payload) {
  return request('/api/ent/talent/pool/workmate/uh', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchRemarks(payload) {
  return request('/api/ent/remark/workmate/list', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function addRemark(payload) {
  return request('/api/ent/remark/add', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchInterestedList(payload) {
  return request('/api/ent/discover/interest', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 期望
export function fetchExpect(query) {
  return request(`/api/ent/talent/job_preference`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 有过意向
export function fetchHasIntention(query) {
  return request(`/api/ent/talent/has_intention`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 沟通状态
export function fetchContact(query) {
  return request(`/api/ent/talent/contact_status`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 点击profile、极速联系、发消息、立即沟通 PC端招聘搜索付费触点
export function fetchListUserLimit(query) {
  return request(`/api/ent/user/limit`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 候选人动态明细
export function fetchDynamicDetail(query) {
  return request(`/api/ent/dynamic/detail`, {
    query: {
      page: 0,
      size: 200,
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 简历投递情况
export function fetchResumeDelivery(query) {
  return request(`/api/ent/card/hover/delivery`, {
    query: {
      page: 0,
      size: 5,
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
