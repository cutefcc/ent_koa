// import fetch from 'fetch'
import queryString from 'query-string'
import urlParse from 'url'
import * as R from 'ramda'
import { isEmpty } from 'utils'
import urlencode from 'urlencode'

import { SIGN_IN_URL } from 'constants'
// import {GUID} from './index'

let CSRFToken = ''
const isJson = (response) => {
  if (response.status === 204) {
    return false
  }

  if (response.headers.get('content-length') === '0') {
    return false
  }

  const type = response.headers.get('content-type')
  return type && type.indexOf('application/json') !== -1
}

// const isSuccess = (status, data) =>
//   ((status >= 200 && status < 300) || status === 304) &&
//   (data.code === undefined || data.code === 0)

const getMessage = (data) => R.prop('msg', data) || R.path('error', data) || ''

/* eslint-disable */
const parseError = async (status, data) => {
  const msg = getMessage(data)
  const { href: currentUrl, origin, pathname } = window.location

  if (status >= 500) {
    throw new Error(msg || '服务器太繁忙了，请稍后重试哦！')
  } else if (status === 404) {
    if (data.redirectUrl) {
      window.location = data.redirectUrl
    } else {
      throw new Error('没有您要的服务，请刷新页面！')
    }
  } else if (status === 401 || status === 403) {
    // 本地登录
    if (pathname === '/ent/v2/discover/login') return
    if (origin !== 'https://maimai.cn') {
      window.location = '/ent/v2/discover/login'
      return
    }

    window.location = `${SIGN_IN_URL}?to=${urlencode(currentUrl)}`
  } else if (status >= 400 && status < 500) {
    throw data
  } else if (status === 200 || status === 304) {
    if (data.error_code === 20002 || data.error_code === 20001) {
      // 本地登录
      if (pathname === '/ent/v2/discover/login') return
      if (origin !== 'https://maimai.cn') {
        window.location = '/ent/v2/discover/login'
        return
      }
      window.location = `${SIGN_IN_URL}?to=${urlencode(currentUrl)}`
    }
    if (data.code !== undefined && data.code !== 0) {
      throw new Error(msg || '未知错误')
    }
    if (data.result === 'error' && data.error_msg) {
      throw new Error(data.error_msg)
    }
    if (
      data.code === undefined &&
      data.result !== undefined &&
      data.result !== 'ok'
    ) {
      throw new Error(msg || '未知错误')
    }
    if (data.code === undefined && data.error && data.error_code) {
      throw new Error(data.error_msg || data.error || '')
    }
  } else if (status >= 300) {
    throw new Error(msg || '未知错误')
  }
  return data
}
/* eslint-disable */

const parseUrl = (url, options) => {
  if (typeof options.query === 'object') {
    const urlObj = urlParse.parse(url, true)
    const query = queryString.stringify({
      ...urlObj.query,
      ...options.query,
      // ...(window.location.hostname !== 'maimai.cn'
      //   ? {uid: window.uid || 19027922}
      //   : {}),
    })
    if (!isEmpty(urlObj.hostname)) {
      return `${urlObj.protocol}//${urlObj.hostname}${urlObj.pathname}?${query}`
    }
    return `${urlObj.pathname}?${query}`
  }
  return url
}

const fillOptions = ({ body, ...options }) => {
  const corsOption = {
    mode: 'same-origin',
    credentials: 'same-origin',
  }
  const newOptions = {
    ...corsOption,
    ...options,
  }

  const headers = new Headers(newOptions.headers || {})
  if (CSRFToken) {
    headers.set('X-CSRF-Token', CSRFToken)
  }

  newOptions.headers = headers

  if (body && !(body instanceof FormData)) {
    return {
      ...newOptions,
      // body: JSON.stringify(body),
      body:
        R.path(['headers'], newOptions).get('Content-Type') ===
        'application/x-www-form-urlencoded'
          ? queryString.stringify(body)
          : JSON.stringify(body),
    }
  } else if (body instanceof FormData) {
    return {
      ...newOptions,
      body,
    }
  }

  return newOptions
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * options.body {object} 可选
 * options.query {object} 可选, 会和url里面的 ?search进行合并
 * options.method {string} 必选  为大写的字符串
 * [...以及其他一些可选的字段 会拼到fetch方法的参数里面]
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options = {}) {
  // 添加默认options
  const newOptions = fillOptions(options)

  // 处理query参数
  const newUrl = parseUrl(url, options)

  let response = await fetch(newUrl, newOptions)

  // 如果是 204 ， 需要重新生成 csrf-token 再请求一次
  if (response.status === 204) {
    CSRFToken = response.headers.get('X-CSRF-Token')
    newOptions.headers.set('X-CSRF-Retry', 1)
    newOptions.headers.set('X-CSRF-Token', CSRFToken)

    if (CSRFToken) {
      response = await fetch(newUrl, {
        ...newOptions,
        headers: newOptions.headers,
      })
    }
  }

  const jsonFlag = isJson(response)

  const data =
    R.path(['headers', 'Content-Type'], newOptions) === 'application/json' &&
    !jsonFlag
      ? {
          code: 1,
          msg: '服务器开小差了，请稍后重试',
          data: {},
        }
      : jsonFlag
      ? await response.json()
      : await response.text()

  const ret = {
    data: await parseError(response.status, data),
    headers: response.headers,
  }
  if (response.headers.get('x-total-count')) {
    ret.headers['x-total-count'] = response.headers.get('x-total-count')
  }
  return ret
}
