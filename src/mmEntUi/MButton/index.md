---
imports:
  'MUIButton': './index.js'
  '{Icon, Text}': 'mm-ent-ui'
---

## 何时使用

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

## 引用方式

```render javascript
import {MUIButton} from 'mm-ent-ui'
```

## 示例代码

```render html
class ButtonDemo extends React.PureComponent {
  handleClick = () => {
    console.log('click')
  }

  render() {
    const style={
      marginRight: '16px',
      marginBottom: '8px'
    }

    return (
      <React.Fragment>
        <p>一级按钮（size：S（h: 24）、M(h: 32)、L(h: 40)）</p>
        <p>
          <MUIButton type="mbutton_s_fixed_blue450_l1" onClick={this.handleClick} style={style}>一级按钮</MUIButton>
          <MUIButton type="mbutton_m_fixed_blue450_l1" onClick={this.handleClick} style={style}>一级按钮</MUIButton>
          <MUIButton type="mbutton_l_fixed_blue450_l1" onClick={this.handleClick} style={style}>一级按钮</MUIButton>
          <MUIButton disabled type="mbutton_s_fixed_blue450_l1" onClick={this.handleClick} style={style}>一级按钮</MUIButton>
          <MUIButton disabled type="mbutton_m_fixed_blue450_l1" onClick={this.handleClick} style={style}>一级按钮</MUIButton>
          <MUIButton disabled type="mbutton_l_fixed_blue450_l1" onClick={this.handleClick} style={style}>一级按钮</MUIButton>
        </p>
        <p>一级按钮(带图标)（size：S（h: 24）、M(h: 32)、L(h: 40)）</p>
        <p>
            <MUIButton type="mbutton_s_exact_blue450_l1" onClick={this.handleClick} style={style}>
                <span><Icon type="download" style={{marginRight: '6px'}}/>一级按钮</span>
            </MUIButton>
          <MUIButton type="mbutton_m_exact_blue450_l1" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>一级按钮</span>
          </MUIButton>
          <MUIButton type="mbutton_l_exact_blue450_l1" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>一级按钮</span>
          </MUIButton>
          <MUIButton disabled type="mbutton_s_exact_blue450_l1" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>一级按钮</span>
          </MUIButton>
          <MUIButton disabled type="mbutton_m_exact_blue450_l1" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>一级按钮</span>
          </MUIButton>
          <MUIButton disabled type="mbutton_l_exact_blue450_l1" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>一级按钮</span>
          </MUIButton>
        </p>
        <p>二级按钮（size：S（h: 24）、M(h: 32)、L(h: 40)）</p>
        <p>
          <MUIButton type="mbutton_s_fixed_blue450_l2" onClick={this.handleClick} style={style}>二级按钮</MUIButton>
          <MUIButton type="mbutton_m_fixed_blue450_l2" onClick={this.handleClick} style={style}>二级按钮</MUIButton>
          <MUIButton type="mbutton_l_fixed_blue450_l2" onClick={this.handleClick} style={style}>二级按钮</MUIButton>
          <MUIButton disabled type="mbutton_s_fixed_blue450_l2" onClick={this.handleClick} style={style}>二级按钮</MUIButton>
          <MUIButton disabled type="mbutton_m_fixed_blue450_l2" onClick={this.handleClick} style={style}>二级按钮</MUIButton>
          <MUIButton disabled type="mbutton_l_fixed_blue450_l2" onClick={this.handleClick} style={style}>二级按钮</MUIButton>
        </p>
        <p>二级按钮(带图标)（size：S（h: 24）、M(h: 32)、L(h: 40)）</p>
        <p>
            <MUIButton type="mbutton_s_exact_blue450_l2" onClick={this.handleClick} style={style}>
                <span><Icon type="download" style={{marginRight: '6px'}}/>二级按钮</span>
            </MUIButton>
          <MUIButton type="mbutton_m_exact_blue450_l2" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>二级按钮</span>
          </MUIButton>
          <MUIButton type="mbutton_l_exact_blue450_l2" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>二级按钮</span>
          </MUIButton>
          <MUIButton disabled type="mbutton_s_exact_blue450_l2" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>二级按钮</span>
          </MUIButton>
          <MUIButton disabled type="mbutton_m_exact_blue450_l2" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>二级按钮</span>
          </MUIButton>
          <MUIButton disabled type="mbutton_l_exact_blue450_l2" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>二级按钮</span>
          </MUIButton>
        </p>
        <p>三级按钮（size：S（h: 24）、M(h: 32)、L(h: 40)）</p>
        <p>
          <MUIButton type="mbutton_s_fixed_l3" onClick={this.handleClick} style={style}>三级按钮</MUIButton>
          <MUIButton type="mbutton_m_fixed_l3" onClick={this.handleClick} style={style}>三级按钮</MUIButton>
          <MUIButton type="mbutton_l_fixed_l3" onClick={this.handleClick} style={style}>三级按钮</MUIButton>
          <MUIButton disabled type="mbutton_s_fixed_l3" onClick={this.handleClick} style={style}>三级按钮</MUIButton>
          <MUIButton disabled type="mbutton_m_fixed_l3" onClick={this.handleClick} style={style}>三级按钮</MUIButton>
          <MUIButton disabled type="mbutton_l_fixed_l3" onClick={this.handleClick} style={style}>三级按钮</MUIButton>
        </p>
        <p>三级按钮(带图标)（size：S（h: 24）、M(h: 32)、L(h: 40)）</p>
        <p>
            <MUIButton type="mbutton_s_exact_l3" onClick={this.handleClick} style={style}>
                <span><Icon type="download" style={{marginRight: '6px'}}/>三级按钮</span>
            </MUIButton>
          <MUIButton type="mbutton_m_exact_l3" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>三级按钮</span>
          </MUIButton>
          <MUIButton type="mbutton_l_exact_l3" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>三级按钮</span>
          </MUIButton>
          <MUIButton disabled type="mbutton_s_exact_l3" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>三级按钮</span>
          </MUIButton>
          <MUIButton disabled type="mbutton_m_exact_l3" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>三级按钮</span>
          </MUIButton>
          <MUIButton disabled type="mbutton_l_exact_l3" onClick={this.handleClick} style={style}>
            <span><Icon type="download" style={{marginRight: '6px'}}/>三级按钮</span>
          </MUIButton>
        </p>
      </React.Fragment>
    )
  }
}
```
