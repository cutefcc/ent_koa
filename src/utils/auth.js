import { showMosaic, checkIsCompanyAdministrator } from 'utils/account'
import { isDemoUid } from 'utils/talentReport'

import * as R from 'ramda'

// 非招聘个人会员且非企业会员
export const isPersonalUser = (currentUser = {}) =>
  currentUser.identity === 3 &&
  R.pathOr(5, ['mem', 'mem_id'], currentUser) !== 5
// 企业招聘会员 新版本3.0 identity = 6
export const isEnterpriseRecruiter = (currentUser = {}) =>
  currentUser.identity === 1 ||
  currentUser.identity === 2 ||
  currentUser.identity === 6
// 个人招聘会员
export const isPersonalRecruiter = (currentUser = {}) =>
  currentUser.identity === 3 &&
  R.pathOr(6, ['mem', 'mem_id'], currentUser) === 5

// 人才银行3.0
export const isTalentBankStable = currentUser => currentUser.identity === 6

// 企业号付费
export const isCompanyPayUser = (currentUser = {}) =>
  currentUser.bprofileCompanyUser.company.sale_type === 1
// 企业号单独付费功能权限
export const isCompanyExtraPay = (currentUser = {}, type) =>
  currentUser.bprofileCompanyUser.company.auths[type] === 1

export const getCurrentUserRole = (currentUser = {}) => {
  if (isPersonalUser(currentUser)) {
    return 'personalUser'
  }
  if (isEnterpriseRecruiter(currentUser)) {
    return 'enterpriseRecruiter'
  }
  if (isPersonalRecruiter(currentUser)) {
    return 'personalRecruiter'
  }

  return ''
}

export const computeLimitAdvancedMultipleSearch = user =>
  getCurrentUserRole(user) === 'personalUser'

// 是否展示回复率文案
export const computeShowResponseRateText = user => {
  const role = getCurrentUserRole(user)
  return role === 'personalUser' || role === 'personalRecruiter'
}

// 是否展示意愿文案
export const computeShowWillingText = user =>
  getCurrentUserRole(user) === 'enterpriseRecruiter'

const isAdmin = user => !!R.path(['ucard', 'is_adm'], user)

// 是都拥有人才报告权限
const isTalentReport = user => !!R.path(['talent_report', 'is_check'], user)

const hasOpinionRight = user =>
  !!R.path(['bprofileCompanyUser', 'company', 'auths', 'auth_opinion'], user)

const isDev = () => window.location.origin !== 'https://maimai.cn'

