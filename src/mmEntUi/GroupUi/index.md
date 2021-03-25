---
imports:
  'GroupUi': './index.js'
---

## 何时使用

需要修改分组的地方，这里只有 ui 相关，不包含获取数据逻辑，分组和人数上限后端策略一致，所以目前在组件内部写了固定常量

## 引用方式

```render javascript
import {GroupUi} from 'mm-ent-ui'
```

## 代码演示

### 主标题

```render html
class GroupDemo extends React.PureComponent {
  state = {
    value: {
      entGroups: [1, 2],
      personalGroups: [1]
    }
  }

  handleValueChange = value => {
    this.setState({
      value,
    })
  }

  render() {
    const {value = {}} = this.state || {}
    const talents = [
      {id: 1, name: '张某某'}
    ]
    const groups = {
      entGroups: [
        {
          id: 1,
          name: '企业分组1',
          total: 1
          // talents_num: 1
          // total_selected: 1
        },
        {
          id: 2,
          name: '企业分组2',
          total: 1
        },
        {
          id: 3,
          name: '企业分组3',
          total: 100
        },
      ],
      personalGroups: [
        {
          id: 1,
          name: '个人分组1',
          total: 1
        },
        {
          id: 2,
          name: '个人分组2',
          total: 1
        }
      ]
    }
    return (
      <GroupUi
        talents={talents}
        groups={groups}
        value={value}
        onChange={this.handleValueChange}
        isEditMode={false}
      />
    )
  }
}
```

## 属性

| 属性         | 说明                                               | 是否必填 | 类型                                                                   | 默认值 |
| ------------ | -------------------------------------------------- | -------- | ---------------------------------------------------------------------- | ------ |
| talents      | 将要被添加到分组的候选人                           | 是       | array                                                                  | []     |
| value        | 选中的分组，如果传有效值则是受控组件               | 否       | object: entGroups: Array[groupId], persoonalGroups: Array[groupId]     |        |
| defaultValue | 默认选中的分组                                     | 否       | object: entGroups: Array[groupId], persoonalGroups: Array[groupId]     |        |
| groups       | 所有可选分组                                       | 是       | object: entGroups: Array[groupItem], persoonalGroups: Array[groupItem] |        |
| onChange     | 当值变化时的回调函数                               | 是       | function(value) 参数类型同 value                                       |        |
| isEditMode   | 是否是编辑模式，如果是编辑模式，会有一些默认的提示 | 否       | boolean                                                                | false  |
| className    | 类名                                               | 否       | string                                                                 | ''     |
