import request from 'utils/request'

export function directInvite(payload) {
  return request('/api/ent/right/direct/invite', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function enableDireactContact(payload) {
  return request('/api/ent/right/direct/contact/enable', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function enableDireactContactBatch(payload) {
  return request('/api/ent/right/direct/contact/batch', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function recycle(payload) {
  const amount = payload.count;
  return request('/api/ent/right/recycle', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
      amount,
    },
  })
}

export function askForPhone(payload) {
  return request('/api/ent/right/reach', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function sendTipForConnectByTelphone(payload) {
  return request('/api/ent/reach/b/get/c/info', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function aiCall(payload) {
  return request('/api/ent/right/calls', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function askForPhoneV2(payload) {
  return request('/api/ent/right/reach_final', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
