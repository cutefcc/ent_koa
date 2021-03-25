/*  eslint-disable */

import qs from 'querystring'
import Cookie from 'js-cookie'
import * as R from 'ramda'
import { getFromPageParam, hasChinese } from './utility/utils'

import { request } from './utility/request'
import { md5Hash } from './utility/md5'
import { uuid } from './utility/uuid'
import { xor } from './utility/xor'
import { jsonSize } from './utility/jsonSize'

const track = Symbol('track')

export default class Voyager {
  static url = 'https://track.mm.taou.com/v2/track?' // 请求链接
  static eventList = [] // 事件列表
  static currentDurableEvents = [] // 当前持续事件列表
  static defaultParams = {
    app: 'maimai',
    lang: navigator.language || navigator.userLanguage,
    qilu: 0,
    from_page: document.referrer,
    page: window.location.href,
    event_source: 'web',
    mm_app_id: 0,
    duration: 0,
  } // 默认参数
  constructor(options) {
    // 构造函数配置选项
    this.pageViewProcess(options.pageViewParams || {})
    // 尝试重新发送失败的数据
    this.rensendFailedData()
  }

  defaultParams = {
    app: 'maimai',
    qilu: 0,
    lang: navigator.language || navigator.userLanguage,
    event_source: 'web',
    mm_app_id: 0,
    duration: 0,
  }

  getDefaultParams = () => {
    const fromPage = getFromPageParam(this.defaultParams.page_session_id)
    return {
      ...this.defaultParams,
      from_page: fromPage,
      src_page: fromPage,
      page: this.getPageParams(),
    }
  }

  /**
   * 获取通用page参数，仅用于浏览器环境
   * 其它场景下，继承的子类可以覆盖该方法
   */
  getPageParams() {
    return typeof window !== 'undefined' ? window.location.href : ''
  }

  setDefaultParams = (params) => {
    this.defaultParams = {
      ...this.defaultParams,
      ...params,
    }
  }

  refreshPageSessionId = (params) => {
    const pageSessionId = uuid()
    this.defaultParams = {
      ...this.defaultParams,
      raw_session_id: pageSessionId,
      page_session_id: pageSessionId,
    }
  }

