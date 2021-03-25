import request from 'utils/request'

const commonQuery = {
  version: '4.0.0',
  ver_code: 'web_1',
  channel: 'www',
  push_permit: 1,
}

export function fetchDialog(query) {
  const url =
    window.location.host === 'localhost'
      ? '/api/get_dialog'
      : 'https://apn.maimai.cn/msg/v31/get_dialog'
  return request(url, {
    query: {
      ...commonQuery,
      ...query,
      hint: 1,
    },
  })
}

export function sendMessage(query) {
  const url =
    window.location.host === 'localhost'
      ? '/api/add_dialog'
      : 'https://apn.maimai.cn/msg/v3/add_dialogue'
  return request(url, {
    method: 'POST',
    query: {
      ...commonQuery,
      ...query,
    },
    body: {
      query,
    },
  })
}

export function fetchMsgDialog(query) {
  const url =
    window.location.host === 'localhost'
      ? '/api/get_msg_dlg'
      : 'https://apn.maimai.cn/msg/v31/get_msg_dlg'
  return request(url, {
    query: {
      ...commonQuery,
      ...query,
    },
  })
}

export function clearBadge(query) {
  const url =
    window.location.host === 'localhost'
      ? '/api/clear_badge'
      : 'https://apn.maimai.cn/msg/v3/clear_badge'
  return request(url, {
    query: {
      ...commonQuery,
      ...query,
    },
  })
}

export function fetchUnrmsg(query) {
  const url =
    window.location.host === 'localhost'
      ? '/api/get_unrmsg'
      : 'https://apn.maimai.cn/msg/v31/get_unrmsg'
  return request(url, {
    query: {
      ...commonQuery,
      ...query,
    },
  })
}

export function fetchMyMessages(query) {
  const url =
    window.location.host === 'localhost'
      ? '/api/my_messages'
      : 'https://apn.maimai.cn/msg/v31/my_messages'
  return request(url, {
    query: {
      ...commonQuery,
      ...query,
    },
  })
}

export function getFile(query) {
  const url =
    window.location.host === 'localhost'
      ? '/api/getFile'
      : 'https://open.taou.com/maimai/msg/v4/getfile'
  return request(url, {
    query: {
      ...commonQuery,
      ...query,
    },
  })
}
