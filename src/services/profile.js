import request from 'utils/request'
import { getCookie } from 'tiny-cookie'
// import * as R from 'ramda'

// 好友点评列表
export function fetchCommentList({ uid }) {
  return request(`/contact/comment_list/${uid}?jsononly=1`, {})
}

// 看了他的人还看了
export function fetchInterestContact({ uid }) {
  return request(`/contact/interest_contact/${uid}?jsononly=1`, {})
}

// 看了他的人还看了（新）
export function fetchInterestContactNew(query) {
  return request(`/api/ent/card/watch/list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 职业标签
export function fetchUserTag({ uid }) {
  return request(`/tag/user_tag?tagu=${uid}&jsononly=1`, {})
}

// 实名动态
export function fetchRealnameStatus(query) {
  return request('/groundhog/feed/v3/user', {
    query: {
      only_realname_status: 1,
      u: getCookie('u'),
      channel: 'www',
      version: '4.0.0',
      hash: 'feed_list',
      jsononly: 1,
      ...query,

      // TODO 测试数据
      // u2: 30840978,
      // page: 1,
    },
  })
}

// 基础信息
export function fetchBasicInfo(query) {
  return request('/api/ent/talent/basic', {
    query: {
      ...query,
      version: '1.0.0',
      channel: 'www',
    },
  })
}

// 求职偏好
export function fetchJobPreference(query) {
  return request('/api/ent/talent/job_preference', {
    query: {
      ...query,
      version: '1.0.0',
      channel: 'www',
    },
  })
}

// 实名动态数量
export function fetchTabs(query) {
  return request('/api/ent/talent/tabs', {
    query: {
      ...query,
      version: '1.0.0',
      channel: 'www',
    },
  })
}

// 获取工作学历详情
export function fetchWorkAndEduExp(query) {
  return request('/api/ent/talent/work_exp_and_education', {
    query: {
      ...query,
      version: '1.0.0',
      channel: 'www',
    },
  })
}

// 获取card list: 某用户在某个学校或者某个公司的好友
export function fetchCardList(query) {
  return request('/contact/card_lst', {
    query: {
      ...query,
      jsononly: 1,
    },
  })
}
