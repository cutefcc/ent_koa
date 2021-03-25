---
imports:
  '{MUIButton, Message}': 'mm-ent-ui'
---

## 何时使用

常用于主动操作后的反馈提示。
可提供成功、警告和错误等反馈信息。
顶部居中显示并自动消失，是一种不打断用户操作的轻量级提示方式。

## 引用方式

```render javascript
import {Message} from 'mm-ent-ui'
```

## 示例代码

```render html
class MUIButtonDemo extends React.PureComponent {
  normal = () => {
    Message.info('这是一条普通消息，60s后主动消失', 60)
  }

  success = () => {
    Message.success('这是一条成功消息，3s后主动消失')
  }

  error = () => {
    Message.error('这是一条错误消息，3s后主动消失')
  }

  warning = () => {
    Message.warning('这是一条警示消息，3s后主动消失')
  }

  render() {
    const style={
      marginRight: '16px',
      marginBottom: '8px'
    }

    return (
      <React.Fragment>
        <p>
          <MUIButton type="mbutton_m_fixed_blue450_l2" onClick={this.normal} style={style}>info</MUIButton>
          <MUIButton type="mbutton_m_fixed_blue450_l2" onClick={this.success} style={style}>Success</MUIButton>
          <MUIButton type="mbutton_m_fixed_blue450_l2" onClick={this.error} style={style}>Error</MUIButton>
          <MUIButton type="mbutton_m_fixed_blue450_l2" onClick={this.warning} style={style}>Warning</MUIButton>
        </p>
      </React.Fragment>
    )
  }
}
```
