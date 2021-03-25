import moment from 'moment'
import { isToday, isYesterday, isThisYear } from 'date-fns'

export const dateFormat = 'YYYY-MM-DD'
export const dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'
export const timeFormat = 'HH:mm:ss'

export const unixToStr = (unixDate, format = dateFormat) =>
  moment.unix(unixDate).format(format)

export const dateToStr = (date, format = dateFormat) =>
  moment(date).format(format)

/**
 * @param {string} string 需要转换的日期  如 2018-09-01
 * @param {string} stringFormat 传入的日期格式  如: 2018-09-01 对应 'YYYY-MM-DD'
 * @param {string} format 转化成的最终格式 如 'M-D' 则将 2018-09-01 转换为 9-1
 */
export const strToStr = (
  string,
  stringFormat = dateFormat,
  format = dateFormat
) => unixToStr(moment(string, stringFormat).unix(), format)

export const unixToMoment = (unixDate) => moment.unix(unixDate)

export const momentToUnix = (momentDate) => momentDate.unix()

export const isValidUnix = (unixDate) => moment.unix(unixDate).isValid()

export const nowUnix = () => parseInt(new Date().getTime() / 1000, 10)

/**
 * [getDaysDiff
 * 返回两个时间间隔天数。比如 1月1日 到 1月4日 返回：3
 * 注意：开始时间可以小于等于结束时间
 * ]
 * @param  {[unixTimestamp]}  unixDateStart [开始时间]
 * @param  {[unixTimestamp]}  unixDateEnd   [结束时间]
 * @param  {Boolean}          isInclude     [是否包含开始日期]
 * @return {[unmber]}                       [自然数]
 */
export function getDaysDiff(unixDateStart, unixDateEnd, isInclude = false) {
  const dateStart = moment(moment.unix(unixDateStart).format(dateFormat))
  const dateEnd = moment(moment.unix(unixDateEnd).format(dateFormat))
  const durationDays = Math.abs(
    moment.duration(dateStart.diff(dateEnd)).asDays()
  )

  return isInclude ? durationDays + 1 : durationDays
}

export const strToUnix = (dateString) => moment(dateString).unix()

export const unixAddDay = (unixDate, addDays = 0) =>
  moment.unix(unixDate).add(addDays, 'days').unix()

export const toDayUnixAddDay = (addDays = 0) =>
  moment().startOf('day').add(addDays, 'd').unix()

/**
 * 将以秒为单位的时间差，转换成 天 时 分 秒 的值
 * @param {number} diff
 * @returns {object} {days: 0, hours: 1, minutes: 3, seconds: 3}
 */
export const computeTimeDiff = (diff = 0) => {
  // 计算出相差天数
  const days = Math.floor(diff / (24 * 3600 * 1000))

  // 计算出小时数
  const leave1 = diff % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000))

  // 计算相差分钟数
  const leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000))

  // 计算相差秒数
  const leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  const seconds = Math.round(leave3 / 1000)

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

/**
 * 获取从当前日期到给定日期剩余的时间
 * @param {string} date '2018-09-09 00:00:00'
 * @return {string} 'X天X时X分X秒'
 */
export const computeTimeRemain = (date) => {
  const timeStamp = strToUnix(date)
  const now = new Date().getTime()
  const diff = timeStamp - now / 1000
  const invalid = !isValidUnix(timeStamp) || diff < 0
  if (invalid) {
    return 0
  }
  const diffObj = computeTimeDiff(diff * 1000)
  const days = diffObj.days ? `${diffObj.days}天` : ''
  const hours = diffObj.hours ? `${diffObj.hours}时` : ''
  const minutes = diffObj.minutes ? `${diffObj.minutes}分` : ''
  const seconds = diffObj.seconds ? `${diffObj.seconds}秒` : ''
  return `${days}${hours}${minutes}${seconds}`
}

/**
 * 生成脉脉展示时间的格式
 * @param {string} time = '2018-09-09 00:00:00'
 */
export const getMMTimeStr = (time) => {
  // 今天
  if (isToday(time)) {
    return `今天 ${strToStr(time, dateTimeFormat, 'H:mm')}`
  }

  if (isYesterday(time)) {
    return `昨天 ${strToStr(time, dateTimeFormat, 'H:mm')}`
  }

  if (isThisYear(time)) {
    return `${strToStr(time, dateTimeFormat, 'M月D日 H:mm')}`
  }

  return `${strToStr(time, dateTimeFormat, 'YY年M月D日 HH:mm')}`
}

/**
 * 基于今天00:00:00 的时间戳，返回任意时间的时间戳（ms）
 * @param {number} offset = 24 * 60 * 60 * 1000
 * @return {number}
 */
export const getTimeStampBaseTaday = (offset) => {
  return new Date(new Date().toLocaleDateString()).getTime() + offset
}
