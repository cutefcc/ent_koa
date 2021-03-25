import * as R from 'ramda'
import { getCookie } from 'tiny-cookie'
import Voyager from 'voyager'
// TODO 建议把getCurrentUserRole 的结果 role，也放到 auth 中，就不要单独放在currentUser 下了
import computeAuth, { getCurrentUserRole } from 'utils/auth'
import Broadcast from 'utils/broadcast'
export default function (dispatch) {
  if (!R.contains('/m/', location.pathname)) {
    dispatch({
      type: 'global/fetchDictionary',
      payload: {},
    })

    dispatch({
      type: 'global/fetchCurrentUser',
      payload: {
        initFlag: true,
      },
    })

    dispatch({
      type: 'global/fetchConfig',
      payload: {},
    })

    // dispatch({
    //   type: 'global/fetchRuntime',
    //   payload: {},
    // })

    // dispatch({
    //   type: 'global/fetchPersonalAsset',
    //   payload: {},
    // })

    dispatch({
      type: 'global/fetchJobs',
      payload: {},
    })
  }
  // 初始化打点功能
  window.voyager = new Voyager({})
  window.broadcast = new Broadcast()
  window.uid = getCookie('u')
}
