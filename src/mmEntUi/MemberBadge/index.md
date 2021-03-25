---
imports:
  'MemberBadge': './index.js'
---

## 何时使用

所有需要展示会员图标的地方

## 引用方式

```render javascript
import {MemberBadge} from 'mm-ent-ui'
```

## 组件名称

> 组件名称： MemberBadge

## 代码演示

```render html
class Demo extends React.PureComponent {
  render() {
    const style={
      marginRight: '16px',
    }
    return (
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        <p style={style}>
          <label>会员1：</label><MemberBadge memId={1} />
        </p>
        <p style={style}>
          <label>会员2：</label><MemberBadge memId={2} />
        </p>
        <p style={style}>
          <label>会员3：</label><MemberBadge memId={3} />
        </p>
        <p style={style}>
          <label>会员4：</label><MemberBadge memId={4} />
        </p>
        <p style={style}>
          <label>会员5：</label><MemberBadge memId={5} />
        </p>
        <p style={style}>
          <label>会员6：</label><MemberBadge memId={6} />
        </p>
        <p style={style}>
          <label>会员7：</label><MemberBadge memId={7} />
        </p>
      </div>
    )
  }
}
```

## 属性

| 属性  | 说明    | 类型   | 默认值 |
| ----- | ------- | ------ | ------ |
| memId | 会员 id | number | 空     |
