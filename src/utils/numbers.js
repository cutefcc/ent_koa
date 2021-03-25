/**
 * @param {float} v
 * @param {int} precision
 * @return {float}
 */
export const fixed = (v, precision) => {
  try {
    return parseFloat(parseFloat(v).toFixed(parseInt(precision, 10)))
  } catch (e) {
    // console.log(e)
    return 0
  }
}

/**
 * 百分号转小数
 * @param {String} percent
 * @return {float}
 */
export const toPoint = percent => {
  if (percent === undefined || typeof percent !== 'string') {
    return 0
  }
  const result = percent.replace('%', '') / 100
  return Number.isNaN(result) ? 0 : result
}

export const fixe2 = () => {
  return 0
}
