---
imports:
  '{FeedMultiImg}': 'mm-ent-ui'
---

## 何时使用

feed 流中展示单张或者多张图片

## 引用方式

```render javascript
import {FeedMultiImg} from 'mm-ent-ui'
```

## 代码演示

> 组件名称： feed 图片组

- 默认图片大小

```render html
class FeedImgsDemo extends React.PureComponent {
  render() {
    const pics = [
      {
        tox: 138,
        toy: 240,
        tx: 160,
        ty: 160,
        url: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        tourl:
          'http://i9.taou.com/maimai/p/22946/5741_12_31kmhQhnVGaxMnzc?imageMogr2/thumbnail/240x240',
        turl: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        y: 1300,
        x: 750,
        id: 229465741,
      },
      {
        tox: 138,
        toy: 240,
        tx: 160,
        ty: 160,
        url: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        tourl:
          'http://i9.taou.com/maimai/p/22946/5743_12_52bpE0PvSiTYBi1m?imageMogr2/thumbnail/240x240',
        turl: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        y: 1300,
        x: 750,
        id: 229465743,
      },
      {
        tox: 138,
        toy: 240,
        tx: 160,
        ty: 160,
        url: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        tourl:
          'http://i9.taou.com/maimai/p/22946/5744_12_6f7ulZBARZL90M?imageMogr2/thumbnail/240x240',
        turl: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        y: 1300,
        x: 750,
        id: 229465744,
      },
      {
        tox: 138,
        toy: 240,
        tx: 160,
        ty: 160,
        url: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        tourl:
          'http://i9.taou.com/maimai/p/22946/5745_12_7B3i2Yn8QoCUpi?imageMogr2/thumbnail/240x240',
        turl: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        y: 1300,
        x: 750,
        id: 229465745,
      },
      {
        tox: 138,
        toy: 240,
        tx: 160,
        ty: 160,
        url: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        tourl:
          'http://i9.taou.com/maimai/p/22946/5746_12_71YgJ59KPBtvOqHy?imageMogr2/thumbnail/240x240',
        turl: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        y: 1300,
        x: 750,
        id: 229465746,
      },
      {
        tox: 138,
        toy: 240,
        tx: 160,
        ty: 160,
        url: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        tourl:
          'http://i9.taou.com/maimai/p/22946/5747_12_81UUpSVxO4lBdWVO?imageMogr2/thumbnail/240x240',
        turl: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        y: 1300,
        x: 750,
        id: 229465747,
      },
      {
        tox: 138,
        toy: 240,
        tx: 160,
        ty: 160,
        url: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        tourl:
          'http://i9.taou.com/maimai/p/22946/5748_12_C2YiDqYztvvWda?imageMogr2/thumbnail/240x240',
        turl: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        y: 1300,
        x: 750,
        id: 229465748,
      },
      {
        tox: 138,
        toy: 240,
        tx: 160,
        ty: 160,
        url: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        tourl:
          'http://i9.taou.com/maimai/p/22946/5749_12_17yaFZpUX2kyUK?imageMogr2/thumbnail/240x240',
        turl: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        y: 1300,
        x: 750,
        id: 229465749,
      },
      {
        tox: 138,
        toy: 240,
        tx: 160,
        ty: 160,
        url: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        tourl:
          'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        turl: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        y: 1300,
        x: 750,
        id: 229465754,
      },
    ]
    return (
      <FeedMultiImg pics={pics} />
    )
  }
}
```

- 自定义图片大小

```render html
class FeedImgsDemo extends React.PureComponent {
  render() {
    const pics = [
      {
        tox: 138,
        toy: 240,
        tx: 160,
        ty: 160,
        url: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        tourl:
          'http://i9.taou.com/maimai/p/22946/5741_12_31kmhQhnVGaxMnzc?imageMogr2/thumbnail/240x240',
        turl: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        y: 1300,
        x: 750,
        id: 229465741,
      },
      {
        tox: 138,
        toy: 240,
        tx: 160,
        ty: 160,
        url: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        tourl:
          'http://i9.taou.com/maimai/p/22946/5743_12_52bpE0PvSiTYBi1m?imageMogr2/thumbnail/240x240',
        turl: 'http://i9.taou.com/maimai/p/22946/5754_12_6pdb77hFRXDY?imageMogr2/thumbnail/240x240',
        y: 1300,
        x: 750,
        id: 229465743,
      },
    ]
    return (
      <FeedMultiImg pics={pics} multiImgSize={56} />
    )
  }
}
```

## 属性

| 属性 | 说明     | 类型  | 默认值 |
| ---- | -------- | ----- | ------ |
| pics | 图片数组 | array | 空数组 |
