// import * as fetch from "node-fetch";
import fetch from 'cross-fetch'
import { provide } from '../ioc'
import TYPES from '../constant/types'
import { ISafeRequest } from '../interface/ISafeRequest'
@provide(TYPES.SafeRequest)
export class SafeRequest implements ISafeRequest {
  public async fetch(
    url: string,
    arg?: Object,
    callback?: Function
  ): Promise<Object> {
    let result = {
      code: 'error',
    }

    await fetch(url, arg)
      .then((res) => res.json())
      .then((json) => {
        result = json
      })
    return result
  }
}
