import request from 'utils/request'
import { getUid } from 'utils'

const getAuth = () => {
  const u = getUid()

  return {
    u,
  }
}

// 查询全部批量邀约
export function fetch(query) {
  return request('/api/ent/batch/invite/list', {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 商机沉淀
export function keepBusiness(query) {
  const auth = getAuth()
  return request('/jobs/submissionCorpApply', {
    query: {
      ...query,
      ...auth,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 发起批量邀约
export function add(payload) {
  return request('/api/ent/batch/invite/add', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
    },
    body: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

// 发起批量邀约预审
export function pre(payload) {
  return request('/api/ent/batch/invite/pre', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
    },
    body: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}
