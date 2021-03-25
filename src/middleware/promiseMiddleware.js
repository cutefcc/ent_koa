import { NAMESPACE_SEP } from './constants'
import finallModels from 'store/getModels'

export default function promiseMiddleware() {
  return ({ dispatch, getState }) => (next) => (action) => {
    const { type } = action
    if (isEffect(type)) {
      return new Promise((resolve, reject) => {
        next({ resolve, reject, ...action })
      })
    } else {
      return next(action)
    }
  }
  function isEffect(type) {
    if (!type || typeof type !== 'string') return false
    const [namespace, typeName] = type.split(NAMESPACE_SEP)
    const model = Object.values(finallModels).filter(
      (m) => m.namespace === namespace
    )[0]
    if (model) {
      if (model.effects && model.effects[typeName]) {
        return true
      }
    }
    return false
  }
}
