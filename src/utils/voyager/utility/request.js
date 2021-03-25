/* eslint-disable */
export async function request(url, opts) {
  let defaultOpts = {
    method: 'POST',
    credentials: 'include',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }
  let options = Object.assign({}, defaultOpts, opts)

  /**
   * 增加navigator.sendBeacon兼容方法，防止在页面关闭、离开或者刷新时打点失败
   * 兼容方案，当不兼容sendBeacon时则仍使用原有的方式,其中原有方式增加请求返回
   * 兼容列表为 https://caniuse.com/#search=sendbeacon
   * 因为该方法也会被服务端调用，所以对浏览器的navigator做额外判断
   */
  return await new Promise((resolve, reject) => {
    if (
      typeof navigator !== 'undefined' &&
      navigator.sendBeacon &&
      typeof navigator.sendBeacon === 'function' &&
      !window.location.href.includes('debug=1')
    ) {
      try {
        let result = navigator.sendBeacon(url, options.body)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    } else {
      return fetch(url, options)
        .then((data) => {
          resolve(data)
        })
        .catch((err) => {
          reject(err)
        })
    }
  })
}
