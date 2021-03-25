---
imports:
  'RichText': './index.js'
---

## 何时使用

所有需要解析富文本的地方

## 引用方式

```render javascript
import {RichText} from 'mm-ent-ui'
```

## 背书

> 解析富文本的逻辑，请参考 <a href="https://docs.taou.com/pages/viewpage.action?pageId=59970481">文档</a>,如果解析逻辑有有变更或者补充，请同步维护该文档

## 代码演示

> 组件名称： 富文本

```render html
class Demo extends React.PureComponent {
  render() {
    const text = '今天很开心[微笑],[胜利],<dref t=1 v=31379035>@吕金妍</dref>，<dref t=1 url=https://maimai.cn>脉脉</dref>,加油<dref t=12 v=[拳头]></dref>'
    return (
      <RichText
        text={text}
      />
    )
  }
}
```

## 属性

| 属性 | 说明       | 类型   | 默认值 |
| ---- | ---------- | ------ | ------ |
| text | 富文本内容 | string | 空     |
