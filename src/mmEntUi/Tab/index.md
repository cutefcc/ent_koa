---
imports:
  'Tab': './index.js'
---

## 何时使用

用到 Tab 的地方

## 引用方式

```render javascript
import {Tab} from 'mm-ent-ui'
```

## 组件名称

> 组件名称： Tab

## 代码演示

- 一级页面 tab

```render html
class TabDemo extends React.PureComponent {
  state = {
    activeKeys: [1]
  }

  handleTabChange = config => {
    this.setState({
      activeKeys: [config.key],
    })
  }

  render() {
    const tabsConfig = [
      {
        title: '企业动态',
        key: 1
      },
      {
        title: '员工动态',
        key: 2
      },
      {
        title: '其他动态',
        key: 3
      }
    ]

    return (
      <div style={{borderBottom: '1px solid #eee'}}>
        <Tab
          tabs={tabsConfig}
          activeKeys={this.state.activeKeys}
          onChange={this.handleTabChange}
          type="large"
          style={{marginLeft: '8px'}}
        />
      </div>
    )
  }
}
```

- 二级页面 tab

```render html
class TabDemo extends React.PureComponent {
  state = {
    activeKeys: [1]
  }

  handleTabChange = config => {
    this.setState({
      activeKeys: [config.key],
    })
  }

  render() {
    const tabsConfig = [
      {
        title: '企业动态',
        key: 1
      },
      {
        title: '员工动态',
        key: 2
      },
      {
        title: '其他动态',
        key: 3
      }
    ]

    return (
      <div>
        <Tab
          tabs={tabsConfig}
          activeKeys={this.state.activeKeys}
          onChange={this.handleTabChange}
          type="small"
        />
      </div>
    )
  }
}
```

## 属性

| 属性       | 说明     | 类型          | 默认值 |
| ---------- | -------- | ------------- | ------ |
| tabsConfig | tab 选项 | array(Object) | 空数组 |
