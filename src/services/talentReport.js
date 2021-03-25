import request from 'utils/request'

export function fetch(payload) {
  return request('/api/ent/talent/data/map', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
    },
    body: payload,
  })
}

export function fetchPosition(payload) {
  return request('/api/ent/report/major', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchEmployeeTurnover(payload) {
  return request('/api/ent/report/staff/skill', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchEmployeePortraitNum(payload) {
  return request('/api/ent/report/portrait/staff/num', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchEmployeePortraitEdu(payload) {
  return request('/api/ent/report/portrait/staff/edu', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchEmployeePortraitSchool(payload) {
  return request('/api/ent/report/portrait/staff/school', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchEmployeePortraitWorkYear(payload) {
  return request('/api/ent/report/portrait/staff/work_year', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchEmployeePortraitLength(payload) {
  return request('/api/ent/report/portrait/staff/job/length', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchEmployeeTurnoverrRatio(payload) {
  return request('/api/ent/report/flow/ratio', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchEmployeeTurnoverrEntrySource(payload) {
  return request('/api/ent/report/flow/entry_source', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchEmployeeTurnoverrFlowLeave(payload) {
  return request('/api/ent/report/flow/leave', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchEmployerInfluenceAffect(payload) {
  return request('/api/ent/report/employer/affect', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchEmployerInfluenceCardNum(payload) {
  return request('/api/ent/report/employer/card_num', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchInteractiveTalentPortraitNum(payload) {
  return request('/api/ent/report/portrait/interact/num', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchInteractiveTalentPortraitEdu(payload) {
  return request('/api/ent/report/portrait/interact/edu', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchInteractiveTalentPortraitSchool(payload) {
  return request('/api/ent/report/portrait/interact/school', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchInteractiveTalentPortraitWorkYear(payload) {
  return request('/api/ent/report/portrait/interact/work_year', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchRecruitmentPortraitNum(payload) {
  return request('/api/ent/report/portrait/recruit/num', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchRecruitmentPortraitEdu(payload) {
  return request('/api/ent/report/portrait/recruit/edu', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchRecruitmentPortraitSchool(payload) {
  return request('/api/ent/report/portrait/recruit/school', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchRecruitmentPortraitWorkYear(payload) {
  return request('/api/ent/report/portrait/recruit/work_year', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchReserveTalentPortraitsNum(payload) {
  return request('/api/ent/report/portrait/reserve/num', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchReserveTalentPortraitsEdu(payload) {
  return request('/api/ent/report/portrait/reserve/edu', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchReserveTalentPortraitsSchool(payload) {
  return request('/api/ent/report/portrait/reserve/school', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchReserveTalentPortraitsWorkYear(payload) {
  return request('/api/ent/report/portrait/reserve/work_year', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchJobAttractivenessNum(payload) {
  return request('/api/ent/report/position/num', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchJobAttractivenessPerson(payload) {
  return request('/api/ent/report/position/person', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchJobAttractivenessSeeRate(payload) {
  return request('/api/ent/report/position/see_rate', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchJobAttractivenessTalk(payload) {
  return request('/api/ent/report/position/talk', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchIndustryFlowSeeker(payload) {
  return request('/api/ent/report/market/seeker', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchIndustryFlowRecruit(payload) {
  return request('/api/ent/report/market/recruit', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchTalentFlowPersonInflow(payload) {
  return request('/api/ent/report/city/person/inflow', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchTalentFlowPersonOutflow(payload) {
  return request('/api/ent/report/city/person/outflow', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchTalentFlowPersonIndustryInflow(payload) {
  return request('/api/ent/report/city/industry/person/inflow', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchTalentFlowPersonIndustryOutflow(payload) {
  return request('/api/ent/report/city/industry/person/outflow', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchTalentPortraitNum(payload) {
  return request('/api/ent/report/city/portrait/staff/num', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchTalentPortraitEdu(payload) {
  return request('/api/ent/report/city/portrait/staff/edu', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchTalentPortraitSchool(payload) {
  return request('/api/ent/report/city/portrait/staff/school', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchTalentPortraitWorkYear(payload) {
  return request('/api/ent/report/city/portrait/staff/work_year', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}

export function fetchTalentPortraitJob(payload) {
  return request('/api/ent/report/city/portrait/staff/job/length', {
    method: 'GET',
    query: {
      channel: 'www',
      version: '1.0.0',
      ...payload,
    },
  })
}
