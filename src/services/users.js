import request from 'utils/request'

export function find(payload) {
  return request('/api/ent/user/find/workmate', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function updateConfig(payload) {
  return request('/api/ent/user/update/config', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function login(payload) {
  return request('/user/v3/login', {
    method: 'POST',
    query: {
      account: payload.phone,
      channel: 'www',
    },
    body: {
      password: payload.password,
    },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}
