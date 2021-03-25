import finallModels from './getModels'
import container from './container'
import initData from './initData'

// init store
const store = container.init(finallModels)
// init data: 原global subscriptions 里面的东西
initData(store.dispatch)

export default store
