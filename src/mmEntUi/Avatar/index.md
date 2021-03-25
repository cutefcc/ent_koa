---
imports:
  '{Avatar}': 'mm-ent-ui'
  '{Badge}': 'antd'
---

## 何时使用

展示头像，或者公司 logo 的时候

## 引用方式

```render javascript
import {Avatar} from 'mm-ent-ui'
```

## 代码演示

> 组件名称： 头像*形状*大小 例如 头像\_circle_56

```render html
class AvatarDemo extends React.PureComponent {
  render() {
    const style={
      marginRight: '16px',
    }
    return (
      <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
        <div style={style}><Avatar shape="circle" size="56px" src="https://i9.taou.com/maimai/p/21954/4400_82_7bzTQITze0xjJC-a160"/></div>
        <div style={style}><Avatar shape="circle" size="56px" name="王艳琴" /></div>
        <div style={style}><Avatar shape="circle" size="56px" /></div>
        <div style={style}><Avatar shape="square" size="40px" src="https://i9.taou.com/maimai/p/21954/4400_82_7bzTQITze0xjJC-a160"/></div>
        <div style={style}><Avatar shape="square" size="40px" name="王艳琴" /></div>
        <div style={style}><Avatar shape="square" size="40px" /></div>
      </div>
    )
  }
}

```

> 带未读消息的头像

```render html
class AvatarDemo extends React.PureComponent {
  render() {
    const style={
      marginRight: '16px',
    }
    return (
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        <Badge count={23} overflowCount={99} style={style}>
          <Avatar shape="circle" size="56px" name="王艳琴" />
        </Badge>

        <Badge count={233} overflowCount={99} style={style}>
          <Avatar shape="circle" size="56px" name="王艳琴" />
        </Badge>
      </div>
    )
  }
}

```

> 带会员图标的头像

```render html

class AvatarDemo extends React.PureComponent {
  render() {
    const style={
      marginRight: '16px',
    }
    return (
      <div style={style}>
        <Avatar shape="circle" size="72px" name="王艳琴" showMemBadge memId={6} />
      </div>
    )
  }
}
```

## 展示规则

如果没有 arc 字段，则取 name 的最后一个字段，如果没有 name 字段，则默认为 U

## 属性

| 属性         | 说明                                            | 类型             | 默认值   |
| ------------ | ----------------------------------------------- | ---------------- | -------- |
| src          | 头像链接                                        | string           | 空字符串 |
| name         | 当没有头像的时候，取名字最后一位展示            | string           | 空字符串 |
| shape        | 头像形状                                        | circle 或 square | circle   |
| size         | 头像的大小                                      | string 如 40px   | 40px     |
| showMemBadge | 是否展示会员图标                                | boolean          | false    |
| memId        | 会员类型 id，在 showMemBadge 为 true 时才会生效 | number           | 0        |
