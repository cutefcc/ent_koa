---
imports:
  '{Icon, Text, MUIButton, MUIModal}': 'mm-ent-ui'
---

## 引用方式

```render javascript
import {MUIModal} from 'mm-ent-ui'
```

## 示例代码

```render html
class MUIModalDemo extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
    }
  }

  render() {
    const style={
      marginRight: '16px',
      marginBottom: '8px'
    }

    return (
      <div>
        <div>
          <p>基础型弹窗最小高度minHeight = 400px，宽度（默认560px）</p>
          <p>
            <MUIButton type="mbutton_m_fixed_blue450_l2" onClick={() => {
              this.setState({
                visible1: true,
              })
            }} style={style}>基础弹窗-不带footer</MUIButton>
          </p>
          <MUIModal
            key={'Modal1'}
            title="弹窗标题"
            visible={this.state.visible1}
            onOk={() => {
              this.setState({
                visible1: false,
              })
            }}
            onCancel={() => {
              this.setState({
                visible1: false,
              })
            }}
            footer={null}
          >
            <p>Somecontents...fdfjdjfoijfoidjfodjfodfjdofjdofjdfodfojfomofsnioofjdofjdfodfojfomofsnioofjdofjdfodfojfomofsnioofjdofjdfodfojfo...</p>
          </MUIModal>
        </div>
        <div>
          <p>自定义footer、width、heitht（内容超出显示滚动条）</p>
          <p>
            <MUIButton type="mbutton_m_fixed_blue450_l2" onClick={() => {
              this.setState({
                visible2: true,
              })
            }} style={style}>基础弹窗-带footer</MUIButton>
          </p>
          <MUIModal
            key={'Modal2'}
            title="弹窗标题"
            visible={this.state.visible2}
            onOk={() => {
              this.setState({
                visible2: false,
              })
            }}
            onCancel={() => {
              this.setState({
                visible2: false,
              })
            }}
            width={800}
            height={600}
            footer={
                <div>
                  <MUIButton type="mbutton_m_fixed_l3" onClick={() => {
                    this.setState({
                      visible2: false,
                    })
                  }}>取消</MUIButton>
                  <MUIButton type="mbutton_m_fixed_blue450_l1" onClick={() => {
                    this.setState({
                      visible2: false,
                    })
                  }}>确定</MUIButton>
                </div>
            }
          >
            <p>Somecontents...fdfjdjfoijfoidjfodjfodfjdofjdofjdfodfojfomofsnioofjdofjdfodfojfomofsnioofjdofjdfodfojfomofsnioofjdofjdfodfojfo</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </MUIModal>
        </div>
        <div>
          <p>高度随浏览器视窗变化自适应(上下64px) height='auto'</p>
          <p>
            <MUIButton type="mbutton_m_fixed_blue450_l2" onClick={() => {
              this.setState({
                visible3: true,
              })
            }} style={style}>基础弹窗-height自适应</MUIButton>
          </p>
          <MUIModal
            key={'Modal3'}
            title="弹窗标题"
            visible={this.state.visible3}
            onOk={() => {
              this.setState({
                visible3: false,
              })
            }}
            onCancel={() => {
              this.setState({
                visible3: false,
              })
            }}
            height={'auto'}
            footer={
                <div>
                  <MUIButton type="mbutton_m_fixed_l3" onClick={() => {
                    this.setState({
                      visible3: false,
                    })
                  }}>取消</MUIButton>
                  <MUIButton type="mbutton_m_fixed_blue450_l1" onClick={() => {
                      this.setState({
                      visible3: false,
                    })
                  }}>确定</MUIButton>
                </div>
            }
          >
            <p>Somecontents...fdfjdjfoijfoidjfodjfodfjdofjdofjdfodfojfomofsnioofjdofjdfodfojfomofsnioofjdofjdfodfojfomofsnioofjdofjdfodfojfomofsnio</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </MUIModal>
        </div>
        <div>
          <p>通知类型弹窗</p>
          <p>
            <MUIButton type="mbutton_m_fixed_blue450_l2" onClick={() => {
              this.setState({
                visible4: true,
              })
            }} style={style}>通知类型弹窗</MUIButton>
          </p>
          <MUIModal
            key={'Modal4'}
            type={'notice'}
            title={<div><Icon type="invite" /><span style={{paddingLeft: '8px'}}>标题</span></div>}
            visible={this.state.visible4}
            onOk={() => {
              this.setState({
                visible4: false,
              })
            }}
            onCancel={() => {
              this.setState({
                visible4: false,
              })
            }}
            width={420}
            height={182}
            footer={
                <div>
                  <MUIButton type="mbutton_m_fixed_l3" onClick={() => {
                    this.setState({
                      visible4: false,
                    })
                  }}>取消</MUIButton>
                  <MUIButton type="mbutton_m_fixed_blue450_l1" onClick={() => {
                      this.setState({
                      visible4: false,
                    })
                  }}>确定</MUIButton>
                </div>
            }
          >
            <p>SoSomecontents...fdfjdjfoijfoidjfodjfoe</p>
          </MUIModal>
        </div>
      </div>
    )
  }
}
```
