import {
  DEFAULT_SCHOOL_OPTIONS,
  DEFAULT_POSITION_OPTIONS,
  DEFAULT_COMPANY_OPTIONS,
} from 'constants'

const FormFields = [
  {
    id: 'positions',
    label: '职位技能',
    maxTagCount: 2,
    component: 'select',
    options: DEFAULT_POSITION_OPTIONS,
  },
  {
    id: 'region',
    label: '城市地区',
    maxTagCount: 2,
    component: 'cascader',
  },
  {
    id: 'worktimes',
    label: '工作年限',
    maxTagCount: 2,
    component: 'select',
  },
  {
    id: 'degrees',
    label: '学历要求',
    maxTagCount: 2,
    component: 'select',
  },
  {
    id: 'companys',
    label: '就职公司',
    maxTagCount: 2,
    component: 'select',
    options: DEFAULT_COMPANY_OPTIONS,
  },
  {
    id: 'schools',
    label: '毕业学校',
    maxTagCount: 2,
    component: 'select',
    options: DEFAULT_SCHOOL_OPTIONS,
  },
  {
    id: 'professions',
    label: '所属行业',
    maxTagCount: 2,
    component: 'select',
  },
  {
    id: 'query',
    label: '关键词',
    maxLength: 255,
    component: 'input',
  },
]

export default FormFields
