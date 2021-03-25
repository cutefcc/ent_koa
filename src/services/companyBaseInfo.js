import request from 'utils/request'
import { getCookie } from 'tiny-cookie'

// get baseinfo
export function getBaseInfo(payload) {
  return request('/sdk/company/obtain_base_info', {
    query: {
      ...payload,
    },
  })
}

export function getCompanyProgress(payload) {
  return request('/sdk/company/obtain_company_progress', {
    query: {
      ...payload,
    },
  })
}

export function getVideoList(payload) {
  return request('/company/getVideoList', {
    query: {
      ...payload,
    },
  })
}

// get city data
export function getCity(payload) {
  return request('/sdk/company/city', {
    query: {
      ...payload,
    },
  })
}

// get profession data
export function getProfession(payload) {
  return request('/sdk/company/profession', {
    query: {
      ...payload,
    },
  })
}

// set head base info
export function setBaseHeadInfo(payload) {
  return request('/sdk/company/change_base_info', {
    query: {
      ...payload,
    },
  })
}

// set introduce

export function setIntroduce(payload) {
  return request('/sdk/company/change_intro_info', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    query: {
      u: getCookie('u'),
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}

// set progress
export function editProgress(payload) {
  const url = '/sdk/company/add_company_progress'
  return request(url, {
    query: {
      ...payload,
    },
  })
  // let url = '/sdk/company/add_company_progress'
  // if (payload.history_id) {
  //   url = '/groundhog/cooperation/infos/history/update'
  //   delete payload.editStatus
  //   return request(url, {
  //     method: 'POST',
  //     credentials: 'same-origin',
  //     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  //     query: {
  //       version: '4.0.0',
  //       u: getCookie('u'),
  //       channel: 'www',
  //       cid:payload.cid
  //     },
  //     body: payload,
  //   })
  // } else {
  //   return request(url, {
  //     query: {
  //       ...payload,
  //     },
  //   })
  // }
}

// delete progress
export function delProgress(payload) {
  return request('/sdk/company/delete_company_progress', {
    query: {
      ...payload,
    },
  })
}

// set video list
export function setVideoList(payload) {
  return request('/company/editVideoList', {
    method: 'POST',
    query: {
      webcid: payload.webcid,
    },
    body: { data: payload.videoList },
  })
}
