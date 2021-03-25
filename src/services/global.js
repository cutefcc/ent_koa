import request from 'utils/request'
import { getCookie } from 'tiny-cookie'

export function fetchJobs(payload) {
  return request('/api/ent/job/namelist', {
    query: {
      channel: 'www',
      version: '1.0.0',
      is_new_add: 1,
      size: 200,
      ...payload,
    },
  })
}

export function fetchTryMemberSt(payload) {
  return request('/sdk/jobs/talent/v3/talent_signal/get_try_member_st', {
    query: {
      channel: 'www',
      u: getCookie('u'),
      ...payload,
    },
  })
}

export function addStar(payload) {
  return request('/api/ent/recruit/v1/star', {
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function cancelStar(payload) {
  return request('/api/ent/recruit/v1/cancel_star', {
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchDictionary(query) {
  return request(`/api/ent/common/v1/const`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function getCurrentUser(query = {}) {
  return request(`/api/ent/user/current`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function getCompanyCurrentUser(query = {}) {
  return request(`/bizjobs/company/manage/get_admin_current`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function checkCurrentUserVer(query = {}) {
  return request(`/api/ent/user/check_user_ver`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function feedback(query = {}) {
  return request(`/api/ent/feedback`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function setWebShow(query = {}) {
  return request(`/api/ent/web_show`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchProfession(query = {}) {
  const url = '/groundhog/user/v5/profession'
  return request(url, {
    query: {
      ...query,
      access_token: getCookie('access_token'),
      u: getCookie('u'),
      channel: 'www',
      version: '4.0.0',
    },
    noCors: true,
  })
}

export function fetchOpenFreeAccount(query = {}) {
  const url = '/bizjobs/company/manage/open_free_account'
  return request(url, {
    query: {
      ...query,
      access_token: getCookie('access_token'),
      u: getCookie('u'),
      channel: 'www',
      version: '4.0.0',
    },
    noCors: true,
  })
}

export function fetchSchoolSugs(query = {}) {
  return request(`/api/ent/discover/school_sugs`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchCompanySugs(query = {}) {
  return request(`/api/ent/discover/company_sugs`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchPositionSugs(query = {}) {
  return request(`/api/ent/discover/position_sugs`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchUnReadMsg(query = {}) {
  return request(`/api/ent/im/un_read_msg`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchCommonFriends(query = {}) {
  return request(`/api/ent/friend/common`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchUrl({ url = '', param = {}, method = 'GET', query = {} }) {
  const options =
    method !== 'GET'
      ? {
          method,
          body: param,
          query: {
            channel: 'www',
            version: '3.0',
            ...query,
          },
        }
      : {
          query: {
            ...param,
            channel: 'www',
            version: '1.0.0',
          },
        }

  return request(url, options)
}

export function fetchConfig(query = {}) {
  return request(`/api/ent/common/config`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function setReddot(query) {
  return request(`/api/ent/common/reddot/set`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchRuntime(query = {}) {
  return request(`/api/ent/common/runtime`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function unBind(query = {}) {
  return request(`/api/ent/asset/personal/unbind`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchCompanyStaffNum(query = {}) {
  return request(`/api/ent/common/company/count`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function addOpportunityCustom(query = {}) {
  return request(`/api/ent/crm/business/opportunity/add`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchAiCallState(query = {}) {
  return request(`/api/ent/calls/b/get/state`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchExtendData(payload) {
  return request('/api/ent/card/extend', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchExtendDataNew(payload) {
  return request('/api/ent/card/extend_and_dynamic', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function fetchPolaris(payload) {
  return request('/groundhog/pbs/polaris/get_variables', {
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchVirtualPhone(payload) {
  return request('/api/ent/discover/virtual_phone', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 获取feed后台可配置的各种资源
// 配置地址 http://billionaire.in.taou.com/#/data/schema
export function getMaterialConfig(payload) {
  return request('/bizjobs/getConfig', {
    query: {
      material_id: payload.id,
    },
  })
}
