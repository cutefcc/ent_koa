import {
  Router,
  inject,
  interfaces,
  httpGet,
  httpPost,
  TYPE,
  controller,
  TAGS,
  provideThrowable,
} from '../ioc'
import { host, port } from '../constant/config'
import * as queryString from 'query-string'
// import fetch from 'cross-fetch';
import fetch from 'node-fetch'
const FormData = require('form-data')
const urlPrefix = `${host}:${port}/`

@provideThrowable(TYPE.Controller, 'ApiController')
@controller('/api')
export default class ApiController implements interfaces.Controller {
  private apiService
  constructor(@inject(TAGS.ApiService) apiService) {
    this.apiService = apiService
  }
  @httpGet('/abc')
  private async abc(
    ctx: Router.IRouterContext,
    next: () => Promise<any>
  ): Promise<any> {
    console.log('进来了 3000 api/abc')
    // console.log('ctx.req', ctx.req)
    // const result: Promise<Object> = await this.apiService.getInfo(
    //   "https://maimai.cn/api/ent"
    //   // "http://localhost:3000/api/ent/common/config"
    // );
    // ctx.body = result;
  }
}