const computeValidUrls = user => {
  const urls = []

  if (isTalentBankStable(user)) {
    // 人才银行3.0
    urls.push(
      '/ent/v3/index', // v3首页
      '/ent/v3/recommend', // 推荐人才
      '/ent/v3/index/subscribe', // 订阅推荐
      '/ent/v3/index/groups', // 人才储备
      '/ent/v3/discover', // v3发现人才
      '/ent/v2/job', // 职位一级菜单
      '/ent/v2/job/positions', // 职位列表
      '/ent/v2/job/positions/publish/:ejid?', // 发布职位
      '/ent/v2/job/resumes', // 简历列表
      '/ent/v2/job/recommend', // 推荐人才
      '/ent/v2/channels', // 人才银行一级页面
      '/ent/v2/channels/:id', // 人才银行二级页面
      '/ent/v2/asset', // 资产一级菜单
      '/ent/v2/asset/personal' // 个人资产
    )
  } else if (isEnterpriseRecruiter(user)) {
    // 企业招聘会员
    urls.push(
      '/ent/v2/discover', // 发现人才
      '/ent/v2/job', // 职位一级菜单
      '/ent/v2/job/positions', // 职位列表
      '/ent/v2/job/positions/publish/:ejid?', // 发布职位
      '/ent/v2/job/resumes', // 简历列表
      '/ent/v2/job/recommend', // 推荐人才
      '/ent/v2/channels', // 人才银行一级页面
      '/ent/v2/channels/:id', // 人才银行二级页面
      '/ent/v2/asset', // 资产一级菜单
      '/ent/v2/asset/personal' // 个人资产
    )
  } else {
    urls.push(
      // '/ent',
      '/ent/talents/discover/search_v2', // 发现人才
      '/ent/v2/discover', // 发现人才
      '/ent/v2/job', // 职位一级菜单
      '/ent/v2/job/positions', // 职位列表
      '/ent/v2/job/resumes', // 简历列表
      '/ent/v2/job/recommend', // 推荐人才

      // 以下为旧版页面
      '/ent/talents/discover/recommend', // 推荐人才
      '/ent/talents/recruit', // 招聘管理
      '/ent/talents/recruit/positions', // 职位管理
      '/ent/talents/recruit/positions/modify/:ejid?', // 编辑职位
      '/ent/talents/recruit/resumes', // 简历管理
      '/ent/talents/recruit/follow/right', // 人才追踪
      '/ent/talents/recruit/positions/add/:ejid?' // 发布职位
    )
  }

  if (isAdmin(user)) {
    urls.push(
      '/ent/v2/asset/enterprise', // 企业资产
      '/ent/v2/data/enterprise' // 数据报告
    )
  }

  if (isTalentReport(user)) {
    urls.push(
      '/ent/v2/data/talentreport' // 人才报告
    )
  }

  // // yuning demo演示账号
  // if (isDemoUid(window.uid)) {
  //   urls.push(
  //     '/ent/v2/data/talentreport' // 人才报告
  //   )
  // }

  // 舆情监控白名单
  if (hasOpinionRight(user)) {
    urls.push(
      '/ent/v2/sentiment' // 舆情监控
    )
  }

  // 企业号
  if (checkIsCompanyAdministrator(user.bprofileCompanyUser)) {
    urls.push(
      '/ent/v2/company', // 企业号主菜单
      '/ent/v2/company/home', // 企业号管理首页
      '/ent/v2/company/data', // 企业号数据
      '/ent/v2/company/admin', // 企业号管理
      '/ent/v2/company/admin/position', // 职位展台
      '/ent/v2/company/admin/album', // 企业相册
      '/ent/v2/company/admin/productions',
      '/ent/v2/company/admin/info', // 企业号管理【基础信息】
      '/ent/v2/company/admin/identify', // 员工身份认证
      '/ent/v2/company/ope',
      '/ent/v2/company/ope/employerPush', // 给员工推送问答
      '/ent/v2/company/ope/employerSpread', // 雇主定向推广
      '/ent/v2/company/taskCenter', // 任务中心
      '/ent/v2/company/ope/questionAnswer' //回答问题
    )
    // if (isEnterpriseRecruiter(user)) {
    //   urls.push(
    //     '/ent/v2/company/ope/employerSpread' // 雇主定型推广
    //   )
    // }
  }

  if (isDev()) {
    urls.push(
      '/ent/v2/discover/login' // 本地登录
    )
  }

  urls.push(
    '/ent/v2/discover/trial' // 试用页面
  )

  return urls
}

const computeAuth = (user = {}) => {
  const mosaic = showMosaic(user)
  const limitAdvancedMultipleSearch = computeLimitAdvancedMultipleSearch(user)
  const showWillingText = computeShowWillingText(user)
  const showResponseRateText = computeShowResponseRateText(user)

  return {
    limitDynamicCount: !isEnterpriseRecruiter(user) || mosaic, // 是否限制动态展示条数，如权限较低一般限制展示50条
    limitAnalysis: mosaic, // 是否限制数据分析模块展示
    limitAdvancedMultipleSearch, // 是否限制AdvancedSearch模块的多个筛选条件
    limitFollowCompany: mosaic, // 是否限制分组里'添加关注公司'按钮的展示

    showWillingText, // 是否展示意愿文案
    showResponseRateText, // 是否展示回复率文案

    isPersonalUser: isPersonalUser(user), // 是否是个人会员
    isEnterpriseRecruiter: isEnterpriseRecruiter(user), // 企业招聘会员
    isCompanyPayUser: isCompanyPayUser(user), // 企业号付费用户
    isCompanyExtraPay, // 单独付费功能
    role: getCurrentUserRole(user), // 当前用户角色

    validUrls: computeValidUrls(user), // 允许访问的 urls
    isTalentBankStable: isTalentBankStable(user),
  }
}

export default computeAuth
