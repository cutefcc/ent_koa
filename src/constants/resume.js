export const RESUME_STATE_MAP = {
  todo: '待办',
  follow: '跟进',
  complete: '合适',
  elimination: '不合适',
}

export const DEFAULT_STATE = 'todo'

export const COMMON_INIT_MESSAGE =
  '你好，感谢您对我的认可。贵公司的邀请我会非常重视，收到您的留言后，我会尽快回复 :)'

export const REPLY_INIT_MESSAGE = '您好，这是我的简历，请查阅，期盼您的回复 :)'

export const RESUME_SOURCE_MAP = {
  search: '搜索',
  recommend: '系统推荐',
  delivery: '主动投递',
}

export const RIGHT_SOURCE = [
  {
    name: 'search',
    id: 1,
  },
  {
    name: 'recommend',
    id: 2,
  },
  {
    name: 'promote',
    id: 3,
  },
  {
    name: 'real_recommend',
    id: 4,
  },
  {
    name: 'group',
    id: 5,
  },
  {
    name: 'talent_pool_delivery',
    id: 6,
  },
  {
    name: 'talent_pool_profile',
    id: 7,
  },
  {
    name: 'talent_pool',
    id: 8,
  },
  {
    name: 'applicant',
    id: 9,
  },
  {
    name: 'im',
    id: 10,
  },
  {
    name: 'channel',
    id: 11,
  },
  {
    name: 'profile',
    id: 12,
  },
  {
    name: 'visitor',
    id: 13,
  },
  {
    name: 'right_addFr',
    id: 14,
  },
  {
    name: 'channel_brief_discover',
    id: 15,
  },
  {
    name: 'channel_brief',
    id: 16,
  },
  {
    name: 'search_v2',
    id: 17,
  },
]

export const TRACKEVENTNAMEMAP = {
  2: {
    event: 'jobs_pc_talent_resume_unsuitable_',
    label: '不合适',
  },
  1: {
    event: 'jobs_pc_talent_resume_adopt_',
    label: '通过初筛',
  },
  3: {
    event: 'jobs_pc_talent_resume_recovery_',
    label: '恢复初筛',
  },
  5: {
    event: 'jobs_pc_talent_resume_communicate_',
    label: ' 立即沟通',
  },
}

export const headerDataList = [
  { text: '待处理', valueKey: 'pending_count', tp: 0 },
  { text: '待沟通', valueKey: 'interest_count', tp: 1 },
  { text: '储备人才', valueKey: 'reserve_talent_cnt', tp: 3 },
  { text: '不合适', valueKey: 'notprop_count', tp: 2 },
]
