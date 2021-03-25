---
imports:
  'Button': './index.js'
---

## 何时使用

标记了一个（或封装一组）操作命令，响应用户点击行为，触发相应的业务逻辑。

## 引用方式

```render javascript
import {Button} from 'mm-ent-ui'
```

## 示例代码

> 正常状态和 hover 状态

```render html
class ButtonDemo extends React.PureComponent {
  handleClick = () => {
    alert('按钮被点击了')
  }

  render() {
    const style={
      marginRight: '16px',
      marginBottom: '8px'
    }

    return (
      <React.Fragment>
        <p>
          <Button type="button_s_fixed_blue450" onClick={this.handleClick} style={style}>主按钮</Button>
          <Button type="button_s_fixed_blue650" onClick={this.handleClick} style={style}>主按钮</Button>
          <Button type="button_s_fixed_blue150" onClick={this.handleClick} style={style}>次主按钮</Button>
          <Button type="button_s_fixed_ghost_blue450" onClick={this.handleClick} style={style}>普通按钮</Button>
          <Button type="button_s_exact_blue450" onClick={this.handleClick} style={style}>自适应主</Button>
          <Button type="button_s_exact_blue100" onClick={this.handleClick} style={style}>自适应弱</Button>
          <Button type="button_s_exact_link_blue" onClick={this.handleClick} style={style}>blue文字链</Button>
          <Button type="button_s_exact_link_bgray" onClick={this.handleClick} style={style}>bgray文字链</Button>
          <Button type="button_s_exact_link_gray" onClick={this.handleClick} style={style}>gray文字链</Button>
        </p>
        <p>
          <Button type="button_m_fixed_blue450" onClick={this.handleClick} style={style}>主按钮</Button>
          <Button type="button_m_fixed_blue650" onClick={this.handleClick} style={style}>主按钮</Button>
          <Button type="button_m_fixed_blue150" onClick={this.handleClick} style={style}>次主按钮</Button>
          <Button type="button_m_fixed_ghost_blue450" onClick={this.handleClick} style={style}>普通按钮</Button>
          <Button type="button_m_exact_blue450" onClick={this.handleClick} style={style}>自适应主</Button>
          <Button type="button_m_exact_blue100" onClick={this.handleClick} style={style}>自适应弱</Button>
          <Button type="button_m_exact_link_blue" onClick={this.handleClick} style={style}>blue文字链</Button>
          <Button type="button_m_exact_link_bgray" onClick={this.handleClick} style={style}>bgray文字链</Button>
          <Button type="button_m_exact_link_gray" onClick={this.handleClick} style={style}>gray文字链</Button>
        </p>
        <p>
          <Button type="button_l_fixed_blue450" onClick={this.handleClick} style={style}>主按钮</Button>
          <Button type="button_l_fixed_blue650" onClick={this.handleClick} style={style}>主按钮</Button>
          <Button type="button_l_fixed_blue150" onClick={this.handleClick} style={style}>次主按钮</Button>
          <Button type="button_l_fixed_ghost_blue450" onClick={this.handleClick} style={style}>普通按钮</Button>
          <Button type="button_l_exact_blue450" onClick={this.handleClick} style={style}>自适应主</Button>
          <Button type="button_l_exact_blue100" onClick={this.handleClick} style={style}>自适应弱</Button>
          <Button type="button_l_exact_link_blue" onClick={this.handleClick} style={style}>链接</Button>
          <Button type="button_l_exact_link_blue" onClick={this.handleClick} style={style}>blue文字链</Button>
          <Button type="button_l_exact_link_bgray" onClick={this.handleClick} style={style}>bgray文字链</Button>
          <Button type="button_l_exact_link_gray" onClick={this.handleClick} style={style}>gray文字链</Button>
        </p>
      </React.Fragment>
    )
  }
}
```

> disbaled 状态

```render html
class ButtonDemo extends React.PureComponent {
  render() {
    const style={
      marginRight: '16px',
      marginBottom: '16px'
    }
    return (
      <React.Fragment>
        <p>
          <Button type="button_s_fixed_blue450" disabled style={style}>主按钮</Button>
          <Button type="button_s_fixed_blue150" disabled style={style}>次主按钮</Button>
          <Button type="button_s_fixed_ghost_blue450" disabled style={style}>普通按钮</Button>
          <Button type="button_s_exact_blue450" disabled style={style}>自适应主</Button>
          <Button type="button_s_exact_blue100" disabled style={style}>自适应弱</Button>
          <Button type="button_s_exact_link_blue" disabled style={style}>blue文字链</Button>
          <Button type="button_s_exact_link_bgray" disabled style={style}>bgray文字链</Button>
          <Button type="button_s_exact_link_gray" disabled style={style}>gray文字链</Button>
        </p>
        <p>
          <Button type="button_m_fixed_blue450" disabled style={style}>主按钮</Button>
          <Button type="button_m_fixed_blue150" disabled style={style}>次主按钮</Button>
          <Button type="button_m_fixed_ghost_blue450" disabled style={style}>普通按钮</Button>
          <Button type="button_m_exact_blue450" disabled style={style}>自适应主</Button>
          <Button type="button_m_exact_blue100" disabled style={style}>自适应弱</Button>
          <Button type="button_m_exact_link_blue" disabled style={style}>blue文字链</Button>
          <Button type="button_m_exact_link_bgray" disabled style={style}>bgray文字链</Button>
          <Button type="button_m_exact_link_gray" disabled style={style}>gray文字链</Button>
        </p>
        <p>
          <Button type="button_l_fixed_blue450" disabled style={style}>主按钮</Button>
          <Button type="button_l_fixed_blue150" disabled style={style}>次主按钮</Button>
          <Button type="button_l_fixed_ghost_blue450" disabled style={style}>普通按钮</Button>
          <Button type="button_l_exact_blue450" disabled style={style}>自适应主</Button>
          <Button type="button_l_exact_blue100" disabled style={style}>自适应弱</Button>
          <Button type="button_l_exact_link_blue" disabled style={style}>链接</Button>
          <Button type="button_l_exact_link_blue" disabled style={style}>blue文字链</Button>
          <Button type="button_l_exact_link_bgray" disabled style={style}>bgray文字链</Button>
          <Button type="button_l_exact_link_gray" disabled style={style}>gray文字链</Button>
        </p>
      </React.Fragment>
    )
  }
}
```

## 属性

| 属性  | 说明           | 类型    | 默认值                 |
| ----- | -------------- | ------- | ---------------------- |
| type  | 按钮的基本样式 | string  | button_m_fixed_blue450 |
| round | 按钮是否为圆角 | boolean | flase                  |

## type 命名规则

- s,m,l 表示尺寸
- fixed：固定尺寸 block：通栏 exact：里面多宽我多宽=自适应 (padding 固定，按钮宽度随着文字大小自适应)
- ghost 表示没有背景 link: 没有背景，没有边框,色值代表边框和文字颜色
- 颜色名称：按钮主颜色

[参考文档](https://docs.taou.com/pages/viewpage.action?pageId=54071312)
