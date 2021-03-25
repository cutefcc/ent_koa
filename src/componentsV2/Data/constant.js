const columns = [
  {
    title: '姓名',
    width: 134,
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '加入时间',
    width: 138,
    dataIndex: 'join_time',
    key: 'join_time',
  },
  { title: '手机号', width: 138, dataIndex: 'mobile', key: 'mobile' },
  {
    title: '活跃天数',
    width: 78,
    dataIndex: 'active_days',
    key: 'active_days',
  },
  {
    title: '沟通过',
    width: 78,
    dataIndex: 'has_contact_total',
    key: 'has_contact_total',
  },
  { title: '加好友', width: 78, dataIndex: 'addfr_total', key: 'addfr_total' },
  {
    title: '索要电话',
    width: 78,
    dataIndex: 'reach_total',
    key: 'reach_total',
  },
  {
    title: '有意向',
    width: 78,
    dataIndex: 'has_intention_total',
    key: 'has_intention_total',
  },
  {
    title: '简历数',
    width: 78,
    dataIndex: 'resume_total',
    key: 'resume_total',
  },
  { title: '在招职位', width: 78, dataIndex: 'jobs_total', key: 'jobs_total' },
  { title: '极速联系', width: 78, dataIndex: 'uh_total', key: 'uh_total' },
]

const columnsV3 = [
  {
    title: '姓名',
    width: 134,
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '加入时间',
    width: 138,
    dataIndex: 'join_time',
    key: 'join_time',
  },
  { title: '手机号', width: 138, dataIndex: 'mobile', key: 'mobile' },
  {
    title: '活跃天数',
    width: 78,
    dataIndex: 'active_days',
    key: 'active_days',
  },
  {
    title: '沟通过',
    width: 78,
    dataIndex: 'has_contact_total',
    key: 'has_contact_total',
  },
  { title: '加好友', width: 78, dataIndex: 'addfr_total', key: 'addfr_total' },
  {
    title: '索要电话',
    width: 78,
    dataIndex: 'reach_total',
    key: 'reach_total',
  },
  {
    title: '有意向',
    width: 78,
    dataIndex: 'has_intention_total',
    key: 'has_intention_total',
  },
  {
    title: '简历数',
    width: 78,
    dataIndex: 'resume_total',
    key: 'resume_total',
  },
  { title: '在招职位', width: 78, dataIndex: 'jobs_total', key: 'jobs_total' },
  {
    title: '立即沟通',
    width: 78,
    dataIndex: 'direct_oppo_total',
    key: 'direct_oppo_total',
  },
]

const dataTypeMap = [
  '沟通过',
  '加好友',
  '索要电话',
  '有意向',
  '简历数',
  '在招职位',
]

module.exports = {
  columns,
  columnsV3,
  dataTypeMap,
}
