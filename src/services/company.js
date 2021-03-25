import request from 'utils/request'
import urlParse from 'url'
import { getCookie } from 'tiny-cookie'
import * as R from 'ramda'

function getUrlQuery() {
  const urlObj = urlParse.parse(window.location.search, true)
  return R.path(['query'], urlObj)
}

export function fetchDynamicList(payload) {
  return request('/bizjobs/company/manage/get_enterprise_feeds', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}
//获取问题的列表
export function fetchQuestionList(payload) {
  return request('/bizjobs/company/manage/company_asking_list', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}
//添加回答问题接口
export function answerQuestion(payload) {
  return request('/bizjobs/company/manage/answer', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}

//问答动态列表
export function answerDynamicList(payload) {
  return request('/bizjobs/company/manage/get_enterprise_feeds', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}
//回答问题列表
export function getAnswerList(payload) {
  return request('/bizjobs/company/manage/enterprise_feed_detail_comment', {
    query: {
      ...payload,
    },
  })
}
//问答动态-置顶回答接口
export function toppingCompanyAnswer(payload) {
  return request('/bizjobs/company/manage/topping_company_answer', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}
//问答动态-移除回答接口
export function removeCompanyAnswer(payload) {
  return request('/bizjobs/company/manage/remove_company_answer', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}
//点赞接口
export function answerLike(payload) {
  return request('/bizjobs/company/manage/like_answer', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}
//获取一级回答列表
export function getFirstCommmentList(payload) {
  return request('/bizjobs/company/manage/get_answers', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}
//获取二级回答列表
export function getSecondCommmentList(payload) {
  return request('/bizjobs/company/manage/get_lv2_answers', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}
//删除一级回答列表
export function deleteFirstAnswer(payload) {
  return request('/bizjobs/company/manage/delete_answer', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}

export function fetchEnterpriseData(payload) {
  return request('/bizjobs/company/manage/get_enterprise_datas', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}

export function removeEmployeeFeed(payload) {
  return request('/bizjobs/company/manage/remove_employee_feed', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}

export function deleteCompanyFeed(payload) {
  return request('/bizjobs/company/manage/del_company_feed', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}

export function sendToFans(payload) {
  return request('/bizjobs/company/manage/im_send_to_company_fans', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}

export function fetchTendencyData(payload) {
  return request('/bizjobs/company/manage/tendency_chart', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}

export function fetchCompanyFansPortrait(payload) {
  return request('/bizjobs/company/manage/company_fans_portrait', {
    query: {
      ...payload,
      ...getUrlQuery(),
    },
  })
}

export function employerPre(payload) {
  return request('/api/ent/employer/promote/pre', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
      webcid: payload.webcid,
    },
    body: payload,
  })
}

export function employerPreCount(payload) {
  return request('/api/ent/employer/promote/pre_count', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
      webcid: payload.webcid,
    },
    body: payload,
  })
}

export function employerAdd(payload) {
  return request('/api/ent/employer/promote/add', {
    method: 'POST',
    query: {
      channel: 'www',
      version: '1.0.0',
      webcid: payload.webcid,
    },
    body: payload,
  })
}

export function employerList(payload) {
  return request('/api/ent/employer/promote/list', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

// 曝光币使用明细
export function fetchEpbDetail(payload) {
  return request('/api/ent/employer/promote/exposure_coins_log', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function uploadImg(payload) {
  return request('/upfile_for_company', {
    method: 'POST',
    body: payload,
  })
}

export function setOnTop(payload) {
  return request('/bizjobs/company/manage/set_on_top', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function getTopicPush(payload) {
  return request('/bizjobs/company/manage/get_enterprise_topic_infos', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function sendTopicPush(payload) {
  return request('/bizjobs/company/manage/add_enterprise_topic_task', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function removeTopicPush(payload) {
  return request('/bizjobs/company/manage/delete_enterprise_topic_task', {
    query: {
      ...payload,
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function preUpload(payload) {
  return request('/bizjobs/company/manage/pre_upload_video', {
    query: {
      ...payload,
      u: getCookie('u'),
      channel: 'www',
      version: '1.0.0',
    },
  })
}

export function parseUrl(payload) {
  return request('/groundhog/feed/v5/parse_url', {
    query: {
      uid: getCookie('u'),
      ...payload,
      channel: 'www',
      version: '4.0.0',
    },
  })
}

export function addFeed(payload) {
  return request('/groundhog/cooperation/add_company_feed', {
    query: {
      u: getCookie('u'),
      channel: 'www',
      version: '4.0.0',
    },
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: {
      ...payload,
    },
  })
}

export function getCompanyJobListService(payload) {
  return request('/bizjobs/getCompanyJobListService', {
    query: {
      ...payload,
    },
  })
}
// 点赞feed
export function likeFeed(payload) {
  return request('/bizjobs/company/manage/enterprise_likefeed', {
    query: {
      ...payload,
    },
  })
}

// 企业号feed 评论列表
export function getCommmentList(payload) {
  return request('/bizjobs/company/manage/enterprise_feed_detail_comment', {
    query: {
      ...payload,
    },
  })
}

//  企业号feed二级评论
export function getCommmentLv2List(payload) {
  return request('/bizjobs/company/manage/enterprise_get_lv2_cmts', {
    query: {
      ...payload,
    },
  })
}

// 添加评论
export function addCmt(payload) {
  return request('/bizjobs/company/manage/enterprise_addcmt', {
    query: {
      ...payload,
    },
  })
}

// 点赞评论
export function likeCmt(payload) {
  return request('/bizjobs/company/manage/enterprise_likecmt', {
    query: {
      ...payload,
    },
  })
}

// 删除评论
export function delCmts(payload) {
  return request('/bizjobs/company/manage/enterprise_delcmts', {
    query: {
      ...payload,
    },
  })
}

// 周报
export function getWeeklyReport(payload) {
  return request('/bizjobs/company/manage/get_weekly_feed_report', {
    query: {
      channel: 'www',
      version: '4.0.0',
      ...payload,
    },
  })
}

// 使用加速包，移除角标
export function removeExposureTag(payload) {
  return request('/bizjobs/company/manage/remove_exposure_tag', {
    query: {
      channel: 'www',
      version: '4.0.0',
      ...payload,
    },
  })
}

// 获取企业号中定向推广中雇主活动的默认值
export function fetchEmployerDefaulValue(payload) {
  return request('/company/company_activity_101_manage', {
    query: {
      channel: 'www',
      version: '4.0.0',
      ...payload,
    },
    method: 'GET',
  })
}
export function getTaskData(payload) {
  return request('/bizjobs/company/manage/enterprise_encourage_info', {
    query: {
      channel: 'www',
      version: '4.0.0',
      ...payload,
    },
  })
}
// 获取企业号权限
export function fetchAuthorityList(payload) {
  return request('/bizjobs/company/manage/admin_tab_list', {
    query: {
      ...payload,
    },
  })
}
