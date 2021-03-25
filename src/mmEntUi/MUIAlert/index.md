---
imports:
  '{MUIAlert}': 'mm-ent-ui'
---

## 何时使用

需要展示警告提示框的地方，可以用于任何地方

## 使用方式

- 引入组件

```render javascript
import {MUIIcon} from 'mm-ent-ui'
```

- 可以通过 style 属性，设置 alert 的样式，如 margin 等
- 可以通过 style 属性，设置 isTips 的样式，如 font-size 等

## 案例

```render html
class ButtonDemo extends React.PureComponent {
  render() {
    
    return (
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        <MUIAlert message="提示文字" type="info" />
        <br />
        <MUIAlert
          message="提示文字 + Icon + 关闭"
          type="info"
          showIcon
          closable
        />
        <br />
        <MUIAlert
          message="提示文字 + Icon + 关闭 + 描述"
          type="info"
          description="文字描述文字描述文字描述文字描述文字描述文字描述"
          showIcon
          closable
        />
        <br />
        <MUIAlert
          message="提示文字 + 次要按钮"
          type="info"
          showIcon
          closable
          buttonWord="次要按钮"
          buttonType="second"
          handleClick={() => {
            alert('次要按钮')
          }}
        />
        <br />
        <MUIAlert
          message="提示文字 + 文字按钮"
          type="info"
          description="文字描述文字描述文字描述文字描述文字描述文字描述"
          showIcon
          closable
          buttonWord="文字按钮"
          buttonType="word"
          handleClick={() => {
            alert('文字按钮')
          }}
        />
        <br />
        <MUIAlert
          message="提示文字 + 主要按钮"
          type="info"
          showIcon
          buttonWord="主要按钮"
          buttonType="main"
          handleClick={() => {
            alert('主要按钮')
          }}
        />
        <br />
        <MUIAlert message="出错示意" type="error" showIcon closable />
        <br />
        <MUIAlert message="成功示意" type="success" showIcon closable />
        <br />
        <MUIAlert message="注意示意" type="warning" showIcon closable />
        <br />
        <MUIAlert message="帮助示意" type="info" showIcon closable />
        <br />
        <MUIAlert message="成功文字提示" type="success" isTips />
        <br />
        <MUIAlert message="帮助文字提示" type="info" isTips />
        <br />
        <MUIAlert message="错误文字提示" type="error" isTips />
        <br />
        <MUIAlert message="注意文字提示" type="warning" isTips />
        <br />
        <MUIAlert message="注释文字提示" type="comment" isTips />
        <br />
      </div>
    )
  }
}
```

## 属性

| 属性         | 说明           | 类型             | 默认值                                                              |
| ----------- | -------------- | --------------- | ------------------------------------------------------------------ |
| type        | 格式            | string          | info,可选值 info,success,warning,error,comment(isTips为true时有效)   |
| style       | 设置样式        | object           | 无                                                                 |
| closable    | 是否显示关闭按钮  | boolean         | false                                                              |
| showIcon    | 是否显示图标      | boolean         | false                                                              |
| isTips      | 是否是行内提示    | boolean         | false                                                              |
| message     | 显示内容         | string/ReactDom | 无                                                                 |
| description | 简介            | string/ReactDom  | 无                                                                 |
| buttonType  | 按钮类型        | string            | main,可选值 main,second,word                                       |
| buttonWord  | 按钮文字        | string            | 空                                                                |
| onClose     | 关闭之后的回调    | function         | 无                                                                |
| handleClick | 点击按钮之后的回调 | function         | 无                                                                |