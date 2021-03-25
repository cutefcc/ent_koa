# 🏦 recruit-fe

## 项目介绍

> 脉脉招聘企业版，含 v1 v2 v3

## 📁 项目主体文件夹

```
├── config
│   ├── webpack.development.js
│   └── webpack.production.js
├── dist
├── dll
│   ├── libs.dll.js
│   └── libs.manifest.json
├── public
├── src
├── package-lock.json
├── package.json
├── local.js
├── README.md
├── tsconfig.json
├── typings
│   └── index.d.ts
├── webpack.config.js
├── webpack.dll.config.js
└── yarn.lock
```

## 🚀 本地运行

- `git clone http://cr.int.taou.com/diffusion/28/recruit-fe.git`

- `npm install`

- 本地启动项目 `npm run start`

- 本地启动项目(源码调试) `npm run debugger`

## 注意事项

- 升级过程文档记录[人才银行升级 webpack](https://docs.taou.com/pages/viewpage.action?pageId=75476453)，业务代码路径都没有改变，数据流（models services）的写法基本一致，以前接触过 dva 版的 recruit-fe 的同学可以平滑过渡
- 从 dva 首次切换过来，最好删除本地 node_modules 文件夹，运行： `npm install`
- 函数组件记得引入 React，不然会报错，详情可见[为什么函数式组件需要引进 React？](https://juejin.cn/post/6844903783655276557)
- 包管理工具使用 npm，尽量不要`npm yarn`混用
- 以前在当前的 models 修改当前 namespace 的数据时, 执行 put 是不用带 namespace 的
  ```
    yield put({
      type: 'setTalentList',
      payload: talentLists,
    })
  ```
  现在统一成带上 namespace 了，无论修改那个 namespace 的数据都需要加上 namespace
  ```
    yield put({
      type: 'groups/setTalentList',
      payload: talentLists,
    })
  ```
- 涉及到 dva 的东西都没有了，之前从 dva 引入的也被替换了：
  ```
  import { connect } from 'react-redux'
  import { withRouter } from 'react-router-dom'
  ```

## 项目技术说明

| 核心技术       | 版本      |
| -------------- | --------- |
| **webpack**    | "^4.44.2" |
| **react**      | "^17.0.1" |
| **redux**      | "^4.0.5"  |
| **redux-saga** | "^1.1.3"  |
| **antd**       | "^4.6.5"  |
|                |           |
