/**
 * 随机生成uuid（时间和随机数）
 * @returns {String} buuid 浏览器uuid，一共36位，我们统一去掉中横线, 并转换为小写
 */
/*  eslint-disable */
export function uuid() {
  var d = Date.now()
  if (
    typeof performance !== 'undefined' &&
    typeof performance.now === 'function'
  ) {
    d += performance.now() // 通过performance来提高精准度
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
    .replace(/-/g, '')
}
