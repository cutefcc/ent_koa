/**
 * md5加密处理
 * @param {String} bodyXorResult 待加密字符串
 * @param {String} browserId 浏览器id
 * @return {String} result 加密结果
 */
// import md5 from 'md5';
/*  eslint-disable */
var md5 = require('md5')
const secret = 'odqwejirnabmxfzl'
export function md5Hash(bodyXorResult, browserId) {
  if (typeof bodyXorResult !== 'string') {
    throw new Error('bodyXorResult must be string')
  }

  if (typeof browserId !== 'string') {
    throw new Error('browserId must be string')
  }

  return md5(secret + bodyXorResult + browserId, {
    encoding: 'binary',
  })
}
