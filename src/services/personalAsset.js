import * as R from 'ramda'
import request from 'utils/request'
import { RIGHT_SOURCE } from 'constants/resume'

// 获取企业资产
export function fetch(query) {
  return request(`/api/ent/asset/personal`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 获取交易明细
export function fetchDealRecord(payload) {
  return request('/api/ent/asset/personal/record', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function addFriend(payload) {
  return request('/api/ent/right/friend/add', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
      source: R.propOr(
        -1,
        'id',
        RIGHT_SOURCE.find(R.propEq('name', payload.source))
      ),
      fr: 'jobs_pc',
    },
  })
}

export function exchange(payload) {
  const amount = payload.count;
  return request('/api/ent/right/exchange', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
      amount,
    },
  })
}

export function fetchUsedRight(payload) {
  return request('/api/ent/right/used', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
