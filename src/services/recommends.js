import request from 'utils/request'

export function fetch(query) {
  return request(`/api/ent/discover/recommend`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchStat(query) {
  return request(`/api/ent/discover/recommend/stat`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
