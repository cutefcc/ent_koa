import qs from 'querystring'
/**
 * 通用的工具集
 */

// 判断是否为微信浏览器
export function isWeixinBrowser() {
  // 在浏览器的场景下
  return typeof navigator !== 'undefined' &&
    typeof navigator.userAgent !== 'undefined'
    ? /micromessenger/.test(navigator.userAgent.toLowerCase())
    : false
}

// 判断是否为iOS
export function isIOS() {
  return typeof navigator !== 'undefined' &&
    typeof navigator.userAgent !== 'undefined'
    ? /iPhone|iPad|iTouch/i.test(navigator.userAgent)
    : false
}

/**
 * 获得from_page参数
 * params {String} page_session_id
 */
export function getFromPageParam(pageSessionID) {
  const schema = 'taoumaimai://page?'
  let path = ''
  let search = ''
  if (typeof document !== 'undefined') {
    const { referrer = '' } = document
    if (referrer) {
      // eslint-disable-next-line prefer-destructuring
      path = referrer.split('?')[0]
      search = referrer.replace(path, '')
    }
  }

  return `${
    schema +
    qs.stringify({
      mm_page_name: decodeURIComponent(path),
      mm_page_session_id: pageSessionID,
      mm_page_type: 'pc',
    })
  }&${search.substr(1)}`
}

/**
 * 判断字符是不是含有中文
 * params {String} s
 */
export const hasChinese = (s) => {
  return s && s.match(/[\u3400-\u9FBF]/)
}
