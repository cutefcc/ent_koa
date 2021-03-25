import request from 'utils/request'
import { getCookie } from 'tiny-cookie'

// 获取员工数据
export function fetchEmployerList(payload) {
  const { search, ...rest } = payload
  return request('/groundhog/cooperation/employee_auth_discover', {
    method: 'POST',
    query: {
      u: getCookie('u'),
      channel: 'www',
      version: '1.0.0',
    },
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: {
      uid: Number(getCookie('u')),
      ...rest,
      search: JSON.stringify(search),
    },
  })
}

// 获取处理记录数据
export function fetchRecordList(payload) {
  return request('/bizjobs/company/manage/employee_auth_list', {
    query: {
      ...payload,
      uid: Number(getCookie('u')),
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 举报，认证操作
export function authAdd(payload) {
  const { op, ...rest } = payload
  return request('/groundhog/cooperation/employee_auth_add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    query: {
      u: getCookie('u'),
      channel: 'www',
      version: '1.0.0',
    },
    body: {
      uid: Number(getCookie('u')),
      ...rest,
      op: JSON.stringify(op),
    },
  })
}

// 职位展台

/**
 * 获取职位数据
 * @param {Number} count
 * @param {Number} page
 * @param {String} job_title
 */
export function fetchCompanyJobList(payload) {
  return request('/sdk/company/obtian_company_job', {
    query: {
      u: Number(getCookie('u')),
      ...payload,
    },
  })
}

/**
 * 设置职位状态
 * @param {Number} stick_status
 * @param {Number} view_status
 * @param {String} id
 */
export function changeCompanyJobList(payload) {
  return request('/sdk/company/change_job_list', {
    query: {
      u: Number(getCookie('u')),
      ...payload,
    },
  })
}
