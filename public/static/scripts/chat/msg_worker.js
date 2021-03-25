importScripts('/static/scripts/chat/protobuf.min.js')
importScripts('/static/scripts/chat/chatdb.js')

var nested = {
  ns: {
    nested: {
      TkMessage: {
        fields: {
          req_id: {
            rule: 'required',
            type: 'string',
            id: 1,
          },
          content_type: {
            rule: 'required',
            type: 'string',
            id: 2,
          },
          url: {
            rule: 'required',
            type: 'string',
            id: 3,
          },
          msg_type: {
            rule: 'required',
            type: 'string',
            id: 4,
          },
          error_msg: {
            type: 'string',
            id: 5,
          },
          error_code: {
            type: 'int32',
            id: 6,
          },
          body: {
            rule: 'required',
            type: 'bytes',
            id: 7,
          },
        },
      },
    },
  },
}
var chat = {
  nested: nested,
}
var jsonDescriptor = Object.freeze({
  __proto__: null,
  nested: nested,
  default: chat,
})
const root = protobuf.Root.fromJSON(jsonDescriptor)
let message
self.ports = []
self.messageLength = 0
class WebSocketClient {
  constructor(opts) {
    this.url = 'wss://tk2.taou.com'

    this.callback = opts.callback
    // add auth changed when user login in by another account
    this.authChangedCallback = opts.authChangedCallback
    this.auth_token = opts.auth_info
    this.csrfToken = (this.auth_token && this.auth_token._csrf_token) || ''
    // force to close websocket connection
    this.forceCloseWSConn = false
    this.onLine = true
    this.init()
    this.connect()
  }
  init() {
    this.ws = null
    this.pingTimer = null
    this.timer = null
    this.pingTimeout = 60 // every ping time
    this.pongTime = -1 // pong time
    this.host = 'wss://tk2.taou.com:443/'
    this.Message = root.lookupType('ns.TkMessage')

    this.body = {
      uid: this.auth_token.u,
      udid: this.uuid(), // uid + udid will generate a pair, and right now there's no maximum pairs limitation
      appid: 1,
    } // body in data

    // request data
    this.data = {
      req_id: '',
      content_type: 'application/json',
      url: '',
      msg_type: 'request',
      body: new Uint8Array(),
    }
  }

