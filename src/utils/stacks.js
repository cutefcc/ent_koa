export const maxSize = 20

export const retreiveNewStacks = (uids, currentIndex, uid) => {
  if (!Array.isArray(uids) || !uids.length) return []
  if (currentIndex < 0) return uids

  uids.splice(currentIndex + 1) // forece to delete all elements after current element
  uids[uids.length - 1] !== uid && uids.push(uid) // no matter there is already uid in old stack or not
  return uids
}
