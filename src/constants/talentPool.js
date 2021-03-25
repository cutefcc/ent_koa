// 个人分组，分组名称的最大长度
export const GROUP_NAME_MAX_LEN = 20

// 企业分组，分组名称的最大长度
export const ENT_GROUP_NAME_MAX_LEN = 20

// 个人分组，个数上限
export const GROUP_UPPER_LIMIT = 50

// 企业分组，个数上限
export const ENT_GROUP_UPPER_LIMIT = 20

// 个人分组，每个分组人数上限
export const GROUP_NUM_CAP = 100

// 企业分组，每个分组人数上限
export const ENT_GROUP_NUM_CAP = 1000

// 企业人才库公司分组，个数上限
export const ENT_COMPANYG_ROUP_UPPER_LIMIT = 5

// 人才银行一级页面人才动态 tab 选项
export const DASHBOARD_TABS = [
  {
    label: '全部',
    value: '0',
    attr: 'talent_dashboard_option_all',
    trackParam: {
      tab_name: 'all',
    },
  },
  {
    label: '新活跃',
    value: '1,2,3',
    attr: 'talent_dashboard_option_active',
    trackParam: {
      tab_name: 'new_active',
    },
  },
  // {
  //   label: '更改意向',
  //   value: '3',
  //   attr: 'talent_dashboard_option_intendchange',
  //   trackParam: {
  //     tab_name: 'intend_change',
  //   },
  // },
  // {
  //   label: '邀约',
  //   value: '11',
  //   attr: 'talent_dashboard_option_invite',
  //   trackParam: {
  //     tab_name: 'iinvite', // 打点相关参数
  //   },
  // },
  {
    label: '职位访客',
    value: '9',
  },
  {
    label: '企业粉丝',
    value: '4',
    attr: 'talent_dashboard_option_fans',
    trackParam: {
      tab_name: 'company_fans',
    },
  },
  {
    label: '访问企业号',
    value: '5',
    attr: 'talent_dashboard_option_tocompany',
    trackParam: {
      tab_name: 'company_code',
    },
  },
  {
    label: '更新个人信息',
    value: '6',
    attr: 'talent_dashboard_option_upinfo',
    trackParam: {
      tab_name: 'update_personal_info',
    },
  },
  {
    label: '入职周年',
    value: '7',
    attr: 'talent_dashboard_option_worktime',
    trackParam: {
      tab_name: 'join_anniversary',
    },
  },
  {
    label: '生日',
    value: '8',
    attr: 'talent_dashboard_option_birthday',
    trackParam: {
      tab_name: 'birthday',
    },
  },
]

// 人才银行一级页面人才动态 tab 选项(新版使用)
export const DASHBOARD_TABS_NEW = [
  {
    label: '全部',
    value: '0',
    attr: 'talent_dashboard_option_all',
    trackParam: {
      tab_name: 'all',
    },
  },
  {
    label: '新活跃',
    value: '1,2', // 1: 活跃值提升  2：开聊  3:更改求职意向
    attr: 'talent_dashboard_option_active_2',
    trackParam: {
      tab_name: 'new_active',
    },
  },
  {
    label: '更改意向',
    value: '3',
    attr: 'talent_dashboard_option_intendchange',
    trackParam: {
      tab_name: 'intend_change', // 打点相关参数
    },
  },
  {
    label: '邀约',
    value: '11',
    attr: 'talent_dashboard_option_invite',
    trackParam: {
      tab_name: 'invite', // 打点相关参数
    },
  },
  {
    label: '意向沟通',
    value: '12',
    attr: 'talent_dashboard_option_invite',
    trackParam: {
      tab_name: 'invite', // 打点相关参数
    },
  },
  {
    label: '职位访客',
    value: '9',
  },
  // {
  //   label: '更改意向',
  //   value: '3',
  //   attr: 'jobs_pc_talent_bank_dynamic_switch',
  //   trackParam: {
  //     tab_name: 'change_intention',
  //   },
  // },
  {
    label: '企业粉丝',
    value: '4',
    attr: 'talent_dashboard_option_fans',
    trackParam: {
      tab_name: 'company_fans',
    },
  },
  {
    label: '访问企业号',
    value: '5',
    attr: 'talent_dashboard_option_tocompany',
    trackParam: {
      tab_name: 'company_code',
    },
  },
  {
    label: '更新个人信息',
    value: '6',
    attr: 'talent_dashboard_option_upinfo',
    trackParam: {
      tab_name: 'update_personal_info',
    },
  },
  {
    label: '入职周年',
    value: '7',
    attr: 'talent_dashboard_option_worktime',
    trackParam: {
      tab_name: 'join_anniversary',
    },
  },
  {
    label: '生日',
    value: '8',
    attr: 'talent_dashboard_option_birthday',
    trackParam: {
      tab_name: 'birthday',
    },
  },
]
