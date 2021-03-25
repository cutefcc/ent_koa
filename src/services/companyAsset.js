import request from 'utils/request'

// 获取企业资产
export function fetch(query) {
  return request(`/api/ent/asset/company`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 添加子账号
export function add(payload) {
  return request('/api/ent/asset/company/add', {
    method: 'POST',
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}

// 解除子账号和 license 的绑定
export function del(payload) {
  return request('/api/ent/asset/company/del', {
    method: 'POST',
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}

// 回收点数
export function recycle(payload) {
  return request('/api/ent/asset/company/recycle', {
    method: 'POST',
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}

// 分配点数
export function assign(payload) {
  return request('/api/ent/asset/company/assign', {
    method: 'POST',
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}

// 获取交易明细
export function fetchDealRecord(payload) {
  return request('/api/ent/asset/company/record', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
