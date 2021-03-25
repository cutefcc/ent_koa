import request from 'utils/request'
import { RIGHT_SOURCE } from 'constants/resume'
import * as R from 'ramda'

export function fetch(payload) {
  return request('/api/ent/channel/list', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchTalents(payload) {
  return request('/api/ent/channel/talents', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function send(payload) {
  return request('/api/ent/channel/direct/send', {
    query: {
      ...payload,
      source: R.propOr(
        -1,
        'id',
        RIGHT_SOURCE.find(R.propEq('name', payload.source))
      ),
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchUnavailableTalents(payload) {
  return request('/api/ent/channel/talents/out', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchStat(payload) {
  return request('/api/ent/channel/stat', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
