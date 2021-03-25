---
imports:
  'Text': './index.js'
---

## 何时使用

任何需要展示文字的地方，包括在表格、按钮、dialog 中

## 引用方式

```render javascript
import {Text} from 'mm-ent-ui'
```

## 代码演示

### 主标题

> 组件名称： 主标题\_字号

> 颜色#222 加粗

```render html
class ButtonDemo extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Text type="title" size={24}>24号主标题</Text>
        <Text type="title" size={20}>20号主标题</Text>
        <Text type="title" size={18}>18号主标题</Text>
        <Text type="title" size={16}>16号主标题</Text>
      </React.Fragment>
    )
  }
}
```

### 次标题

> 组件名称： 次标题\_字号

> 颜色#333 加粗

```render html
class ButtonDemo extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Text type="title_secondary" size={24}>24号次标题</Text>
        <Text type="title_secondary" size={20}>20号次标题</Text>
        <Text type="title_secondary" size={18}>18号次标题</Text>
        <Text type="title_secondary" size={16}>16号次标题</Text>
      </React.Fragment>
    )
  }
}
```

### 主正文

> 组件名称： 强正文\_字号

> 颜色#333 常规

```render html
class ButtonDemo extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Text type="text_primary" size={14}>14号强正文</Text>
        <Text type="text_primary" size={13}>13号强正文</Text>
        <Text type="text_primary" size={12}>12号强正文</Text>
      </React.Fragment>
    )
  }
}
```

### 常规正文

> 组件名称： 普通正文\_字号

> 颜色#666 常规

```render html
class ButtonDemo extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Text type="text_common" size={14}>14号普通正文</Text>
        <Text type="text_common" size={13}>13号普通正文</Text>
        <Text type="text_common" size={12}>12号普通正文</Text>
      </React.Fragment>
    )
  }
}
```

### 次正文

> 组件名称： 次正文\_字号

> 颜色#999 常规

```render html
class ButtonDemo extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Text type="text_secondary" size={14}>14号次正文</Text>
        <Text type="text_secondary" size={13}>13号次正文</Text>
        <Text type="text_secondary" size={12}>12号次正文</Text>
      </React.Fragment>
    )
  }
}
```

### 若正文

> 组件名称： 次正文\_字号

> 颜色#999 常规

```render html
class ButtonDemo extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Text type="text_week" size={14}>14号弱正文</Text>
        <Text type="text_week" size={13}>13号弱正文</Text>
        <Text type="text_week" size={12}>12号弱正文</Text>
      </React.Fragment>
    )
  }
}
```

### 超出固定行数显示省略号

> 组件名称： 次正文*字号*最多展示 5 行

```render html
class ButtonDemo extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <Text type="text_common" size={14} maxLine={5} canSpread>4号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文14号普通正文144号普通正文144号普通正文14号普通正文144号普通正文正文正文普通正文正文正文普通正文正文正文普通正文正文正文</Text>
      </React.Fragment>
    )
  }
}
```

## 属性

| 属性      | 说明                                                                    | 是否必填 | 类型    | 默认值                          |
| --------- | ----------------------------------------------------------------------- | -------- | ------- | ------------------------------- |
| type      | 文字的基本样式                                                          | 否       | string  | common,可选值 title,common,week |
| size      | 文字的大小                                                              | 否       | number  | 14                              |
| maxLine   | 最多展示行数，超出部分展示省略号                                        | 否       | number  | 无                              |
| canSpread | 在 maxLine < 0 的情况下才会生效，表示在显示省略号的时候是否可以点击展开 | 否       | boolean | false                           |
