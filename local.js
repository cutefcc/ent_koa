const proxy = {
  // '/api/ent/discover/virtual_phone': {
  //   target: 'http://kvm-jobs-dev2:8206',
  //   changeOrigin: true,
  // },
  // '/api/ent/card/extend_and_dynamic': {
  //   target: 'http://kvm-jobs-dev2:8206',
  //   changeOrigin: true,
  // },
  // '/api/ent/v3/search/basic': {
  //   target: 'http://kvm-jobs-dev2:28209',
  //   changeOrigin: true,
  // },
  // '/api/ent/v3/search/contact_btn': {
  //   target: 'http://kvm-jobs-dev2:28209',
  //   changeOrigin: true,
  // },
  '/api/ent/v3/search/basic': {
    target: 'http://kvm-jobs-dev2:6601',
    changeOrigin: true,
  },
  '/api/ent/discover/search': {
    target: 'http://kvm-jobs-dev2:6601',
    changeOrigin: true,
  },
  '/api/ent': {
    target: 'https://maimai.cn',
    changeOrigin: true,
  },
  '/groundhog': {
    target: 'http://front:8540',
    pathRewrite: { '^/groundhog': '' },
  },
  '/jobs': {
    target: 'https://maimai.cn',
    changeOrigin: true,
  },
  '/bizjobs': {
    target: 'https://maimai.cn',
    changeOrigin: true,
  },
  '/sdk/jobs': {
    target: 'https://maimai.cn',
    changeOrigin: true,
  },
  '/upfile_for_company': {
    target: 'https://maimai.cn',
    changeOrigin: true,
  },
  '/sdk/company': {
    target: 'https://maimai.cn',
    changeOrigin: true,
  },
  '/company': {
    target: 'https://maimai.cn',
    changeOrigin: true,
  },
  '/ent': {
    target: 'http://localhost:8007',
    pathRewrite: { '^/ent': '' },
  },
  '/user/v3': {
    target: 'http://front:8540',
    changeOrigin: true,
  },
  '/api/cooperation/company_asking_list': {
    target: 'http://kvm-company-dev1:8301',
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
  },
  '/api/cooperation/answer': {
    target: 'http://kvm-company-dev1:8301',
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
  },
  '/api/cooperation/get_enterprise_feeds': {
    target: 'http://kvm-company-dev1:8301',
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
  },
  '/api/cooperation/get_answers': {
    target: 'http://kvm-company-dev1:8301',
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
  },
  '/api/cooperation/topping_company_answer': {
    target: 'http://kvm-company-dev1:8301',
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
  },
  '/api/cooperation/remove_company_answer': {
    target: 'http://kvm-company-dev1:8301',
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
  },
  '/api/cooperation/delete_answer': {
    target: 'http://kvm-company-dev1:8301',
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
  },
  '/api/cooperation/like_answer': {
    target: 'http://kvm-company-dev1:8301',
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
  },
  '/api/cooperation/get_lv2_answers': {
    target: 'http://kvm-company-dev1:8301',
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
  },
}
module.exports = proxy
