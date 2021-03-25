/**
 * 对目标字符串逐字节进行异或处理
 * @param {String} str 目标字符串
 * @param {String} key 打点关键词
 * @return {String} result 异或结果
 */
/*  eslint-disable */
export function xor(str, secret) {
  var result = ''
  for (var i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ secret)
  }
  return result
}
