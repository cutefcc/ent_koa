export const SORT_OPTIONS = [
  {
    value: '1',
    label: '默认排序',
  },
  {
    value: '2',
    label: '按意愿度排序',
  },
  {
    value: '3',
    label: '按匹配度排序',
  },
]

export const test = 'test'

export const CURRENT_TAB = {
  talent: 'talent',
  dynamic: 'dynamic',
  realName: 'realName',
}

export const ANALYSIS_TITLE_MAP = {
  current_companys_analysis: '目前就职',
  ever_companys_analysis: '曾经就职',
  worktimes_analysis: '经验年限',
  schools_analysis: '就读学校',
  pfmj_analysis: '行业方向',
  province_city_analysis: '城市地区',
}

export const INVITE_FILTER_MAP = {
  search_total: '覆盖人才',
  provinces_cities: '城市地区',
  companys: '就职公司',
  degrees: '学历要求',
  worktimes: '工作年限',
  positions: '职位技能',
  schools: '毕业学校',
  query: '关键词',
  search_query: '关键词',
  professions: '所属行业',
  jid: '邀约职位',
  content: '邀约内容',
}

export const INVITE_FILTER_SORT = {
  query: 0,
  search_query: 1,
  positions: 2,
  provinces_cities: 3,
  worktimes: 4,
  degrees: 5,
  companys: 6,
  schools: 7,
  professions: 8,
  jid: 9,
  content: 10,
}

export const INIT_ADVANCE_SEARCH = {
  cities: '',
  companys: '',
  companyscope: 0,
  degrees: '',
  is_direct_chat: 0,
  positions: '',
  professions: '',
  provinces: '',
  query: '',
  schools: '',
  sortby: '0',
  worktimes: '',
}
export const INIT_ADVANCE_SEARCH_PRO = {
  cities: '',
  companys: '',
  companyscope: 0,
  degrees: '',
  is_direct_chat: 0,
  positions: '',
  professions: '',
  provinces: '',
  query: '',
  schools: '',
  sortby: '0',
  worktimes: '',
  is_exclude_search_seen: 0,
  is_exclude_touched: 0,
  is_has_dynamic: 0,
  is_delivery: 0,
  is_fans: 0,
  is_corp_friend: 0,
}
export const EVENETS_NAME_MAP = {
  advanced_search: 'jobs_pcv2_discover_advanced_search_change', // 高级搜索条件变更
  group_change: 'jobs_pcv2_discover_group_change', // 分组切换
  discover_tab_change: 'jobs_pcv2_discover_tab_change', // tab切换（人才列表、人才动态）
  dynamic_tab_change: 'jobs_pcv2_discover_dynamic_tab_change', // 人才动态 tab 切换
  discover_pagination_change: 'jobs_pcv2_discover_pagination_change', // 分页切换（不用重新生成 sid）
  discover_search: 'jobs_pcv2_discover_search', // 高级搜索
  dynamic_search: 'jobs_pcv2_discover_dynamic_search', // 动态搜索
  streamline_filter_change: 'jobs_pcv2_discover_streamline_filter_change', // 精细筛选
  sort_change: 'jobs_pcv2_discover_sort_change', // 修改排序
}

export const TABTYPEMAP = {
  talent: 'discover_list',
  dynamic: 'discover_dynamic',
}

export const FILTERITEMS = [
  { name: '近期未查看', key: 'is_exclude_search_seen' },
  { name: '近期未沟通', key: 'is_exclude_touched' },
  { name: '近期有动向', key: 'is_has_dynamic' },
  { name: '投递过', key: 'is_delivery' },
  { name: '企业粉丝', key: 'is_fans' },
  { name: '员工好友', key: 'is_corp_friend' },
]

export const ANALYSIS_TAGS_MAP = {
  current_companys_analysis: '现任',
  ever_companys_analysis: '曾任',
  worktimes_analysis: '经验',
  schools_analysis: '学校',
  pfmj_analysis: '行业',
  province_city_analysis: '城市',
}
