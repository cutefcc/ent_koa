import * as R from 'ramda'
import { compact, isEmpty } from 'utils'

// 偏好
export const isJobPreferenceEmpty = (jobPreference = {}) => {
  const checkKeys = [
    ['hunt_state', 'value'],
    ['province_cities'],
    ['positions'],
    ['profession_majors'],
    ['salary'],
  ]

  // eslint-disable-next-line no-underscore-dangle
  return R.all(isEmpty, checkKeys.map(R.pathOr('', R.__, jobPreference)))
}

export const isResumeBadgeEmpty = (resumeBadges) => !resumeBadges.length

export const isPreferenceEmpty = (preference) => {
  const {
    job_preference: jobPreference = {},
    resume_badges: resumeBadges = [],
  } = preference
  return isJobPreferenceEmpty(jobPreference) && isResumeBadgeEmpty(resumeBadges)
}

export const isMoreInfoEmpty = (basicInfo) => {
  const showFields = ['ht_province', 'ht_city', 'birthday']
  return compact(showFields.map((field) => basicInfo[field])).length === 0
}

export const isBasicInfoEmpty = (userTag = {}, basicInfo) => {
  return (
    isEmpty(basicInfo.exp) &&
    isEmpty(basicInfo.edu) &&
    !userTag.count &&
    isMoreInfoEmpty(basicInfo)
  )
}

export const isRealnameStatusEmpty = (tabsData) => {
  return !R.propOr(0, 'realname_status', tabsData)
}

export const isCommentEmpty = (comment) => {
  return !R.pathOr(0, ['evaluation_list', 'length'], comment)
}

export const isWorkmate = (currentUser, basicInfo) => {
  const res =
    R.propOr(0, 'cid', currentUser) === R.pathOr(0, ['user', 'cid'], basicInfo)
  return res
}
