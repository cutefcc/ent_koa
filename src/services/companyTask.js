import request from 'utils/request'
import { getCookie } from 'tiny-cookie'

// 获取任务面板
export function fetchTaskData(payload) {
  return request('/bizjobs/company/manage/enterprise_achievement_info', {
    query: {
      ...payload,
      u: getCookie('u'),
      channel: 'www',
      version: '4.0.0',
    },
  })
}

// 获取积分商品
export function fetchMallData(payload) {
  return request('/bizjobs/company/manage/enterprise_points_goods', {
    query: {
      ...payload,
      u: getCookie('u'),
      channel: 'www',
      version: '4.0.0',
    },
  })
}

// 积分兑换
export function pointsExchange(payload) {
  return request('/bizjobs/company/manage/enterprise_points_exchange', {
    query: {
      ...payload,
      u: getCookie('u'),
      channel: 'www',
      version: '4.0.0',
    },
  })
}

// 兑换记录
export function getGoodsRecord(payload) {
  return request('/bizjobs/company/manage/enterprise_exchange_info', {
    query: {
      ...payload,
      u: getCookie('u'),
      channel: 'www',
      version: '4.0.0',
    },
  })
}
