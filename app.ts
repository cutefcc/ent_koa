// import "reflect-metadata";
require('reflect-metadata')
const bodyParser = require('koa-bodyparser')
import co from 'co'
const serve = require('koa-static')
const render = require('koa-swig')
const proxy = require('koa-proxy')
import { getIPAdress } from './src/node/util/index'
const cors = require('koa2-cors')
import {
  Container,
  buildProviderModule,
  InversifyKoaServer,
} from './src/node/ioc'
import './src/node/ioc/loader'

const container = new Container()
// ioc 控制反转
container.load(buildProviderModule())
let server = new InversifyKoaServer(container)
import historyApiFallback from 'koa2-connect-history-api-fallback'
// 设置中间件
server
  .setConfig((app) => {
    app.use(bodyParser())
    // 重定向的方案可以实现，缺点是url会改变，用户会有感知
    app.use(async (ctx, next) => {
      let uid = 1
      let config = [1, 2, 3]
      let featureIp = ['167.179.102.232', '10.9.0.71']
      if (config.includes(uid)) {
        // 特性体验机器
        if (!featureIp.includes(getIPAdress())) {
          ctx.redirect('back', 'http://kvm-bp-dev1:3001')
          return
        }
      } else {
        // 特性体验机器
        if (featureIp.includes(getIPAdress())) {
          ctx.redirect('back', 'http:/localhost:3001')
          return
        }
      }
      await next()
    })
    app.use(
      proxy({
        jar: true,
        host: 'https://maimai.cn/',
        match: /^(\/api\/ent\/*)/,
      })
    )
    app.use(
      proxy({
        jar: true,
        host: 'https://maimai.cn/',
        match: /^(\/bizjobs\/*)/,
      })
    )
    app.use(
      proxy({
        jar: true,
        host: 'https://maimai.cn/',
        match: /^(\/user\/v3\/login\/*)/,
      })
    )
    app.use(
      proxy({
        jar: true,
        host: 'http://front:8540/',
        match: /^\/groundhog/,
        map: function (path) {
          if (path.includes('groundhog')) {
            return 'http://front:8540' + path.slice(10)
          }
          return ''
        },
      })
    )
    // 代理js
    // app.use(
    //   proxy({
    //     jar: true,
    //     host: 'http://localhost:3002',
    //     match: /(.libs.dll.js|.bundles.js)$/,
    //   })
    // )
    // 图片等资源
    app.use(
      proxy({
        jar: true,
        host: 'http://localhost:3001',
        match: /^\/ent/,
        map: function (path) {
          return 'http://localhost:3001' + path.slice(4)
        },
      })
    )
    // whiteList
    app.use(
      historyApiFallback({
        index: '/index.html',
        whiteList: ['/'],
      })
    )
    app.use(serve('./dist')) // 静态资源文件
    app.use(cors())

    app.context.render = co.wrap(
      render({
        root: './dist',
        autoescape: true,
        cache: false,
        ext: 'html',
        varControls: ['{{', '}}'],
        writeBody: false,
      })
    )
  })
  .setErrorConfig((app) => {
    console.log(app)
  })
const app = server.build()
app.listen(3001, () => {
  console.log('recruit-fe 正在监听3001端口 🚀🚀🚀 ')
})
