import { IApi } from '../interface/IApi'
import { inject, provide } from '../ioc'
import TYPES from '../constant/types'
import TAGS from '../constant/tags'
@provide(TAGS.ApiService)
export class ApiService implements IApi {
  private safeRequest
  constructor(@inject(TYPES.SafeRequest) SafeRequest) {
    this.safeRequest = SafeRequest
  }
  getInfo(url: string, arg?: Object, callback?: Function): Promise<Object> {
    return this.safeRequest.fetch(url, arg, callback)
  }
}
