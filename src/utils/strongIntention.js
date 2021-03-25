import * as R from 'ramda'

export const computeIntentionUnViewList = (
  strongIntentions,
  viewedStrong = []
) => {
  const list = R.pathOr([], ['strong_intentions'], strongIntentions)
  const notInViewedFunc = (v) => R.any(R.equals(v))(viewedStrong)
  return R.reject(notInViewedFunc, list)
}

export const computeIntentionUnViewCount = (
  strongIntentions,
  viewedStrong = []
) => {
  const count = R.pathOr(0, ['count'], strongIntentions)
  const viewedCount = R.sum(R.map(R.propOr(0, 'count'), viewedStrong))
  return count - viewedCount
}

export const computeIntentionTrackParam = (
  strongIntentions,
  viewedStrong = []
) => {
  const leftList = computeIntentionUnViewList(strongIntentions, viewedStrong)
  return leftList
}
