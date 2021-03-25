import { dateToStr } from 'utils/date'

const getModayDate = () => {
  const date = new Date()
  // 本周一的日期
  const day = date.getDay() || 7
  date.setDate(date.getDate() - day + 1)
  return dateToStr(date)
}

export const getIsIgnoreShowTalentMap = () =>
  window.localStorage.getItem('isIgnoreShowTalentMap')

export const setIsIgnoreShowTalentMap = (data) => {
  window.localStorage.setItem('isIgnoreShowTalentMap', data)
}

export const removeIsIgnoreShowTalentMap = () => {
  window.localStorage.removeItem('isIgnoreShowTalentMap')
}

export const getHadShowTalentMap = () =>
  window.localStorage.getItem('hadShowTalentMap')

export const setHadShowTalentMap = (data) => {
  window.localStorage.setItem('hadShowTalentMap', data)
}

export const removeHadShowTalentMap = () => {
  window.localStorage.removeItem('hadShowTalentMap')
}

export const setShowTalentMapDate = () => {
  window.localStorage.setItem('showTalentMapDate', getModayDate())
}

export const removeShowTalentMapDate = () => {
  window.localStorage.removeItem('showTalentMapDate')
}

export const isShowTalentMapDate = () => {
  return window.localStorage.getItem('showTalentMapDate') === getModayDate()
}
