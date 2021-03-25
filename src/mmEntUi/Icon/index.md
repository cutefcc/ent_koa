---
imports:
  '{Icon}': 'mm-ent-ui'
---

## 何时使用

需要展示图标的地方，可以用于任何地方

## 使用方式

- 引入组件

```render javascript
import {Icon} from 'mm-ent-ui'
```

- 用到 icon 的地方

```render javascript
<Icon type="组件名称" />
```

- 可以通过 style 属性，设置 icon 的样式，如 font-size color 等
- 不能设置 font-family 属性

## 案例

```render html
class ButtonDemo extends React.PureComponent {
  render() {
    const style={
      display: 'flex',
      flexDirection: 'column',
      margin: '0 16px 16px 0',
      alignItems: 'center',
      width: '100px',
    }
    return (
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        <div style={style}>
          <Icon type="arrow-down" style={{color: '#3375ff', fontSize: '28px'}}/>
          arrow-down
        </div>
        <div style={style}>
          <Icon type="arrow-up" style={{color: '#3375ff', fontSize: '28px'}}/>
          arrow-up
        </div>
        <div style={style}>
          <Icon type="arrow-left" style={{color: '#3375ff', fontSize: '28px'}}/>
          arrow-left
        </div>
        <div style={style}>
          <Icon type="arrow-right" style={{color: '#3375ff', fontSize: '28px'}}/>
          arrow-right
        </div>
        <div style={style}>
          <Icon type="close-outline" style={{color: '#3375ff', fontSize: '28px'}}/>
          close-outline
        </div>
        <div style={style}>
          <Icon type="icon_call" style={{color: '#3375ff', fontSize: '28px'}}/>
          icon_call
        </div>
        <div style={style}>
          <Icon type="icon_sort" style={{color: '#3375ff', fontSize: '28px'}}/>
          icon_sort
        </div>
        <div style={style}>
          <Icon type="icon_download" style={{color: '#3375ff', fontSize: '28px'}}/>
          icon_download
        </div>
        <div style={style}>
          <Icon type="icon_dynamic" style={{color: '#3375ff', fontSize: '28px'}}/>
          icon_dynamic
        </div>
        <div style={style}>
          <Icon type="talent_search" style={{color: '#3375ff', fontSize: '28px'}}/>
          talent_search
        </div>
        <div style={style}>
          <Icon type="add_friend" style={{color: '#3375ff', fontSize: '28px'}}/>
          add_friend
        </div>
        <div style={style}>
          <Icon type="direct_im" style={{color: '#3375ff', fontSize: '28px'}}/>
          direct_im
        </div>
        <div style={style}>
          <Icon type="chat" style={{color: '#3375ff', fontSize: '28px'}}/>
          chat
        </div>
        <div style={style}>
          <Icon type="add_label" style={{color: '#3375ff', fontSize: '28px'}}/>
          add_label
        </div>


        <div style={style}>
          <Icon type="radio_checked" style={{fontSize: '28px'}}/>
          radio_checked
        </div>
        <div style={style}>
          <Icon type="discover2" style={{color: '#3375ff', fontSize: '28px'}}/>
          discover2
        </div>
        <div style={style}>
          <Icon type="recruit2" style={{color: '#3375ff', fontSize: '28px'}}/>
          recruit2
        </div>
        <div style={style}>
          <Icon type="talent_pool2" style={{color: '#3375ff', fontSize: '28px'}}/>
          talent_pool2
        </div>
        <div style={style}>
          <Icon type="data2" style={{color: '#3375ff', fontSize: '28px'}}/>
          data2
        </div>
        <div style={style}>
          <Icon type="invite" style={{color: '#3375ff', fontSize: '28px'}}/>
          icon_edit
        </div>
        <div style={style}>
          <Icon type="talentpool" style={{color: '#3375ff', fontSize: '28px'}}/>
          talentpool
        </div>
      </div>
    )
  }
}
```

## 属性

| 属性  | 说明           | 类型   | 默认值                          |
| ----- | -------------- | ------ | ------------------------------- |
| type  | 文字的基本样式 | string | common,可选值 title,common,week |
| style | 设置样式       | object | 无                              |