  connect() {
    this.ws = new WebSocket(this.url)
    const { ws, Message } = this
    const _this = this
    ws.onopen = () => {
      this.send('online/startup', {})
    }

    ws.onmessage = evt => {
      const received_msg = evt.data
      const reader = new FileReader()
      reader.onload = () => {
        const blob = reader.result //内容就在这里
        const json = Message.decode(new Uint8Array(blob))
        const body = this.uint8ArrayToJson(json.body)
        const { timeout, url, t, uid } = body
        if (timeout) {
          this.pingTimeout = timeout
          // start ping/pong
          if (!this.pingTimer) {
            this.pingTimer = setInterval(() => {
              this.ping()
            }, this.pingTimeout * 1000)
          }
        } else if (url === 'wss://tk2.taou.com:443/im/' && t === 1) {
          if (uid == this.auth_token.u) {
            _this.callback && _this.callback()
          } else {
            // force to close ws connection
            _this.forceCloseWSConn = true
            _this.close()
            _this.authChangedCallback && _this.authChangedCallback()
          }
        }
      }
      reader.readAsArrayBuffer(received_msg)
    }

    ws.onclose = () => {
      // close websocket connection and reset all status and data
      this.close()
      if (!this.forceCloseWSConn && this.onLine) this.reconnect()
    }
  }
  // reconnect server
  reconnect() {
    // check if there is a interval timer running
    if (this.timer) return
    // try to reconnect every 2s
    this.timer = setInterval(() => {
      const { ws } = this
      // websocket is connected
      if ((ws && ws.readyState === 1) || !this.onLine) {
        clearInterval(this.timer)
        this.timer = null
      } else {
        this.connect()
      }

      if (typeof navigator.onLine !== 'undefined')
        this.onLine = navigator.onLine
    }, 2000)
  }
  /**
   * send data to server
   * @param {String} url property url in request data
   * @param {Object} body property body in request data
   */
  async send(url, body = {}) {
    const { Message, ws } = this
    const bodyWithToken = {}
    let res
    if (ws === null || ws.readyState !== 1) return

    try {
      res = await this.auth()
    } catch (err) {
      console.error(err)
    }

    if (res.result === 'ok' && res.token) {
      bodyWithToken.token = res.token
    } else if (res && res.result === 'error' && res.error_code === 20001) {
      // force to close websocket connection when user logout
      this.forceCloseWSConn = true
      this.close()
      throw new Error(res.error_msg)
    }

    const mergedBody = Object.assign({}, this.body, body, bodyWithToken)
    this.data.url = this.host + url
    this.data.req_id = this.uuid()
    try {
      this.data.body = this.stringToUint8Array(JSON.stringify(mergedBody))
    } catch (err) {
      // todo
    }

    const buffer = Message.encode(Message.create(this.data)).finish()
    ws.send(buffer)
  }
  close() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      clearInterval(this.pingTimer)
      clearInterval(this.timer)
      this.pingTimer = null
      this.timer = null
      this.pingTimeout = 60
    }
  }
  // use ping/pong control frames in websocket connection
  // make sure the client is still connected
  // more details in https://docs.taou.com/pages/viewpage.action?pageId=17827006
  ping() {
    this.send('online/ping')
  }
  async auth() {
    const uri = `/sdk/chat/get_tk_webim_token?u=${this.auth_token.u}`
    const config = {
      headers: {
        'X-CSRF-Token': this.csrfToken,
      },
    }

    return new Promise(resolve => {
      resolve(
        fetch(uri, config)
          .then(res => {
            const csrfToken = res.headers.get('X-CSRF-Token')
            // 如果校验失败，用返回的csrftoken重新请求一次(失败的这次请求，groundhog会重新种X-CSRF-Token的cookie)
            if (res.status == 204 && csrfToken) {
              this.csrfToken = csrfToken
              let csrfTokenFromGroundhog = csrfToken
              config.headers = {
                ...(config.headers || {}),
                'X-CSRF-Retry': 1,
                'X-CSRF-Token': csrfTokenFromGroundhog,
              }
              return fetch(uri, config)
            }

            return res
          })
          .then(res => res.json())
          .then(res => res)
          .catch(err => {
            console.error(err)
          })
      )
    })
  }
  timer() {}
  stringToUint8Array(str) {
    var arr = []
    for (var i = 0, j = str.length; i < j; ++i) {
      arr.push(str.charCodeAt(i))
    }

    var tmpUint8Array = new Uint8Array(arr)
    return tmpUint8Array
  }
  uint8ArrayToJson(binArray) {
    var str = ''
    for (var i = 0; i < binArray.length; i++) {
      str += String.fromCharCode(parseInt(binArray[i]))
    }
    return JSON.parse(str)
  }
  uuid() {
    var d = Date.now()
    if (
      typeof performance !== 'undefined' &&
      typeof performance.now === 'function'
    ) {
      d += performance.now() // 通过performance来提高精准度
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
      })
      .replace(/-/g, '')
  }
  online() {
    this.onLine = true
    // try to reconnect while there is no ws connection
    if (this.ws === null) {
      this.reconnect()
      this.callback && this.callback() // try to pull new message during the offline
    }
  }
  offline() {
    this.onLine = false
  }
}

