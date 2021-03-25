---
imports:
  '{MUIAvatar}': 'mm-ent-ui'
  '{Badge}': 'antd'
---

## 何时使用

展示头像，或者公司 logo 的时候

## 引用方式

```render javascript
import {MUIAvatar} from 'mm-ent-ui'
```

## 代码演示

```render html
class AvatarDemo extends React.PureComponent {
  render() {
    const style={
      marginRight: '16px',
    }

    return (
      <div>
        <p>圆形/方形 图片头像（shape=circle or square）（size=24 32 40 48 64）</p>
        <div>
          <MUIAvatar shape="circle" size="24px" style={style} src="https://i9.taou.com/maimai/p/24804/9545_116_71p9bk1JhOxhpnVb-a160" />
          <MUIAvatar shape="circle" size="32px" style={style} src="https://i9.taou.com/maimai/p/24804/9545_116_71p9bk1JhOxhpnVb-a160" />
          <MUIAvatar shape="circle" size="40px" style={style} src="https://i9.taou.com/maimai/p/24804/9545_116_71p9bk1JhOxhpnVb-a160" />
          <MUIAvatar shape="circle" size="48px" style={style} src="https://i9.taou.com/maimai/p/24804/9545_116_71p9bk1JhOxhpnVb-a160" />
          <MUIAvatar shape="circle" size="64px" style={style} src="https://i9.taou.com/maimai/p/24804/9545_116_71p9bk1JhOxhpnVb-a160" />
          <MUIAvatar shape="square" size="24px" style={style} src="https://i9.taou.com/maimai/p/24804/9545_116_71p9bk1JhOxhpnVb-a160" />
          <MUIAvatar shape="square" size="32px" style={style} src="https://i9.taou.com/maimai/p/24804/9545_116_71p9bk1JhOxhpnVb-a160" />
          <MUIAvatar shape="square" size="40px" style={style} src="https://i9.taou.com/maimai/p/24804/9545_116_71p9bk1JhOxhpnVb-a160" />
          <MUIAvatar shape="square" size="48px" style={style} src="https://i9.taou.com/maimai/p/24804/9545_116_71p9bk1JhOxhpnVb-a160" />
          <MUIAvatar shape="square" size="64px" style={style} src="https://i9.taou.com/maimai/p/24804/9545_116_71p9bk1JhOxhpnVb-a160" />
        </div>
        <p>圆形/方形 字符头像（str）（size=24 32 40 48 64）可以通过style 设置字符颜色和背景颜色</p>
        <div>
          <MUIAvatar shape="circle" size="24px" str="H" style={{color: "#f00", background: "#ccc", marginRight: '16px'}} />
          <MUIAvatar shape="circle" size="32px" str="H" style={{color: "#0f0", background: "#bbb", marginRight: '16px'}} />
          <MUIAvatar shape="circle" size="40px" str="H" style={{color: "#00f", background: "#aaa", marginRight: '16px'}} />
          <MUIAvatar shape="circle" size="48px" str="H" style={{color: "#000", background: "#999", marginRight: '16px'}} />
          <MUIAvatar shape="circle" size="64px" str="H" style={{color: "#ff0", background: "#888", marginRight: '16px'}} />
          <MUIAvatar shape="square" size="24px" str="H" style={{color: "#f00", background: "#ccc", marginRight: '16px'}} />
          <MUIAvatar shape="square" size="32px" str="H" style={{color: "#0f0", background: "#bbb", marginRight: '16px'}} />
          <MUIAvatar shape="square" size="40px" str="H" style={{color: "#00f", background: "#aaa", marginRight: '16px'}} />
          <MUIAvatar shape="square" size="48px" str="H" style={{color: "#000", background: "#999", marginRight: '16px'}} />
          <MUIAvatar shape="square" size="64px" str="H" style={{color: "#ff0", background: "#888", marginRight: '16px'}} />
        </div>
        <p>圆形/方形 图标头像（iconType）（size=24 32 40 48 64）可以通过style 设置字符颜色和背景颜色</p>
        <div>
          <MUIAvatar shape="circle" size="24px" iconType="edit" style={{color: "#f00", background: "#ccc", marginRight: "16px"}} />
          <MUIAvatar shape="circle" size="32px" iconType="edit" style={{color: "#0f0", background: "#bbb", marginRight: "16px"}} />
          <MUIAvatar shape="circle" size="40px" iconType="edit" style={{color: "#00f", background: "#aaa", marginRight: "16px"}} />
          <MUIAvatar shape="circle" size="48px" iconType="edit" style={{color: "#000", background: "#999", marginRight: "16px"}} />
          <MUIAvatar shape="circle" size="64px" iconType="edit" style={{color: "#ff0", background: "#888", marginRight: "16px"}} />
          <MUIAvatar shape="square" size="24px" iconType="edit" style={{color: "#f00", background: "#ccc", marginRight: "16px"}} />
          <MUIAvatar shape="square" size="32px" iconType="edit" style={{color: "#0f0", background: "#bbb", marginRight: "16px"}} />
          <MUIAvatar shape="square" size="40px" iconType="edit" style={{color: "#00f", background: "#aaa", marginRight: "16px"}} />
          <MUIAvatar shape="square" size="48px" iconType="edit" style={{color: "#000", background: "#999", marginRight: "16px"}} />
          <MUIAvatar shape="square" size="64px" iconType="edit" style={{color: "#ff0", background: "#888", marginRight: "16px"}} />
        </div>
      </div>
    )
  }
}
```

## 展示规则

优先级 src > str > iconType , 也就是 图片 > 字符 > 图标

## 属性

| 属性  | 说明       | 类型             | 默认值   |
| ----- | ---------- | ---------------- | -------- |
| src   | 头像链接   | string           | 空字符串 |
| shape | 头像形状   | circle 或 square | circle   |
| size  | 头像的大小 | string 如 40px   | 40px     |
