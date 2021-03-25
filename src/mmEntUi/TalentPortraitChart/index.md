---
imports:
  'TalentPortraitChart': './index.js'
---

## 何时使用

用到 Tab 的地方

## 引用方式

```render javascript
import {TalentPortraitChart} from 'mm-ent-ui'
```

## 组件名称

> 组件名称： 人才画像

## 代码演示

- 基本使用

```render html
class Demo extends React.PureComponent {
  render() {
    const data = [
      {
        count: 181409,
        city: '北京',
        name: '北京',
      },
      {
        count: 53146,
        city: '深圳',
        name: '深圳',
      },
      {
        count: 42442,
        city: '上海',
        name: '上海',
      },
      {
        count: 36232,
        city: '杭州',
        name: '杭州',
      },
      {
        count: 28733,
        city: '广州',
        name: '广州',
      },
      {
        count: 25243,
        city: '成都',
        name: '成都',
      },
      {
        count: 15755,
        city: '西安',
        name: '西安',
      },
    ]

    return (
      <TalentPortraitChart
        data={data}
        title="城市地区"
      />
    )
  }
}
```

- 自定义宽度

```render html
class Demo extends React.PureComponent {
  render() {
    const data = [
      {
        count: 181409,
        city: '北京',
        name: '北京',
      },
      {
        count: 53146,
        city: '深圳',
        name: '深圳',
      },
      {
        count: 42442,
        city: '上海',
        name: '上海',
      },
      {
        count: 36232,
        city: '杭州',
        name: '杭州',
      },
      {
        count: 28733,
        city: '广州',
        name: '广州',
      },
      {
        count: 25243,
        city: '成都',
        name: '成都',
      },
      {
        count: 15755,
        city: '西安',
        name: '西安',
      },
    ]

    return (
      <TalentPortraitChart
        data={data}
        title="城市地区"
        chartWidth={600}
      />
    )
  }
}
```

## 属性

| 属性       | 说明                                       | 类型                          | 是否必填 | 默认值   |
| ---------- | ------------------------------------------ | ----------------------------- | -------- | -------- |
| data       | 需要展示的数据                             | array(Object)                 | 否       | 空数组   |
| className  | 自定义的 class                             | string                        | 否       | 空字符串 |
| title      | 图表标题                                   | string or react dom or number | 否       | 空字符串 |
| chartWidth | 图标区的最大宽度(指条形图中条形的最大宽度) | number                        | 否       | 390      |