class Message {
  constructor(opts = {}) {
    const { auth_info, callback, badge } = opts

    this.chatDBStatus = ''
    this.auth_info = auth_info
    this.callback = callback
    this.badge = badge
    this.csrfToken = (this.auth_info && this.auth_info._csrf_token) || ''
    this.common_query = {
      version: '5.0.2',
      ver_code: 'web_1',
      channel: 'web_im',
      push_permit: 1,
    }
    this.mtime = 0
    this.after_mid = 0
    this.schema = [] // schema for transferring specific data

    const { web_uid } = auth_info
    if (!this.chatDBManager && web_uid) {
      this.chatDBManager = new self.ChatDB.default({
        version: 1,
        web_uid,
        callbackAfterConnected: status => {
          this.chatDBStatus = status
          this.init()
        },
      })
    } else {
      this.init()
    }
  }
  init() {
    this.getBadge()
  }
  // get message
  getBadge() {
    const { callback } = this
    if (typeof callback === 'function') {
      this.getDbBadge(0, data => {
        if (data.badges === 0) {
          // 本地数据库不可能，从接口获取数据
          const uri =
            '/groundhog/user/v3/get_badge?' +
            this.simpleStringify({
              ...this.auth_info,
              ...this.common_query,
            })
          const config = {
            headers: {
              'X-CSRF-Token': this.csrfToken,
            },
          }
          fetch(uri, config)
            .then(res => {
              const csrfToken = res.headers.get('X-CSRF-Token')
              // 如果校验失败，用返回的csrftoken重新请求一次(失败的这次请求，groundhog会重新种X-CSRF-Token的cookie)
              if (res.status == 204 && csrfToken) {
                this.csrfToken = csrfToken
                let csrfTokenFromGroundhog = csrfToken
                config.headers = {
                  ...(config.headers || {}),
                  'X-CSRF-Retry': 1,
                  'X-CSRF-Token': csrfTokenFromGroundhog,
                }
                return fetch(uri, config)
              }

              return res
            })
            .then(res => res.json())
            .then(res => {
              const { badges } = res
              const data = { badges: badges['1'], msgs: [] }
              if (typeof callback === 'function') {
                callback({
                  method: 'updateMessages',
                  data: { ...this.getResultBySchema(this.schema, data) },
                })
              }
            })
            .catch(err => {
              console.error(err)
            })
        } else {
          callback({
            method: 'updateMessages',
            data: { ...this.getResultBySchema(this.schema, data) },
          })
        }
      })
    }
  }
  getDbBadge = (callTimes, callback) => {
    if (this.chatDBStatus === 'connected') {
      this.chatDBManager.readAllMessages().then(messages => {
        let badge = 0
        if (messages.length !== 0) {
          // force to delete openByUser property to fix messages disorder bugs
          messages.forEach(msg => {
            if (msg.notify_switch == 1) {
              badge += msg.badge
            }
          })
          if (self.messageLength === badge && callTimes < 10) {
            // 如果数量相同则需要重新取值进行getDbBadge操作
            setTimeout(() => {
              this.getDbBadge(callTimes + 1, callback)
            }, 2000)
            return
          }
          self.messageLength = badge
        }
        if (callback instanceof Function) {
          callback({
            badges: badge,
            msgs: [],
          })
        }
      })
    } else {
      if (callback instanceof Function) {
        callback({
          badges: 0,
          msgs: [],
        })
      }
    }
  }
  /**
   * a very simpe way to stringify params
   * @param {Number/Array} queryObj parameter
   */
  simpleStringify(queryObj) {
    let queryString = ''
    Object.entries(queryObj).forEach(([k, v]) => {
      if (k && typeof v !== 'undefined') {
        queryString += `${k}=${v}&`
      }
    })

    return queryString
  }
  /**
   * get result by schema
   * @param {Array} schema
   * @param {Object} results
   * @return {Object} new results by schema
   */
  getResultBySchema(schema, results) {
    if (!schema.length) return results // if schema is [], the entire results will be returned

    Object.keys(results).forEach(item => {
      if (!schema.includes(item)) delete results[item]
    })

    return results
  }
}

onconnect = function(e) {
  var port = e.ports[0]

  port.addEventListener('message', function(event) {
    const { data } = event
    const { method } = data
    switch (method) {
      case 'init': {
        self.ports.push(port)
        const { auth_info } = data.data
        message = new Message({
          auth_info,
          callback: port.postMessage.bind(port),
        })
        self.ws = new WebSocketClient({
          auth_info,
          callback: () => {
            message.getBadge(['badges'])
          },
        })
        break
      }
      case 'pullMsg': {
        const { schema = [] } = data.data
        message.getBadge(schema)
        break
      }
      case 'online': {
        self.ws.online()
        break
      }
      case 'offline': {
        self.ws.offline()
        break
      }
    }
  })

  port.start() // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
}
