import request from 'utils/request'
import { getUid } from 'utils'

const getAuth = () => {
  const u = getUid()

  return {
    u,
  }
}

export function fetchNotifications(payload) {
  const auth = getAuth()
  return request('/api/ent/subscribe/condition/set/notify', {
    method: 'GET',
    query: {
      // channel: 'www',
      version: '1.0.0',
      ...auth,
      ...payload,
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

export function fetchSubscribeList(payload) {
  const auth = getAuth()
  return request('/api/ent/subscribe/condition/list', {
    method: 'GET',
    query: {
      // channel: 'www',
      version: '1.0.0',
      ...auth,
      ...payload,
      // size: 20,
      data_version: '3.0',
      is_new_add: 1,
    },
  })
}

export function fetchTrendsData(payload) {
  const auth = getAuth()
  return request('/api/ent/talent/pool/v3/amount_trend', {
    method: 'GET',
    query: {
      // channel: 'www',
      version: '1.0.0',
      ...auth,
      ...payload,
    },
  })
}

export function clearBadge(payload) {
  const auth = getAuth()
  return request('/api/ent/subscribe/condition/badge/clear', {
    method: 'GET',
    query: {
      version: '1.0.0',
      ...auth,
      ...payload,
    },
  })
}
