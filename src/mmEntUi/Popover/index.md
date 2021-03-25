---
imports:
  'Popover': './index.js'
---

## 何时使用

所有需要 popover 的地方

## 引用方式

```render javascript
import {Popover} from 'mm-ent-ui'
```

## 代码演示

> 组件名称： pop-确认

- 没有 title

```render html
class Demo extends React.PureComponent {
  render() {
    return (
      <Popover
        content="付费客户专属特权"
        trigger="hover"
      >
        推送给粉丝
      </Popover>
    )
  }
}
```

- 有 title

```render html
class Demo extends React.PureComponent {
  render() {
    return (
      <Popover title="这里是标题" trigger="click" content="这里是内容"这里是内容这里是内容这里是内容这里是内容>
        推送给粉丝
      </Popover>
    )
  }
}
```

- 特殊样式的弹框

```render html
class Demo extends React.PureComponent {
  render() {
    return (
      <Popover content="付费客户专属特权" type="blue">
        推送给粉丝
      </Popover>
    )
  }
}
```

## 属性

| 属性    | 说明     | 类型                  | 默认值 |
| ------- | -------- | --------------------- | ------ |
| title   | 标题     | string 或 ReactDom    | 空     |
| content | 内容     | string 或 ReactDom    | 空     |
| type    | 样式类型 | string(可选值： blue) | 空     |
