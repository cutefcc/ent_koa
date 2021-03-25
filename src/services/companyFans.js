import request from 'utils/request'

// 是否开通企业号接口
export function getCompanyInfos(payload) {
  return request('/api/ent/company/infos', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

// 本公司粉丝数和粉丝数TOP5公司接口
export function getCompanyFansCount() {
  return request('/api/ent/company/fans/count', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
    },
  })
}
