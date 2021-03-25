import request from 'utils/request'

export function getMemberApply(query = {}) {
  return request(`/api/ent/member_apply/list`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function addMemberApply(query = {}) {
  return request(`/api/ent/member_apply/add`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function updateMemberApply(query = {}) {
  return request(`/api/ent/member_apply/update`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function uodateMemberApplyStatus(query = {}) {
  return request(`/api/ent/member_apply/update_status`, {
    query: {
      ...query,
      channel: 'www',
      version: '1.0.0',
    },
  })
}
