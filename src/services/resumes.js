import * as R from 'ramda'
import request from 'utils/request'
import { RIGHT_SOURCE } from 'constants/resume'
import { getCookie } from 'tiny-cookie'

export function fetch(query) {
  return request(`/api/ent/recruit/v1/list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchResumeList(query) {
  return request(`/api/ent/resumes/record`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchResumeListV2(query) {
  return request(`/api/ent/resumes/mine/record`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function sendMessage(body) {
  return request(`/api/ent/right/connect/send`, {
    method: 'POST',
    query: {
      ...body,
      channel: 'www',
      version: '1.0.0',
      source: R.propOr(
        -1,
        'id',
        RIGHT_SOURCE.find(R.propEq('name', body.source))
      ),
    },
    body,
  })
}

export function sendDirectMessage(body) {
  const param = {
    ...body,
    channel: 'www',
    version: '1.0.0',
    source: R.propOr(
      -1,
      'id',
      RIGHT_SOURCE.find(R.propEq('name', body.source))
    ),
  }
  return request(`/api/ent/right/connect/direct/send`, {
    method: 'POST',
    query: param,
    body: param,
  })
}

export function complete(body) {
  return request(`/api/ent/recruit/v1/complete`, {
    method: 'POST',
    query: {
      ...body,
      channel: 'www',
      version: '1.0.0',
    },
    body,
  })
}

// 淘汰
export function elimination(body) {
  return request('/api/ent/recruit/v1/elimination', {
    method: 'POST',
    query: {
      ...body,
      channel: 'www',
      version: '1.0.0',
    },
    body,
  })
}

export function replyMessage(body) {
  return request('/api/ent/recruit/v1/reply', {
    method: 'POST',
    query: {
      ...body,
      channel: 'www',
      version: '1.0.0',
    },
    body,
  })
}

export function batchReplyMessage(body) {
  return request('/api/ent/recruit/v1/batch_reply', {
    method: 'POST',
    query: {
      ...body,
      channel: 'www',
      version: '1.0.0',
    },
    body,
  })
}

export function setLatestInfo(body) {
  return request('/api/ent/resumes/set_latest_info', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
    },
    body,
  })
}

export function modifyState(query) {
  return request(`/api/ent/resumes/mine/modify_op`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function resumeDataList(query) {
  const url =
    window.location.host === 'test'
      ? '/api/resume/list'
      : '/groundhog/talent/v3/resume/recv_list'

  return request(url, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
      u: getCookie('u'),
    },
  })
}

export function validJoblist(query) {
  const url =
    window.location.host === 'test'
      ? '/api/valid/list'
      : '/groundhog/job/v3/valid_joblist'

  return request(url, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
      u: getCookie('u'),
    },
  })
}

export function handleResume(query) {
  const url =
    window.location.host === 'test'
      ? '/api/handle/resume'
      : '/groundhog/talent/v3/resume/process'

  return request(url, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
      u: getCookie('u'),
    },
  })
}

export function getPingAct(query) {
  const url =
    window.location.host === 'test'
      ? '/api/get/pingAct'
      : '/groundhog/job/v3/get_ping_act'

  return request(url, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
      u: getCookie('u'),
    },
  })
}

export function pingAct(query) {
  const url =
    window.location.host === 'test'
      ? '/api/pingAct'
      : '/groundhog/job/v3/ping_act'

  return request(url, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
      u: getCookie('u'),
    },
  })
}

export function multiProcess(query) {
  const url =
    window.location.host === 'test'
      ? '/api/multi_process'
      : '/sdk/jobs/jobs_resume_process'
  return request(url, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
      u: getCookie('u'),
    },
  })
}

export function resumeListData(query) {
  return request('/jobs/b/resume_handle', {
    query: {
      ...query,
      jsononly: 1,
      channel: 'www',
      version: '4.0.0',
    },
  })
}

export const resumeHandleList = (query) => {
  const url = `/sdk/jobs/get_resume_handle_list`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
    },
    credentials: 'same-origin',
  })
}

export const getDirectChat = (query) => {
  const url = `/sdk/jobs/getDirectChat`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
    },
    credentials: 'same-origin',
  })
}
//

export const reloadResumeList = (query) => {
  const url = `/sdk/jobs/get_resume_handle_list`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
    },
    credentials: 'same-origin',
  })
}
