/* eslint-disable */
import moment from 'moment'
import * as R from 'ramda'
import React from 'react'
import { ANALYSIS_TITLE_MAP, TABTYPEMAP } from 'constants/talentDiscover'
import Cookie from 'js-cookie'
import { IM_URL } from 'constants'

window.MutationObserver =
  window.MutationObserver ||
  window.WebKitMutationObserver ||
  window.MozMutationObserver

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val
}

export function getTimeDistance(type) {
  const now = new Date()
  const oneDay = 1000 * 60 * 60 * 24

  if (type === 'today') {
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)
    return [moment(now), moment(now.getTime() + (oneDay - 1000))]
  }

  if (type === 'week') {
    let day = now.getDay()
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)

    if (day === 0) {
      day = 6
    } else {
      day -= 1
    }

    const beginTime = now.getTime() - day * oneDay

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))]
  }

  if (type === 'month') {
    const year = now.getFullYear()
    const month = now.getMonth()
    const nextDate = moment(now).add(1, 'months')
    const nextYear = nextDate.year()
    const nextMonth = nextDate.month()

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(
        moment(
          `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
        ).valueOf() - 1000
      ),
    ]
  }

  // Default type === 'year'
  const year = now.getFullYear()
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)]
}

export function getPath(path) {
  return path.charCodeAt(0) === '/' ? path : `/${path}`
}

export function digitUppercase(n) {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ]
  let num = Math.abs(n)
  let s = ''
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(
      /零./,
      ''
    )
  })
  s = s || '整'
  num = Math.floor(num)
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = ''
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p
      num = Math.floor(num / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整')
}

export function formatTimestamp(stamp, format) {
  return moment.unix(stamp).format(format)
}

export function trimObjValue(obj = {}) {
  if (!R.is(Object, obj)) {
    return {}
  }
  const trimValue = (val) => (R.isNil(val) ? val : R.trim(val.toString()))
  return R.mapObjIndexed(trimValue)(obj)
}

export const s4 = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)

export const GUID = () =>
  `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`

export const getRandomString = (len = 10) => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz'
  const maxPos = chars.length
  const pwd = R.range(0, len).map(() =>
    chars.charAt(Math.floor(Math.random() * maxPos))
  )

  return pwd.join('')
}

export const getInterfaceErrorContent = (errors = []) => {
  const keyStyle = { marginRight: 10 }
  return (
    <div>
      {errors.map((el) => {
        return (
          <div key={el.key}>
            <span style={keyStyle}>出错字段:{el.key}</span>
            <span>{el.message}</span>
          </div>
        )
      })}
    </div>
  )
}

/**
 * 传入类似以下的数据,得到一个json，json用于antd的setFields方法
 *
 * [
  {
    key: 'phone',
    msg: '电话有误',
  },
  {
    key: 'price_details',
    id: 1231, //订单id
    msg: '表单金额不对',
  },
  {
    key: 'price_details',
    id: 1232, //订单id
    msg: '表单金额不对',
  },
]
 * @return   {Object}
 */
export const formatFormErrors = (errors = [], formData) => {
  if (R.isEmpty(errors)) {
    return {}
  }

  const special = {
    price_details: (item) => {
      if (!item.id) {
        return {}
      }
      const key = `price-${item.id}`
      return {
        [key]: {
          value: formData[key],
          errors: [new Error(item.msg || item.message || '')],
        },
      }
    },
  }

  const fieldsAndErrors = errors.reduce((obj, item) => {
    const { key } = item
    const func = special[key]
    if (func) {
      return {
        ...obj,
        ...func(item),
      }
    }

    return {
      ...obj,
      [key]: {
        value: formData[key],
        errors: [new Error(item.msg || item.message || '')],
      },
    }
  }, {})

  return fieldsAndErrors
}

export const downloadFile = (url) => {
  window.open(url)
}

// 根据后缀名判断是否是图片
export const isImage = (name) =>
  /\.(png|jpg|jpeg|gif|webp|svg)/.test(name) || /^data:image\//.test(name)

export const isEmpty = (value) =>
  R.isNil(value) ||
  R.isEmpty(value) ||
  (R.is(String, value) && R.trim(value) === '')

export const isUnEmpty = (value) => !isEmpty(value)

/**
 * @param {array} data
 * @param {object} values
 * @param {object} condition
 * 将符合条件（condition）的 值替换为 values 中设定的值
 */
export const setValuesByConditions = (
  data = [],
  values = {},
  condition = {}
) => {
  return data.map((item) => {
    const judgeValues = R.pickAll(Object.keys(condition), item)
    return R.equals(judgeValues, condition) ? { ...item, ...values } : item
  })
}

/**
 * @param {array} data
 * @param {object} values
 * @param {string} key
 * @param {array} range
 * 将 key 的值在 arrage 当中的 values 进行设置
 */
export const setValuesByRange = (
  data = [],
  values = {},
  key = '',
  range = []
) => {
  return data.map((item) => {
    const v = R.is(Function, values) ? values(item) : values
    return range.includes(item[key])
      ? {
          ...item,
          ...v,
        }
      : item
  })
}

// 判断字符是不是含有中文
export const hasChinese = (s) => {
  return s && s.match(/[\u3400-\u9FBF]/)
}

/**
 * Creates an array with all falsey values removed. The values `false`, `null`,
 * `0`, `""`, `undefined`, and `NaN` are falsey.
 *
 * @category Array
 * @param {Array} array The array to compact.
 * @returns {Array} Returns the new array of filtered values.
 * @example
 *
 * compact([0, 1, false, 2, '', 3]);
 * // => [1, 2, 3]
 */
export const compact = (array) => {
  const isReal = (val) => !!val
  return R.filter(isReal, array)
}

/** 防抖
 * @param {function} fn
 * @param {num} tm
 */
export const debounce = (fn, tm) => {
  let timer = null
  return (...argu) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.call(this, ...argu)
    }, tm)
  }
}

/** 截流
 * @param {function} fn
 * @param {num} tm
 */
export const closure = (fn, tm) => {
  let canRun = true
  // eslint-disable-next-line no-unused-vars
  let timer = null
  return (...argu) => {
    if (!canRun) return
    canRun = false
    timer = setTimeout(() => {
      canRun = true
      timer = null
      fn.apply(this, ...argu)
    }, tm)
  }
}

/**
 * 数字转换成k，m，b等格式
 * @param {number} num 待转换的数值
 * @param {number} digits 保留几位小数点，默认是2位
 */
export const nFormatter = (num, digits = 2) => {
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  let i
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol
}

/**
 * 图片预加载
 */
export const preloadImg = (imgs = []) => {
  for (let i = 0; i < imgs.length; i++) {
    const image = new Image()
    image.src = imgs[i]
  }
}

/**
 * 替换 BAT， TMDj 公司名称
 */
export const replaceCompanySpecialCharacter = (v) => {
  return v
    .replace(/BAT/g, '百度,阿里,腾讯')
    .replace(/TMDJ/g, '今日头条,美团,滴滴,京东,字节跳动')
}

export const getUid = () => {
  try {
    const u = R.pathOr(-1, ['share_data', 'auth_info', 'u'], window)
    return u === -1 ? window.uid || Cookie.get('u') || Cookie.get('uid') : u
  } catch (err) {
    return ''
  }
}

/**
 * 组装省份和城市
 * @param {String} province 省份
 * @param {String} city 城市
 * @example
 *
 * var res = formatArea({province: '北京', city: '北京'});
 *
 * console.log(res);
 * // => '北京'
 *
 * var res = formatArea({province: '广西', city: '南宁'});
 *
 * console.log(res);
 * // => '广西·南宁'
 */
export const formatArea = ({ province, city }) => {
  const isAllEmpty = R.all(isEmpty)([province, city])
  if (isAllEmpty) {
    return ''
  }
  if (province === city) {
    return province
  }

  return R.join('·', R.reject(isEmpty, [province, city]))
}

// convert an arr to json, support an array of strings or objects
export const arrToJson = (arr, key = '_id') => {
  const json = {}
  const parseFunc = (item) => {
    let value = ''
    if (R.is(String, key)) {
      value = item[key]
    } else if (Array.isArray(key)) {
      value = R.pathOr('', key, item)
    }
    if (R.is(Object, item) && value) {
      json[value] = item
    } else if (R.is(String, item)) {
      json[item] = true
    }
  }
  R.forEach(parseFunc, arr)
  return json
}

// 跳转到im聊天窗口
export const redirectToIm = (uid) => {
  window.open(
    `${IM_URL}&target=${uid || ''}`,
    '脉脉畅聊版'
    // 'height=600,width=1000'
  )
}

// 判断是否是试用的页面
export const checkIsTrial = () => {
  return window.location.href.includes('/ent/v2/discover/trial')
}

export const isMappingEmpty = (mapping) => {
  return Object.keys(ANALYSIS_TITLE_MAP).every(
    (item) => mapping[item].length === 0
  )
}

// 对 unmount 进行改造, unmount 之后 不能 setState， 防止内存泄漏
// eslint-disable-next-line func-names
export const injectUnmount = function (target) {
  const next = target.prototype && target.prototype.componentWillUnmount
  if (next) {
    // eslint-disable-next-line no-param-reassign,func-names
    target.prototype.componentWillUnmount = function (...params) {
      if (next) next.call(this, ...params)
      this.unmount = true
    }
    // 对setState的改装，setState查看目前是否已经销毁
    const { setState } = target.prototype
    // eslint-disable-next-line no-param-reassign,func-names
    target.prototype.setState = function (...params) {
      if (this.unmount) return
      setState.call(this, ...params)
    }
  }
}

// track event的基本组装
export const trackEvent = (eventName, trackParam = {}) => {
  if (window.voyager) {
    const param = {
      datetime: new Date().getTime(),
      uid: window.uid,
      ...trackParam,
    }
    window.voyager.trackEvent(eventName, eventName, param)
  }
}

// module name
export const getModuleName = (pathname = window.location.pathname) => {
  const pathArray = pathname.split('/')
  const moduleName = pathArray[pathArray.length - 1]
  return moduleName === 'index' || moduleName === 'discover'
    ? 'talentDiscover'
    : moduleName
}

export const appendTalentsList = function* (fn, list, put) {
  // try to load extra info in card
  let extendData = {}
  try {
    extendData = yield fn
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e)
  }

  const extraInfo = R.pathOr({}, ['data', 'data', 'dict'], extendData)

  list.forEach((item) => {
    if (extraInfo[item.id]) {
      // eslint-disable-next-line no-param-reassign
      Object.assign(item, {}, extraInfo[item.id])
    }
  })

  yield dispatchGlobalMask(list, put)

  yield put({
    type: 'talentDiscover/setTalentList',
    payload: list,
  })
}

export const asyncExtraData = (dispatch, list) => {
  const to_uids = list.map((item) => item.id).join(',')
  if (to_uids) {
    dispatch({
      type: 'talentDiscover/fetchExtendData',
      payload: { to_uids },
    })

    dispatch({
      type: 'talentDiscover/fetchDynamicData',
      payload: { to_uids },
    })
  }
}

export const asyncExtraDataNew = (dispatch, list) => {
  const to_uids = list.map((item) => item.id).join(',')
  if (to_uids) {
    dispatch({
      type: 'talentDiscover/fetchExtendDataNew',
      payload: { to_uids },
    })
  }
}

export const dataURItoBlob = (base64Data) => {
  let byteString
  if (base64Data.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(base64Data.split(',')[1])
  else byteString = unescape(base64Data.split(',')[1])
  const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0]
  const ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], { type: mimeString })
}

// 图片blob对象， 回调方法，压缩比例，
export const resizeImg = (
  blobURL,
  callback,
  compressionBase = 0.7,
  maxWidth = 1280,
  maxHeight = 1280
) => {
  let image = new Image()
  image.src = blobURL

  image.onload = function () {
    let canvas = document.createElement('canvas')

    let width = image.width
    let height = image.height

    // calculate the width and height, constraining the proportions
    if (width > height) {
      if (width > maxWidth) {
        height = Math.round((height *= maxWidth / width))
        width = maxWidth
      }
    } else {
      if (height > maxHeight) {
        width = Math.round((width *= maxHeight / height))
        height = maxHeight
      }
    }

    // resize the canvas and draw the image data into it
    canvas.width = width
    canvas.height = height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, width, height)
    if (callback) {
      // toBlob有兼容性
      if (canvas.toBlob) {
        canvas.toBlob(
          (blob) => {
            callback(blob)
          },
          'image/jpeg',
          compressionBase
        )
      } else {
        callback(dataURItoBlob(blobURL))
      }
    }
  }
}

export function* dispatchGlobalMask(list, put) {
  const firstMatchedIndex = list.findIndex(
    (item) =>
      typeof item.resume !== 'undefined' && JSON.stringify(item.resume) !== '{}'
  )
  const firstMatched = list[firstMatchedIndex]
  const maskStatFromLocal = localStorage.getItem('global-mask-show-resume') // todo

  if (firstMatched && maskStatFromLocal !== '0') {
    yield put({
      type: 'global/setMaskConfig',
      payload: {
        visible: true,
        type: 'resume',
      },
    })
    list.splice(firstMatchedIndex, 1)
    list.unshift(firstMatched)

    return [...list]
  }

  return list
}

export function createDownloadLinkWithCb(url, cb) {
  const ele = document.createElement('a')
  ele.href = url
  ele.onclick = () => cb && cb()
  ele.click()
  ele.remove()
}

export function handleDownload(url, eventName, trackParam) {
  try {
    createDownloadLinkWithCb(url, () => {
      window.voyager.trackEvent(eventName, eventName, trackParam)
    })
  } catch (err) {
    throw new Error(err)
  }
}

/**
 * get fr paramter
 * @param {String} currentTab enum('dynamic', 'talent')
 */
export function getFr(currentTab) {
  const suffix = 'pc'
  const module = getModuleName()

  return `${module}_${TABTYPEMAP[currentTab]}_${suffix}`
}
