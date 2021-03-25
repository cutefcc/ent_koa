// eslint-disable-next-line max-lines
import request from 'utils/request'
import { getCookie } from 'tiny-cookie'
// import * as R from 'ramda'
import { getUid } from 'utils'

const getAuth = () => {
  const u = getUid()

  return {
    u,
  }
}

export function fetch(query) {
  return request(`/api/ent/job/list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function updateState(query) {
  return request(`/api/ent/job/v1/up_state`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function open(query) {
  return request('/api/ent/job/open', {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function close(query) {
  return request('/api/ent/job/close', {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function add({ data, webjid = '' }) {
  // const formData = new FormData()
  // R.forEachObjIndexed(
  //   (value, key) => {
  //     formData.append(key, value)
  //   },
  //   {...data, webjid}
  // )

  return request(`/up_job`, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    body: {
      ...data,
      webjid,
    },
    // body: formData,
  })
}
export function fetchDetailForEdit(query) {
  return request(`/api/ent/job/v1/add_job_get`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
export function fetchDetail(query) {
  return request(`/api/ent/job/v1/get`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
export function agree(body) {
  return request(`/api/ent/right/connect/agree`, {
    method: 'GET',
    query: {
      ...body,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
export function disAgree(body) {
  return request(`/api/ent/right/connect/disagree`, {
    method: 'GET',
    query: {
      ...body,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
export function fetchExposureStatus(body) {
  return request('/api/ent/right/exposure/status', {
    query: {
      ...body,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
export function addExposure(body) {
  return request('/api/ent/right/exposure/add', {
    query: {
      ...body,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
export function fetchRealRecommend(body) {
  return request('/api/ent/discover/real_recommend', {
    query: {
      ...body,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
export function fetchVisitor(body) {
  return request('/api/ent/position/visitors', {
    query: {
      ...body,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
export function fetchCanChat(body) {
  const auth = getAuth()
  const offset = body.page || 0
  return request('/api/ent/job/v3/get_accept_vcall_list', {
    query: {
      ...auth,
      ...body,
      offset,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
// 发布职位相关接口
/**
 * 获取静态数据
 * @param {String} fields 使用,分割
 */
export const fetchConstData = (query) => {
  const url = `/groundhog/job/v3/zhaopin_const`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
      channel: 'www',
      version: '4.0.0',
    },
    credentials: 'same-origin',
  })
}
/**
 * 请求sug
 * @param {Number} type 7:职位，8:公司
 * @param {String} chars
 * @param {String} job_add_comp
 */
export const fetchSug = (query) => {
  const url = `/sdk/jobs/get_sug`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
    },
    credentials: 'same-origin',
  })
}

/**
 * 请求行业数据
 */
export const fetchProfession = (query) => {
  const url = '/groundhog/user/v5/profession'
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
      channel: 'www',
      version: '4.0.0',
    },
    credentials: 'same-origin',
  })
}
/**
 * 请求行业方向数据
 *  @param {String} pfs
 */
export const fetchMajor = (query) => {
  const url = '/groundhog/user/v5/major'
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
      channel: 'www',
      version: '4.0.0',
    },
    credentials: 'same-origin',
  })
}
/**
 * 是否是猎头职位
 * @param {Number} u
 * @param {String} company
 */
export const fetchIsHunterJob = (query) => {
  const url = `/sdk/jobs/publish_job/is_hunter_job`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
    },
    credentials: 'same-origin',
  })
}
/**
 * 申请成为猎头
 * @param {Number} u
 * @param {Number} set_not_hunter = 0 申请 1 是 取消
 */
export const hunterApply = (query) => {
  const url = `/groundhog/job/v3/hr/hunter_apply`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
      channel: 'www',
      version: '4.0.0',
    },
    credentials: 'same-origin',
  })
}
/**
 * 发布职位前check
 * @param {Number} u
 */
export const prePublish = (query) => {
  const url = `/sdk/jobs/publish_job/pre_add`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
    },
    credentials: 'same-origin',
  })
}
/**
 * 发布职位前获取默认填入信息
 * @param {Number} u
 */
export const fetchFormInfo = (query) => {
  const url = `/sdk/jobs/publish_job/add_pre_info`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
    },
    querycredentials: 'same-origin',
  })
}
/**
 * 发布职位
 * @param {Number} u
 * @param {Object} infos
 * @param {String} appid
 */
export const addJob = (query) => {
  const url = `/sdk/jobs/publish_job/add_job`
  return request(url, {
    query: {
      u: getCookie('u'),
    },
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: {
      u: getCookie('u'),
      appid: 2,
      ...query,
    },
  })
}
/**
 * 更新职位|更新职位并恢复招聘
 * @param {Number} u
 * @param {String} ejid
 * @param {Object} infos
 * @param {String} appid
 */
export const updateJob = (query) => {
  const url = `/sdk/jobs/publish_job/update_job`
  return request(url, {
    query: {
      u: getCookie('u'),
    },
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: {
      u: getCookie('u'),
      appid: 2,
      ...query,
    },
  })
}
/**
 * 发布/更新职位前校验 query
 * @param {Number} u
 * @param {Object} infos
 */
export const censorJob = (query) => {
  const url = `/sdk/jobs/publish_job/censor_job`
  return request(url, {
    query: {
      u: getCookie('u'),
    },
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: {
      u: getCookie('u'),
      ...query,
    },
  })
}
/**
 * 关闭职位
 * @param {Number} u
 * @param {String} ejid
 */
export const closeJob = (query) => {
  const url = `/sdk/jobs/publish_job/close_job`
  return request(url, { query, credentials: 'same-origin' })
}
/**
 * 更新职位前check接口
 * @param {Number} u
 * @param {String} ejid
 */
export const preUpdate = (query) => {
  const url = `/sdk/jobs/publish_job/pre_update`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
    },
    credentials: 'same-origin',
  })
}
/**
 * 更新职位前获取默认填入信息
 * @param {Number} u
 * @param {String} ejid
 */
export const fetchUpdateInfo = (query) => {
  const url = `/sdk/jobs/publish_job/update_pre_info`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
    },
    credentials: 'same-origin',
  })
}

/**
 * 获取细分方向
 * @param {Number} u
 * @param {String} major_code
 */
export const fetchMajorNewLv2 = (query) => {
  const url = `/sdk/profile/get_major_new_lv2`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
    },
    credentials: 'same-origin',
  })
}
/**
 * 根据职位方向获取职能方向
 * @param {Number} u
 * @param {String} ejid
 * @param {String} major_code
 */
export const getDirection = (query) => {
  const url = `/sdk/jobs/publish_job/get_direction_from_major`
  return request(url, { query, credentials: 'same-origin' })
}
export const meetLimit = (query) => {
  return request(`/api/ent/pos/invite/pre?`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

/**
 * 更新开启职位智能邀约
 * @param {Number} u
 * @param {String} ejid
 * @param {String} auth_status=0\1 表示关、开
 */
export const updateJobAuthStatus = (query) => {
  const url = `/sdk/jobs/update_jobs_intelligent_invite_auth_setting`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
    },
    credentials: 'same-origin',
  })
}

/**
 * 获取支付弹窗轮播数据
 *
 */

export const getPayBanners = (query) => {
  const url = `/groundhog/member/uh/single_pay/banners`
  return request(url, {
    query: {
      u: getCookie('u'),
      ...query,
      channel: 'www',
      version: '4.0.0',
    },
    credentials: 'same-origin',
  })
}
