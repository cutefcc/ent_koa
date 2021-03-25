---
imports:
  '{Empty}': 'mm-ent-ui'
---

## 何时使用

为空的提示，可以是列表为空的时候，也可以是整体为空的时候

## 引用方式

```render javascript
import {Empty} from 'mm-ent-ui'
```

## 代码演示

### 主标题

> 组件名称： 块级区域为空(设置图片)

```render html
class Demo extends React.PureComponent {
  render() {
    return <Empty image="https://maimai.cn/ent/images/empty_position.png" description="这里是空的文案" />
  }
}
```

> 组件名称： 块级区域为空(没有图片)

```render html
class Demo extends React.PureComponent {
  render() {
    return <Empty description="这里是空的文案" />
  }
}
```

## 属性

| 属性        | 说明               | 是否必填 | 类型   | 默认值 |
| ----------- | ------------------ | -------- | ------ | ------ |
| image       | 为空的图片链接地址 | 否       | string | 空     |
| description | 描述文字           | 否       | string | 空     |
