---
imports:
  'AddFriendButton': './index.js'
  '{Button}': 'mm-ent-ui'
---

## 何时使用

任何需要添加好友的地方

## 引用方式

```render javascript
import AddFriendButton from 'componentsV2/common/RightButton/AddFriendButton'
```

## 代码演示

### 主标题

> 任何形式展示的加好友，可以配合 UI 组件使用

```render html
class Demo extends React.PureComponent {
  render() {
    const data = {
      id: 123,
    }
    return (
      <AddFriendButton
        content={<Button type="button_s_fixed_blue450">加好友</Button>}
        talents={[data]}
      />
    )
  }
}
```

> 批量加好友

```render html
class Demo extends React.PureComponent {
  render() {
    const talents = [
      {
        id: 123,
      },
      {
        id: 456,
      },
      {
        id: 789,
      }
    ]

    return (
      <AddFriendButton
        content={<Button type="button_s_exact_blue450">批量加好友</Button>}
        talents={talents}
      />
    )
  }
}
```

## 属性

| 属性 | 说明             | 是否必填 | 类型  | 默认值 |
| ---- | ---------------- | -------- | ----- | ------ |
| data | 需要针对操作的人 | 是       | array | 空数组 |
