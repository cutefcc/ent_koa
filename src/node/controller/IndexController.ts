import {
  Router,
  TAGS,
  interfaces,
  httpGet,
  TYPE,
  controller,
  inject,
  provideThrowable,
} from '../ioc'
import { getIPAdress } from '../util/index'
@provideThrowable(TYPE.Controller, 'IndexController')
@controller('*')
export default class IndexController implements interfaces.Controller {
  private apiService
  // aop 面向切面编程
  constructor(@inject(TAGS.ApiService) apiService) {
    //di  依赖注入 整个流程就是ioc
    this.apiService = apiService
  }

  @httpGet('/')
  private async index(
    ctx: Router.IRouterContext,
    next: () => Promise<any>
  ): Promise<any> {
    ctx.body = await ctx.render('index.html')
  }
}
