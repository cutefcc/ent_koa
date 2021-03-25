import * as R from 'ramda'

export const getCurrDate = () => {
  const curr = new Date()
  return curr.getTime()
}

export const getPreStrongModalDate = (id = '') => {
  return window.localStorage.getItem(`snatchTalentStrongModalPreDate_${id}`)
}

export const getPreBottomBannerDate = (id = '') => {
  return window.localStorage.getItem(`snatchTalentBottomBannerPreDate_${id}`)
}

export const setPreStrongModalDate = (currUser) => {
  const id = R.pathOr('', ['ucard', 'id'], currUser)
  window.localStorage.setItem(
    `snatchTalentStrongModalPreDate_${id}`,
    getCurrDate()
  )
}

export const setPreBottomBannerDate = (currUser) => {
  const id = R.pathOr('', ['ucard', 'id'], currUser)
  window.localStorage.setItem(
    `snatchTalentBottomBannerPreDate_${id}`,
    getCurrDate()
  )
}

export const handleIsShowSnatchTalentStrongModal = (currUser) => {
  const id = R.pathOr('', ['ucard', 'id'], currUser)
  return (
    !getPreStrongModalDate(id) ||
    getCurrDate() - Number(getPreStrongModalDate(id)) >= 604800000
  )
}

export const handleIsShowSnatchTalentBottomBanner = (currUser) => {
  const id = R.pathOr('', ['ucard', 'id'], currUser)
  return (
    !handleIsShowSnatchTalentStrongModal(currUser) &&
    (!getPreBottomBannerDate(id) ||
      getCurrDate() - Number(getPreBottomBannerDate(id)) >= 86400000)
  )
}
