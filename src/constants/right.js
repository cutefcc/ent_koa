export const rightTypeMap = {
  addFr: {
    type: 'addFr',
    value: 'add_fr',
    label: '加好友',
    state: [
      {
        key: '1,2',
        label: '全部',
      },

      {
        key: '2',
        label: '已加好友',
      },
      {
        key: '1',
        label: '未回复',
      },
    ],
    filterFields: ['sort_field', 'sort_order', 'right_state'],
    identity: [1, 2, 3, 4, 5], // 可以使用权益的 “角色”， 与 current_user 接口中 identity 字段对应
  },
  directIm: {
    type: 'directIm',
    value: 'direct_im',
    label: '极速联系',
    state: [
      {
        key: '61,62,63,64,65,66',
        label: '全部',
      },
      {
        key: '61,62',
        label: '未回复',
      },
      {
        key: '63,64,65,66',
        label: '已回复',
      },
      // {
      //   key: '66',
      //   label: '已投递',
      // },
    ],
    filterFields: ['sort_field', 'sort_order', 'jid', 'right_state'],
    identity: [1, 2, 3, 4, 5],
  },
  directInvite: {
    type: 'directInvite',
    value: 'direct_invite',
    label: '立即邀约',
    state: [
      {
        key: '71,72,73',
        label: '全部',
      },
      {
        key: '71',
        label: '未回复',
      },
      {
        key: '72',
        label: '沟通中',
      },
      {
        key: '73',
        label: '不感兴趣',
      },
    ],
    filterFields: ['sort_field', 'sort_order', 'jid', 'right_state'],
    identity: [3], // 3 为个人会员，只有个人会员才有 “立即邀约”的权益，所以这里只有 3
  },
}

export const rightStateMap = {
  1: {
    1: '未回复',
    2: '已加好友',
  },
  6: {
    61: '未阅读',
    62: '已阅读',
    63: '已回复',
    64: '已回复',
    65: '已回复',
    66: '已投递',
  },
  7: {
    1: '未回复',
    2: '不感兴趣',
    3: '沟通中',
    4: '已过期',
  },
}

export const DIRECT_INVITE_STATUS_TEXT_MAP = {
  0: '立即邀约',
  1: '已邀约',
  2: '被拒绝',
  3: '沟通中',
  4: '立即邀约',
}

export const DISABLED_INVITE_STATUS = [1, 2]

export const SHOW_INVITE_STATUS = [0, 1, 2, 4]

export const SUCCESS_INVITE_STATUS = [3]
