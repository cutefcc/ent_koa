import request from 'utils/request'

const commonQuery = {
  channel: 'www',
  version: '1.0.0',
}

export function fetchUsed(query) {
  return request(`/api/ent/stat/company/asset/used`, {
    query: {
      ...query,
      ...commonQuery,
    },
  })
}

export function fetchRight(query) {
  return request(`/api/ent/stat/company/right`, {
    query: {
      ...query,
      ...commonQuery,
    },
  })
}

export function fetchRightScenes(query) {
  return request(`/api/ent/stat/company/right/scenes`, {
    query: {
      ...query,
      ...commonQuery,
    },
  })
}

export function fetchDetail(query) {
  return request(`/api/ent/stat/company/detail`, {
    query: {
      ...query,
      ...commonQuery,
    },
  })
}

export function fetchDetail2(query) {
  return request(`/api/ent/stat/company/report_detail`, {
    query: {
      ...query,
      ...commonQuery,
    },
  })
}

export function fetchDetailV2(query) {
  return request(`/api/ent/stat/company/report_detail_v2`, {
    query: {
      ...query,
      ...commonQuery,
    },
  })
}

// 企业会员招聘数据汇总
export function fetchCompanyTotal(query) {
  return request(`/api/ent/stat/company/total`, {
    query: {
      ...query,
      ...commonQuery,
    },
  })
}

// 企业会员招聘数据按天
export function fetchCompanyDaily(query) {
  return request(`/api/ent/stat/company/daily`, {
    query: {
      ...query,
      ...commonQuery,
    },
  })
}

// 企业会员招聘数据子账号排行榜
export function fetchLicenseRank(query) {
  return request(`/api/ent/stat/company/license_rank`, {
    query: {
      ...query,
      ...commonQuery,
    },
  })
}

// 企业会员招聘数据子账号详情
export function fetchLicenseDetail(query) {
  return request(`/api/ent/stat/company/license_detail`, {
    query: {
      ...query,
      ...commonQuery,
    },
  })
}
