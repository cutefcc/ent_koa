const defaultConf = {
  changeOrigin: true,
  pathRewrite: {},
}
const hosts = {
  employerHost: 'https://maimai.cn',
}
const proxy = {
  '/cooperation/employee_auth_add': {
    target: 'http://10.9.80.120:8080',
    ...defaultConf,
  },
  '/api/ent/reach/b/get/c/info': {
    target: 'http://kvm-jobs-dev2:8209',
    ...defaultConf,
  },
  '/api/ent/right/reach_final': {
    target: 'http://kvm-jobs-dev2:8209',
    ...defaultConf,
  },
  '/api/ent/talent/contact_status': {
    target: 'http://kvm-jobs-dev2:8209',
    ...defaultConf,
  },
  '/api/ent/asset/company/recycle': {
    target: 'http://kvm-jobs-dev2:8209',
    ...defaultConf,
  },
  '/api/ent/asset/company/assign': {
    target: 'http://kvm-jobs-dev2:8209',
    ...defaultConf,
  },
  '/api/ent/asset/company': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/asset/personal': {
    target: 'https://maimai.cn',
    ...defaultConf,
  },
  '/api/ent/card/extend': {
    target: 'https://maimai.cn',
    ...defaultConf,
  },
  '/api/ent/talent/basic': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/user/current': {
    target: 'https://maimai.cn',
    ...defaultConf,
  },
  '/api/ent/right/direct/contact/enable': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/right/direct/contact/batch': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/talent/data/map': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/company/fans/count': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/company/infos': {
    target: 'https://maimai.cn',
    ...defaultConf,
  },
  '/api/ent/talent/pool/enterprise/attention/list': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/employer/promote/add': {
    target: 'http://kvm-jobs-dev1:8301',
    ...defaultConf,
  },
  '/api/ent/employer/promote/pre_count': {
    target: 'http://kvm-jobs-dev1:8301',
    ...defaultConf,
  },
  '/api/ent/employer': {
    target: hosts.employerHost,
    ...defaultConf,
  },
  '/api/ent/employer/promote/list': {
    target: hosts.employerHost,
    ...defaultConf,
  },
  '/upfile_for_company': {
    target: 'https://maimai.cn',
    ...defaultConf,
  },
  '/company/getToken': {
    target: 'https://maimai.cn',
    ...defaultConf,
  },
  '/company': {
    target: 'https://maimai.cn',
    ...defaultConf,
  },
  '/api/ent/stat/company/license_detail': {
    target: 'http://kvm-jobs-dev2:16209',
    ...defaultConf,
  },
  '/api/ent/stat/company/total': {
    target: 'http://kvm-jobs-dev2:8209',
    ...defaultConf,
  },
  '/api/ent/stat/company/license_rank': {
    target: 'http://kvm-jobs-dev2:8209',
    ...defaultConf,
  },
  '/api/ent/stat/company/daily': {
    target: 'http://kvm-jobs-dev2:8209',
    ...defaultConf,
  },
  // 舆情监控
  '/api/ent/opinion/words/search': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/opinion/words/comment/search': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/user/limit': {
    target: 'http://kvm-jobs-dev2:28209',
    ...defaultConf,
  },
  '/api/ent/discover/search/middle_and_high_end/analysis': {
    target: 'https://maimai.cn',
    ...defaultConf,
  },
  '/api/ent/discover/search/middle_and_high_end/validate': {
    target: 'https://maimai.cn',
    ...defaultConf,
  },
  '/api/ent/discover/search': {
    target: 'https://maimai.cn',
    ...defaultConf,
  },
  '/api/ent/talent/pool/v3/special_attention': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/talent/pool/v3/cancel_special_attention': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/job/v3/recruiter_badge_info': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/sdk/jobs/recruiter_can_chat_list': {
    target: 'http://localhost:3000',
    ...defaultConf,
  },
  // '/api/ent/talent/pool/v3/navigator': {
  //   target: 'http://kvm-jobs-dev2:8206',
  //   changeOrigin: true,
  //   pathRewrite: {},
  // },
  '/api/ent/candidate/show': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/dynamic/search': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/talent/pool/v3/amount_trend': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/dynamic/detail_count_and_recent': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/dynamic/navigator': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/dynamic/detail': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/discover/search/analysis': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/talent/pool/v3/talent_list': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/card/hover/fans': {
    target: 'http://kvm-jobs-dev2:8205',
    ...defaultConf,
  },
  '/api/ent/card/watch/list': {
    target: 'http://kvm-jobs-dev2:8206',
    ...defaultConf,
  },
  '/api/ent/cooperation/company_asking_list': {
    target: 'http://kvm-company-dev1:8301',
    ...defaultConf,
  },
  '/api/ent/feed/search': {
    target: 'https://maimai.cn',
    ...defaultConf,
  },
}

module.exports = proxy
