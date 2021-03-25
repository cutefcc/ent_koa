import request from 'utils/request'

export function fetch(payload) {
  return request('/api/ent/talent/data/map', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}
