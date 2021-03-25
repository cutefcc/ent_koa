export const REG_NOT_EMPTY = /^\s*$/g
export const REG_EMAIL = !/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
export const REG_EMOJI = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[A9|AE]\u3030|\uA9|\uAE|\u3030/gi

export const FormFields = {
  company: {
    optType: '请输入公司名称',
    label: '公司名称',
    required: true,
    reg: REG_EMOJI,
    needEmptyEjid: true,
  },
  position: {
    optType: '请输入职位名称',
    label: '职位名称',
    required: true,
    reg: REG_EMOJI,
    needEmptyEjid: true,
    maxLength: 30,
  },
  profession_new: {
    optType: '选择行业',
    label: '行业',
    required: true,
    needEmptyEjid: true,
  },
  major_new: {
    optType: '选择行业方向',
    label: '行业方向',
    needEmptyEjid: true,
    required: true,
    component: 'select',
  },
  major_new_lv2: {
    optType: '期望职位优先被哪些人才看到',
    label: '人才方向',
    component: 'select',
  },
  job_level: {optType: '请选择', label: '职位级别'},
  work_time_degree: {
    label: '经验学历',
    required: true,
    children: [
      {
        id: 'work_time',
        optType: '选择工作经验',
      },
      {
        id: 'degree',
        optType: '选择学历要求',
      },
    ],
  },
  salary: {
    label: '薪资范围',
    required: true,
    children: [
      {
        id: 'salary_min',
        optType: '最低',
      },
      {
        id: 'salary_max',
        optType: '最高',
      },
      {
        id: 'salary_share',
        optType: '周期',
      },
    ],
  },
  address: {label: '工作地址', required: true},
  custom_text: {
    label: '职位亮点',
    optType: '请输入职位亮点，如股票期权、绩效奖金、带薪年假等',
    maxLength: 30,
  },
  email: {
    optType: '请输入',
    label: '邮箱',
    required: true,
    regType: 'email',
    regMsg: '邮箱格式不正确',
    component: 'input',
  },
  description: {
    optType: `请输入岗位职责、任职要求等，建议尽量使用短句并分条列出，最少20个字。请勿输入微信、电话、QQ、邮箱、外链、薪资面议、特殊符号等内容。`,
    label: '职位描述',
    required: true,
    rows: 9,
    minLength: 20,
    maxLength: 5000,
  },
}
export const Card1Options = [
  'company',
  'position',
  'profession_new',
  'major_new',
  'major_new_lv2',
]

export const Card2Options = [
  'work_time_degree',
  'salary',
  'address',
  'custom_text',
  'email',
  'description',
]

export const OriginalParams = {
  position: '',
  company: '',
  major_new: '', // 行业方向和人才方向用这一个参数
  profession_new: '',
  description: '',
  // degree: '',
  // work_time: '',
  is_hunter: false,
  stags: '',
  province: '',
  city: '',
  email: '',
  custom_text: '',
  address: '',
  is_public: 1,
  // salary_min: '',
  // salary_max: '',
  // salary_share: 12,
  is_regular: 0, // 是否是标准化职位，0不是 1是
  major_keywords: '', // 方向关键词，选中的英文逗号分割
}
