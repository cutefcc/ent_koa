// import { Provider } from 'react-redux'
import * as Redux from 'redux'
import promiseMiddleware from 'middleware/promiseMiddleware'
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

class Container {
  constructor() {
    this.state = {}
    this.models = {}
    this.reducers = {}
    this.effects = {}
    this.store = {}
  }

  addNamespace(obj, name) {
    const newObj = {}
    Object.keys(obj).forEach((item) => {
      newObj[`${name}/${item}`] = obj[item]
    })
    return newObj
  }

  init(models) {
    Object.values(models).forEach((item) => {
      this.model(item)
    })
    // 创建并返回全局 store
    return this.createStore()
  }

  model(modelObj) {
    const { state, reducers, effects, namespace } = modelObj
    this.state[namespace] = state
    this.models[namespace] = modelObj

    const newReducer = this.addNamespace(reducers, namespace)
    const newEffects = this.addNamespace(effects, namespace)
    this.reducers[namespace] = newReducer

    this.effects[namespace] = newEffects
  }

  createStore() {
    const reducer = (state = this.state, action) => {
      let newState = state

      const { type } = action
      const [namespace] = type.split('/')

      const currentState = newState[namespace]
      const currentReducer = this.reducers[namespace]

      if (currentReducer && currentReducer[type] && currentState) {
        newState[namespace] = currentReducer[type](currentState, action)
        newState = { ...newState }
      }

      return newState
    }
    const sagaMiddleware = createSagaMiddleware()

    this.store = Redux.createStore(
      reducer,
      this.state,
      Redux.applyMiddleware(promiseMiddleware(), sagaMiddleware)
    )
    sagaMiddleware.run(rootSaga.init(this.effects))

    // const { dispatch, getState } = this.store

    /**
     * 给每个 model 的 effects 对象添加全局 store 的 dispatch、getState 方法
     * 用于在 effects 中调用 dispatch
     * 同时对 effects 中的方法名添加 namespace, 用于组件中 dispatch 时区分模块
     */
    // Object.keys(this.effects).forEach((namespace) => {
    //   this.effects[namespace].dispatch = ({ type, payload }) =>
    //     // 修改 action type，添加 namespace
    //     dispatch({ type: `${namespace}/${type}`, payload })
    //   this.effects[namespace].getState = getState
    // })

    return this.store
  }
}

export default new Container()
