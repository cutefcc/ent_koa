---
imports:
  '{FeedCard, Text, Icon, ArticleCard}': 'mm-ent-ui'
---

## 何时使用

pc 端 feed 固定卡片格式

## 引用方式

```render javascript
import {FeedCard} from 'mm-ent-ui'
```

## 说明

> 组件只设计了整体布局与每行的基本样式，第三行为正文部分，默认设置了，超出 5 行省略展示。

## 示例代码

- 默认样式

```render html
class Demo extends React.PureComponent {
  render() {
    return (
      <FeedCard
        logoProps = {{
          name: '脉脉',
          src: 'https://maimai.cn/static/images/logo-60.png'
        }}
        line1 = {[
          '脉脉·交互设计师',
          <Icon type="v" key="v" />
        ]}
        line2 = "2019-01-03 3:56"
        line3 = {`为国内VC公司重构官网进行交互设计，以符合品牌、群体和用户目标； 为上汽集团重新梳理电商产品，重构网站、m端、公众号交互设计，以达成业务目标；为国内VC公司重构官网进行交互设计，以符合品牌、群体和用户目标； 为上汽集团重新梳理电商产品，重构网站、m端、公众号交互设计，以达成业务目标；为国内VC公司重构官网进行交互设计，以符合品牌、群体和用户目标； 为上汽集团重新梳理电商产品，重构网站、m端、公众号交互设计，以达成业务目标；为国内VC公司重构官网进行交互设计，以符合品牌、群体和用户目标； 为上汽集团重新梳理电商产品，重构网站、m端、公众号交互设计，以达成业务目标；`}
        line4 = "ta有10个好友在此公司"
      />
    )
  }
}
```

- 自定义行样式

```render html
class Demo extends React.PureComponent {
  render() {
    return (
      <FeedCard
        logoProps = {{
          name: '脉脉',
          src: 'https://maimai.cn/static/images/logo-60.png'
        }}
        line1 = {[
          <Text type="title" size={14} style={{marginRight: '5px'}} key="title">脉脉·交互设计师</Text>,
          <Icon type="v" key="v" />
        ]}
        line2 = {<Text type="text_week">2019-01-03 3:56</Text>}
        line3 = {`为国内VC公司重构官网进行交互设计，以符合品牌、群体和用户目标； 为上汽集团重新梳理电商产品，重构网站、m端、公众号交互设计，以达成业务目标；为国内VC公司重构官网进行交互设计，以符合品牌、群体和用户目标； 为上汽集团重新梳理电商产品，重构网站、m端、公众号交互设计，以达成业务目标；为国内VC公司重构官网进行交互设计，以符合品牌、群体和用户目标； 为上汽集团重新梳理电商产品，重构网站、m端、公众号交互设计，以达成业务目标；为国内VC公司重构官网进行交互设计，以符合品牌、群体和用户目标； 为上汽集团重新梳理电商产品，重构网站、m端、公众号交互设计，以达成业务目标；`}
        line4 = {<Text type="text-secondary">ta有10个好友在此公司</Text>}
      />
    )
  }
}
```

- 省略某些行

```render html
class Demo extends React.PureComponent {
  render() {
    return (
      <FeedCard
        logoProps = {{
          name: '脉脉',
          src: 'https://maimai.cn/static/images/logo-60.png'
        }}
        line1 = {[
          <Text type="title" size={14} style={{marginRight: '5px'}} key="title">脉脉·交互设计师</Text>,
          <Icon type="v" key="v" />
        ]}
        line3 = {`为国内VC公司重构官网进行交互设计，以符合品牌、群体和用户目标； 为上汽集团重新梳理电商产品，重构网站、m端、公众号交互设计，以达成业务目标；为国内VC公司重构官网进行交互设计，以符合品牌、群体和用户目标； 为上汽集团重新梳理电商产品，重构网站、m端、公众号交互设计，以达成业务目标；为国内VC公司重构官网进行交互设计，以符合品牌、群体和用户目标； 为上汽集团重新梳理电商产品，重构网站、m端、公众号交互设计，以达成业务目标；为国内VC公司重构官网进行交互设计，以符合品牌、群体和用户目标； 为上汽集团重新梳理电商产品，重构网站、m端、公众号交互设计，以达成业务目标；`}
        line4 = {<Text type="text-secondary">ta有10个好友在此公司</Text>}
      />
    )
  }
}
```

- 在信息流中使用

```render html
class Demo extends React.PureComponent {
  render() {
    const card = {
      avatar: 'http://i9.taou.com/maimai/p/21672/9296_60_6n5SfkvZQjECkIXn-a160',
      line1: '面对下属抱团抵制、阳奉阴违，空降的销售leader该如何管理？',
      target: 'https://maimai.cn/article/topic?id=268169',
    }

    return (
      <FeedCard
        logoProps = {{
          name: '阿门',
          src: 'https://i9.taou.com/maimai/p/21954/4400_82_7bzTQITze0xjJC-a160',
          shape: 'circle',
        }}
        line1 = {[
          <Text type="title" size={14} style={{marginRight: '5px'}} key="title">脉脉·交互设计师</Text>,
          <Icon type="v" key="v" />
        ]}
        line3 = "你因为什么原因留在现在公司呢？"
        line4 = {<ArticleCard card={card} />}
        line5 = {<Text type="text_week">点赞 10   转发 20</Text>}
      />
    )
  }
}
```

## 属性

| 属性      | 说明                                | 类型                 | 默认值                        |
| --------- | ----------------------------------- | -------------------- | ----------------------------- |
| logoProps | logo 的属性，参考 avatar 组件的属性 | object               | size: "14px", shape: "square" |
| line1     | 第一行显示的内容，没有则不展示该行  | string 或者 reactDom | undefined                     |
| line2     | 第二行显示的内容, 没有则不展示该行  | string 或者 reactDom | undefined                     |
| line3     | 第三行显示的内容, 没有则不展示该行  | string 或者 reactDom | undefined                     |
| line4     | 第四行显示内容, 没有则不展示该行    | string 或者 reactDom | undefined                     |
| className | 如果需要自定义样式, 可以添加        | string               | undefined                     |
