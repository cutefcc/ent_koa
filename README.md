# ð¦ recruit-fe

## é¡¹ç®ä»ç»

> èèæèä¼ä¸çï¼å« v1 v2 v3

## ð é¡¹ç®ä¸»ä½æä»¶å¤¹

```
âââ config
â   âââ webpack.development.js
â   âââ webpack.production.js
âââ dist
âââ dll
â   âââ libs.dll.js
â   âââ libs.manifest.json
âââ public
âââ src
âââ package-lock.json
âââ package.json
âââ local.js
âââ README.md
âââ tsconfig.json
âââ typings
â   âââ index.d.ts
âââ webpack.config.js
âââ webpack.dll.config.js
âââ yarn.lock
```

## ð æ¬å°è¿è¡

- `git clone http://cr.int.taou.com/diffusion/28/recruit-fe.git`

- `npm install`

- æ¬å°å¯å¨é¡¹ç® `npm run start`

- æ¬å°å¯å¨é¡¹ç®(æºç è°è¯) `npm run debugger`

## æ³¨æäºé¡¹

- åçº§è¿ç¨ææ¡£è®°å½[äººæé¶è¡åçº§ webpack](https://docs.taou.com/pages/viewpage.action?pageId=75476453)ï¼ä¸å¡ä»£ç è·¯å¾é½æ²¡ææ¹åï¼æ°æ®æµï¼models servicesï¼çåæ³åºæ¬ä¸è´ï¼ä»¥åæ¥è§¦è¿ dva çç recruit-fe çåå­¦å¯ä»¥å¹³æ»è¿æ¸¡
- ä» dva é¦æ¬¡åæ¢è¿æ¥ï¼æå¥½å é¤æ¬å° node_modules æä»¶å¤¹ï¼è¿è¡ï¼ `npm install`
- å½æ°ç»ä»¶è®°å¾å¼å¥ Reactï¼ä¸ç¶ä¼æ¥éï¼è¯¦æå¯è§[ä¸ºä»ä¹å½æ°å¼ç»ä»¶éè¦å¼è¿ Reactï¼](https://juejin.cn/post/6844903783655276557)
- åç®¡çå·¥å·ä½¿ç¨ npmï¼å°½éä¸è¦`npm yarn`æ··ç¨
- ä»¥åå¨å½åç models ä¿®æ¹å½å namespace çæ°æ®æ¶, æ§è¡ put æ¯ä¸ç¨å¸¦ namespace ç
  ```
    yield put({
      type: 'setTalentList',
      payload: talentLists,
    })
  ```
  ç°å¨ç»ä¸æå¸¦ä¸ namespace äºï¼æ è®ºä¿®æ¹é£ä¸ª namespace çæ°æ®é½éè¦å ä¸ namespace
  ```
    yield put({
      type: 'groups/setTalentList',
      payload: talentLists,
    })
  ```
- æ¶åå° dva çä¸è¥¿é½æ²¡æäºï¼ä¹åä» dva å¼å¥çä¹è¢«æ¿æ¢äºï¼
  ```
  import { connect } from 'react-redux'
  import { withRouter } from 'react-router-dom'
  ```

## é¡¹ç®ææ¯è¯´æ

| æ ¸å¿ææ¯       | çæ¬      |
| -------------- | --------- |
| **webpack**    | "^4.44.2" |
| **react**      | "^17.0.1" |
| **redux**      | "^4.0.5"  |
| **redux-saga** | "^1.1.3"  |
| **antd**       | "^4.6.5"  |
|                |           |