  /**
   * 处理持续的页面停留事件，对page_view进行单独统计
   * @param {Object} params 额外参数
   * @param {String} event_key 用于区分同样name的多个event, 如果事件不会并行，可以为空
   */
  pageViewProcess(params = {}) {
    // this.callPageViewEvent('begin', params)

    // 有关事件的兼容性，参见https://docs.taou.com/pages/viewpage.action?pageId=20688675 兼容性说明
    if (/iPhone|iPad|iTouch/i.test(navigator.userAgent)) {
      window.addEventListener('unload', () => {
        this.callPageViewEvent('end', params)
      })
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.callPageViewEvent('end', params)
      }

      // fires when app transitions from prerender, user returns to the app / tab.
      if (document.visibilityState === 'visible') {
        // 重新创建新的PageView持续事件
        this.callPageViewEvent('begin', params)
      }
    })
  }
  /**
   * 开始跟踪PageView
   * @param {String} type begin/end
   * @param {Object} params 额外参数
   */
  callPageViewEvent(type, params) {
    const { MaiMai_Native } = window
    // 站内和站外分别进行调用客户端方法和js web sdk
    if (type === 'begin') {
      const durableEvent = this.initDurableEvent('page_view', params)
      if (this.isInApp()) {
        MaiMai_Native &&
          MaiMai_Native.log_v2_begin_event &&
          MaiMai_Native.log_v2_begin_event('page_view', '', params, false)
      } else {
        this[track](durableEvent.events[0])
      }
    } else if (type === 'end') {
      const endEvent = this.getCurrentPageViewEvent()
      if (endEvent.length) {
        if (this.isInApp()) {
          MaiMai_Native &&
            MaiMai_Native.log_v2_end_event &&
            MaiMai_Native.log_v2_end_event('page_view', '', params, false)
        } else {
          this[track](endEvent[0].events[1])
        }
      } else {
        // throw new Error('get current page view event failed!')
      }
    }
  }
  /**
   * 初始化PageView持续事件(begin/end)配置项
   * @param {String} event_name 事件名称
   * @param {Object} params 额外参数
   * @return {Object} result 返回配置项信息
   */
  initDurableEvent(event_name, params) {
    const event_id = uuid() // 页面开始的event_id
    // 页面开始
    const beginOpts = {
      event_id: event_id,
      event_name: event_name,
      event_type: 'begin',
      params,
    }

    const endOpts = Object.assign({}, beginOpts, {
      begin_event_id: event_id,
      event_id: uuid(),
      event_type: 'end',
    })

    const durableEvent = {
      event_id,
      event_name,
      events: [beginOpts, endOpts],
    }

    Voyager.currentDurableEvents.push(durableEvent) // 将持续事件压入队列中
    return durableEvent
  }
  /**
   * 获取最新的PageView事件
   */
  getCurrentPageViewEvent() {
    return Voyager.currentDurableEvents
      .reverse()
      .filter((item) => item.event_name === 'page_view')
  }
  /**
   * 追踪事件 public方法
   * @param {String} eventName 事件名称
   * @param {String} eventKey 持续事件的key, 用来区分用一个name的不同事件. 可能是feed_id之类的
   */
  trackEvent(event_name, event_key = '', params = {}) {
    if (typeof event_name !== 'string' || event_name === '') {
      throw new Error('eventName is neccessary while call trackEvent fn ')
    }

    if (!window.uid) {
      setTimeout(() => this.trackEvent(event_name, event_key, params), 500)
      return
    }
    const options = {
      event_name,
      event_key,
      params: {
        ...params,
        uid: window.uid,
      },
    } // 初始化选项

    // console.log('全局打点', options)

    const { MaiMai_Native } = window
    // 站内和站外分别进行调用客户端方法和js web sdk
    if (this.isInApp()) {
      try {
        MaiMai_Native &&
          MaiMai_Native.log_v2_track_event &&
          MaiMai_Native.log_v2_track_event(event_name, JSON.stringify(params))
      } catch (err) {
        throw new Error(err)
      }
    } else {
      return this[track](options)
    }
  }
  /**
   * 追踪事件 private方法
   * @param {Object} options 打点选项
   */
  async [track](options) {
    if (this.isInApp()) {
      return
    }
    let opts = Object.assign({}, this.getDefaultParams(), options, {
      page: R.pathOr(window.location.href, ['params', 'page'], options),
    }) // 每次事件的配置选项, 合并af数据
    opts.event_id = opts.event_id || uuid()
    opts.timestamp = new Date().getTime()
    opts.event_type = opts.event_type || 'single' // event_type为single/begin/end
    if (typeof opts.params !== 'undefined' && typeof opts.params === 'object') {
      try {
        opts = Object.assign({}, opts.params, opts)
        delete opts.params
      } catch (err) {
        throw new Error('stringify opts.params ', opts.params, ' failed', err)
      }
    }
    // 计算时长
    if (opts.event_type === 'end') {
      const currentBeiginEvent = Voyager.eventList.filter(
        (item) => item.event_id === opts.begin_event_id
      )
      if (!currentBeiginEvent) {
        return
      }
    }
    opts.browser_id = this.getBrowserId() // 浏览器id
    opts.uid = this.getUid() // 用户u
    // opts.country = this.getCountry(); // 暂时去掉

    if (!this.checkBodySize(opts)) {
      throw new Error('request body is larger than 8M!')
    }
    const result = await this.send({ events: [opts] })
    Voyager.eventList.push(opts)
    return result
  }
  /**
   *  持续事件开始
   *  @param {String} eventName 持续事件的名称
   *  @param {String} eventKey 持续事件的key, 用来区分用一个name的不同事件. 可能是feed_id之类的
   *  @param {Object} params 事件的自定义参数, json {"key1": "value1","key2": "value2"}
   *  @param {Boolean} endWithRawSession 如果为true，则在rawSession结束时，自动结束该Event
   */
  beginTrackEvent(event_name, event_key, params = {}, end_with_raw_session) {
    // 站内和站外分别进行调用客户端方法和js web sdk
    if (this.isInApp()) {
      MaiMai_Native &&
        MaiMai_Native.log_v2_begin_event &&
        MaiMai_Native.log_v2_begin_event(
          event_name,
          event_key,
          JSON.stringify(params),
          end_with_raw_session
        )
    } else {
      const options = {
        event_name,
        event_key,
        params,
        end_with_raw_session,
      }
      return this[track](options)
    }
  }
  /**
   *  持续事件结束
   *  @param {String} eventName 持续事件的名称
   *  @param {String} eventKey 持续事件的key, 用来区分用一个name的不同事件. 可能是feed_id之类的
   *  @param {Object} params 事件的自定义参数, json {"key1": "value1","key2": "value2"}
   */
  endTrackEvent(event_name, event_key, params = {}) {
    // 站内和站外分别进行调用客户端方法和js web sdk
    if (this.isInApp()) {
      MaiMai_Native &&
        MaiMai_Native.log_v2_end_event(
          event_name,
          event_key,
          JSON.stringify(params)
        )
    } else {
      const options = {
        event_name,
        event_key,
        params,
      }
      return this[track](options)
    }
  }
  // 检查发送数据SIZE，是否小于8M
  checkBodySize(json) {
    return jsonSize(json) <= 8 * 1024 * 1024
  }
  // 获取参数k
  getK() {
    return this.getUid() || this.getBrowserId()
  }
  // 获取u
  getUid() {
    try {
      const u = R.pathOr(-1, ['share_data', 'auth_info', 'u'], window)
      return u === -1 ? `${window.uid}` || Cookie.get('uid') : u
    } catch (err) {
      return ''
    }
  }
  // 获取浏览器指纹
  getBrowserId() {
    return Cookie.get('_buuid') || uuid()
  }
  isInApp() {
    return navigator.userAgent.match(/MaiMai/i)
  }
  // 获取国家信息
  async getCountry() {
    try {
      const { country } = await request('https://ipinfo.io', { method: 'GET' })
      return country
    } catch (err) {
      throw new Error('cannot get country info throughout ipinfo.io', err)
    }
  }
  recursionEncode(obj) {
    for (let key in obj) {
      const value = obj[key]
      if (typeof value === 'string' && hasChinese(value)) {
        obj[key] = encodeURIComponent(obj[key])
      }
      if (
        ['[object Object]', '[object Array]'].includes(
          Object.prototype.toString.call(value)
        )
      ) {
        obj[key] = this.recursionEncode(value)
      }
    }
    return obj
  }
  async send(opts) {
    opts.events = opts.events.map((item) => this.recursionEncode(R.clone(item)))
    const body = xor(JSON.stringify(opts), '42')
    // const body = JSON.stringify(opts)
    const k = this.getK()
    const s = md5Hash(body, k)
    const q = this.parseWebSDKConfig()

    const result = await request(`${Voyager.url}app=maimai&${q}k=${k}&s=${s}`, {
      body,
    })

    // 在没有进入到发送队列的请求进行额外处理
    if (result === false) {
      const img = new Image()
      img.src = `/sdk/voyager/send?app=maimai&${q}k=${k}&s=${s}&body=${body}`
      img.onerror = () => {
        const cacheData = localStorage.getItem('sendFailedEvents')
        // 请求失败时，将数据存储到本地，下次进行重新上传, 存入数组
        if (cacheData) {
          const newData = JSON.parse(cacheData)
          try {
            newData.events = [...newData.events, ...opts.events] // 两个数组进行合并
            localStorage.setItem('sendFailedEvents', JSON.stringify(newData))
          } catch (e) {
            if (
              e instanceof DOMException &&
              // everything except Firefox
              (e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
            ) {
              this.makeStorageAvailable(newData)
            }
          }
        } else {
          localStorage.setItem('sendFailedEvents', JSON.stringify(opts))
        }
      }
    }
    return result
  }
  /**
   * 重发失败数据
   */
  async rensendFailedData() {
    const failedData = localStorage.getItem('sendFailedEvents')
    let allData = {}
    try {
      allData = JSON.parse(failedData)
    } catch (err) {
      allData = {}
    }
    if (R.pathOr(0, ['events', 'length'], allData)) {
      const { events } = allData
      try {
        // send every start 5 requests to avoid too large request data
        const data = events.splice(0, 5)
        this.send({ events: data })
        // 只重发一次，随机立马删除缓存数据
        // do set action again if any data exists after splicing data
        if (events.length) {
          localStorage.setItem('sendFailedEvents', JSON.stringify({ events }))
        } else {
          localStorage.removeItem('sendFailedEvents')
        }
      } catch (err) {
        throw new Error(`parse localStorage sendFailedEvents failed ${err}`)
      }
    }
  }
  // 解析websdkconfig参数
  parseWebSDKConfig() {
    let queryString = ''
    const query = qs.parse(decodeURIComponent(window.location.search.substr(1)))
    if (query && query.web_sdk_config) {
      try {
        const queryObj = JSON.parse(query.web_sdk_config)
        if (typeof queryObj !== 'string') {
          Object.entries(queryObj).forEach(([k, v]) => {
            queryString += `${k}=${v}&`
          })
        }
      } catch (err) {
        throw new Error('failed to parse query.web_sdk_config', err)
      }
    }
    return queryString
  }
  /**
   * make storage available
   * try to splice data from localstorage when quota exceed error accurs,
   * it's simple but works
   * @param {Array} data
   */
  makeStorageAvailable(data) {
    const spliceLength = 1000
    data.events.splice(0, spliceLength)
    localStorage.setItem('sendFailedEvents', JSON.stringify(data))
  }
}
