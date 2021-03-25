import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
// import * as Sentry from '@sentry/browser'
import App from './router.js'
import store from './store/index'
import './index.less'

// const env = /localhost:8007/.test(window.location.href) ? 'production' : 'development'
// sentry
// if (env !== 'development') {
//   Sentry.init({
//     dsn: 'https://84a2ec338ad74a0ca4dec067020188bf@sentry.mm.taou.com//124',
//   })
//   Sentry.configureScope(scope => {
//     scope.setUser({
//       id: window.uid,
//     });
//   });
// }

const rootElement = document.getElementById('root')
ReactDom.render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
)
