---
imports:
  'ArticleCard': './index.js'
---

## 何时使用

展示文章卡片的地方

## 引用方式

```render javascript
import {ArticleCard} from 'mm-ent-ui'
```

## 代码演示

> 组件名称： 文章卡片

```render html
class ArticleCardDemo extends React.PureComponent {
  render() {
    const card = {
      avatar: 'http://i9.taou.com/maimai/p/21672/9296_60_6n5SfkvZQjECkIXn-a160',
      line1: '面对下属抱团抵制、阳奉阴违，空降的销售leader该如何管理？',
      target: 'https://maimai.cn/article/topic?id=268169',
    }
    return (
      <ArticleCard card={card} />
    )
  }
}
```

## 属性

| 属性 | 说明             | 类型                       | 默认值 |
| ---- | ---------------- | -------------------------- | ------ |
| card | 文档卡片所需信息 | object: avatar line1 line2 | 空数组 |
