import models from 'models'
import loadingModels from './loadingModels'
import * as R from 'ramda'

const finallModels = {}
models.forEach((item) => {
  const obj = R.pathOr('', ['default'], item)
  const namespace = R.pathOr('', ['default', 'namespace'], item)
  finallModels[namespace] = obj
})
finallModels[loadingModels.namespace] = loadingModels
export default finallModels
