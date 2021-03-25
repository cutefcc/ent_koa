/**
 * 计算json的byte大小
 * @param {Object} json 待加密字符串
 * @return {Number} result byte数
 */
/*  eslint-disable */
export function jsonSize(json) {
  try {
    let s = JSON.stringify(json)
    return ~-encodeURI(s).split(/%..|./).length
  } catch (err) {
    throw new Error('expected a json', err)
  }
}
