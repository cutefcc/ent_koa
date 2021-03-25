---
imports:
  'Badge': './index.js'
  '{MUIAvatar}': 'mm-ent-ui'
  '{ClockCircleOutlined}': '@ant-design/icons'
---

## 何时使用

以徽标形式承载数字/符号信息。
一般出现在通知图标或头像的右上角，用于显示需要处理的消息条数，通过醒目视觉形式吸引用户关注和处理
作为一个链接，快速查看详情的入口
代表事件的状态，让用户提前知道事件的进展情况

## 引用方式

```render javascript
import {Badge} from 'mm-ent-ui'
```

## 示例代码

```render html
class BadgeDemo extends React.PureComponent {

  render() {
    return (
      <div>
        <h3>数字徽标，需要准确计数的场景</h3>
        <div style={{width: '220px', display: 'flex', justifyContent: 'space-between'}}>
          <Badge count={5}>
            <MUIAvatar shape="square" size={40}/>
          </Badge>
          <Badge count={56} showZero>
            <MUIAvatar shape="square" size={40} />
          </Badge>
          <Badge count={100} showZero>
            <MUIAvatar shape="square" size={40} />
          </Badge>
        </div>
        <h3>点徽标状态示意，无需准确计数，仅做提醒的场景</h3>
        <div style={{width: '300px', display: 'flex', justifyContent: 'space-between'}}>
          <Badge dot>
            <span>小红点</span>
          </Badge>
          <Badge status="success">
            <MUIAvatar shape="square" size={40} />
          </Badge>
          <Badge status="error">
            <MUIAvatar shape="square" size={40} />
          </Badge>
          <Badge status="warning">
            <MUIAvatar shape="square" size={40} text='new' />
          </Badge>
        </div>
        <h3>图片徽标 满足个性化定制诉求</h3>
        <div style={{width: '130px', display: 'flex', justifyContent: 'space-between'}}>
          <Badge count={<ClockCircleOutlined style={{ color: '#f5222d' }} />} >
            <MUIAvatar shape="square" size={40} />
          </Badge>
          <Badge count={<img style={{width: '31px', height: '16px'}}
              src="https://i9.taou.com/maimai/p/25947/5921_53_42shFljzpneMJrh9" />} >
            <MUIAvatar shape="square" size={40} />
          </Badge>
        </div>
        <h3>独立使用</h3>
        <div style={{width: '140px', display: 'flex', justifyContent: 'space-between', lineHeight: '16px'}}>
          <span>文案文案</span>
          <Badge count={25} />
          <Badge count={109} style={{ backgroundColor: '#52c41a' }} />
        </div>
      </div>
    )
  }
}
```
