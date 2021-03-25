import {
  call,
  put,
  takeEvery,
  takeLatest,
  all,
  select,
} from 'redux-saga/effects'
import { message } from 'antd'
import { ERROR_MSG_DURATION } from 'constants'

class Sagas {
  init(effects) {
    const effectsKeys = Object.keys(effects)
    const arr = []
    for (let i = 0; i <= effectsKeys.length - 1; i++) {
      for (let j in effects[effectsKeys[i]]) {
        if (effects[effectsKeys[i]].hasOwnProperty(j)) {
          arr.push(
            (function* () {
              yield takeEvery(`${j}`, function* (query) {
                // loading start
                yield put({
                  type: 'loading/setLoadingStart',
                  payload: j,
                })
                try {
                  const res = yield effects[effectsKeys[i]][j].call(
                    this,
                    { payload: query.payload },
                    { call, put, takeEvery, takeLatest, all, select }
                  )
                  // loading end
                  yield put({
                    type: 'loading/setLoadingEnd',
                    payload: j,
                  })
                  if (res) query.resolve(res)
                } catch (e) {
                  if (Object.prototype.toString.call(e) === '[object Error]') {
                    yield put({
                      type: 'loading/setLoadingEnd',
                      payload: j,
                    })
                    // eslint-disable-next-line no-console
                    if (e.message !== 'Failed to fetch') {
                      message.config({
                        top: 88,
                        duration: 3,
                        maxCount: 4,
                      })
                      message.error(e.message, ERROR_MSG_DURATION)
                    }
                    // message.warning('系统正在升级中...', 100000)
                    e.preventDefault && e.preventDefault()
                  }
                }
              })
            })()
          )
        }
      }
    }
    return function* rootSaga() {
      yield all(arr)
    }
  }
}

export default new Sagas()
