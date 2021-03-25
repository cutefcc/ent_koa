---
imports:
  '{MUIIcon}': 'mm-ent-ui'
---

## 何时使用

需要展示自定义图标的地方，可以用于任何地方

## 使用方式

- 引入组件

```render javascript
import {MUIIcon} from 'mm-ent-ui'
```

- 用到 icon 的地方

```render javascript
<MUIIcon type="组件名称" />
```

- 可以通过 style 属性，设置 icon 的样式，如 font-size color 等
- 不能设置 font-family 属性
- 更多按钮在: [iconfont 自定义图标](https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.12&manage_type=myprojects&projectId=2072458&keyword=&project_type=&page=)
- iconfont 两个按钮库都支持

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
          <MUIIcon type="down" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          down
        </div>
        <div style={style}>
          <MUIIcon type="up" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          up
        </div>
        <div style={style}>
          <MUIIcon type="left" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          left
        </div>
        <div style={style}>
          <MUIIcon type="right" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          right
        </div>
        <div style={style}>
          <MUIIcon type="close" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          close
        </div>
        <div style={style}>
          <MUIIcon type="tel-call" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          tel-call
        </div>
        <div style={style}>
          <MUIIcon type="sort" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          sort
        </div>
        <div style={style}>
          <MUIIcon type="download" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          download
        </div>
        <div style={style}>
          <MUIIcon type="group" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          group
        </div>
        <div style={style}>
          <MUIIcon type="delete" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          delete
        </div>
        <div style={style}>
          <MUIIcon type="eye" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          eye
        </div>
        <div style={style}>
          <MUIIcon type="bell" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          bell
        </div>
        <div style={style}>
          <MUIIcon type="line" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          line
        </div>
        <div style={style}>
          <MUIIcon type="mail" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          mail
        </div>
        <div style={style}>
          <MUIIcon type="video" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          video
        </div>
        <div style={style}>
          <MUIIcon type="tag" style={{color: '#3B7AFF', fontSize: '28px'}}/>
          tag
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
