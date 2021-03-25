---
imports:
  '{Button}': 'antd'
  '{Tooltip, MUIButton}': 'mm-ent-ui'
---

## 何时使用

简单的文字提示气泡框。

鼠标移入则显示提示，移出消失，气泡浮层不承载复杂文本和操作。

可用来代替系统默认的 title 提示，提供一个 按钮/文字/操作 的文案解释。


## 引用方式

```render javascript
import {Tooltip} from 'mm-ent-ui'
```

## 示例代码

```render html
class MUITooltipDemo extends React.PureComponent {

  render() {
    const style={
      marginRight: '8px',
      marginBottom: '8px',
      width: '70px',
    }

    const text = <span>prompt text</span>;

    const buttonWidth = 70;

    return (
      <React.Fragment>
        <div style={{position: 'relative'}}>
          <p style={{background: 'rgba(0,0,0,0.06)', marginBottom: 20}}>十二个方向</p>
          <div style={{ marginLeft: buttonWidth, whiteSpace: 'nowrap' }}>
            <Tooltip placement="topLeft" title={text} >
              <Button style={style}>TL</Button>
            </Tooltip>
            <Tooltip placement="top" title={text} visible={true}>
              <Button style={style}>Top</Button>
            </Tooltip>
            <Tooltip placement="topRight" title={text}>
              <Button style={style}>TR</Button>
            </Tooltip>
          </div>
          <div style={{ width: buttonWidth, float: 'left' }}>
            <Tooltip placement="leftTop" title={text}>
              <Button style={style}>LT</Button>
            </Tooltip>
            <Tooltip placement="left" title={text}>
              <Button style={style}>Left</Button>
            </Tooltip>
            <Tooltip placement="leftBottom" title={text}>
              <Button style={style}>LB</Button>
            </Tooltip>
          </div>
          <div style={{ width: buttonWidth, marginLeft: buttonWidth * 4 + 24 }}>
            <Tooltip placement="rightTop" title={text}>
              <Button style={style}>RT</Button>
            </Tooltip>
            <Tooltip placement="right" title={text}>
              <Button style={style}>Right</Button>
            </Tooltip>
            <Tooltip placement="rightBottom" title={text}>
              <Button style={style}>RB</Button>
            </Tooltip>
          </div>
          <div style={{ marginLeft: buttonWidth, clear: 'both', whiteSpace: 'nowrap' }}>
            <Tooltip placement="bottomLeft" title={text}>
              <Button style={style}>BL</Button>
            </Tooltip>
            <Tooltip placement="bottom" title={text}>
              <Button style={style}>Bottom</Button>
            </Tooltip>
            <Tooltip placement="bottomRight" title={text}>
              <Button style={style}>BR</Button>
            </Tooltip>
          </div>
          <p style={{background: 'rgba(0,0,0,0.06)', marginBottom: 60}}>白底、link</p>
          <div>
            <Tooltip placement="top" title={<span>支持<a href="https://www.baidu.com/" target="_blank">超链接</a></span>} theme="white" defaultVisible={true}>
              <MUIButton type="mbutton_m_fixed_blue450_l1" style={style}>白底背景</MUIButton>
            </Tooltip>
            <Tooltip placement="right" title={<span>最长280px，超出换行,最长280px，超出换行，最长280px，超出换行，最长280px，超出换行</span>} theme="white" visible={true}>
              <MUIButton type="mbutton_m_fixed_blue450_l1">超出换行</MUIButton>
            </Tooltip>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
```
