import React from 'react'

const styles = {
  panel: {
    padding: '10px',
    // position: 'absolute',
    backgroundColor: 'white',
    zIndex: 10000,
  },

  face_container: {
    overflow: 'hidden',
    width: '436px',
    height: '204px',
    backgroundImage:
      'url(https://i9.taou.com/maimai/p/24090/4329_53_2IDxuQTZVN6lzp)',
    backgroundPosition: 'no-repeat center',
    backgroundSize: 'cover',
  },

  face: {
    float: 'left',
    width: '29px',
    height: '29px',
    fontSize: '0',
    textIndent: '-999em',
    cursor: 'pointer',
  },
}

const emojiNames = [
  '[微笑]',
  '[坏笑]',
  '[哈哈]',
  '[捂嘴]',
  '[害羞]',
  '[鼓掌]',
  '[挖鼻屎]',
  '[可怜]',
  '[卖萌]',
  '[做鬼脸]',
  '[吐血]',
  '[冷汗]',
  '[吃惊]',
  '[尴尬]',
  '[闭嘴]',
  '[瞌睡]',
  '[笑哭]',
  '[撇嘴]',
  '[白眼]',
  '[得意]',
  '[鄙视]',
  '[敲打]',
  '[疑问]',
  '[亲亲]',
  '[流泪]',
  '[瞪眼]',
  '[酷]',
  '[晕]',
  '[吐]',
  '[抓狂]',
  '[不开心]',
  '[ByeBye]',
  '[色]',
  '[嘘]',
  '[发财]',
  '[玫瑰]',
  '[凋谢]',
  '[发怒]',
  '[囧]',
  '[抱抱]',
  '[吃瓜]',
  '[打脸]',
  '[奸笑]',
  '[Yeah]',
  '[惊恐]',
  '[生病]',
  '[皱眉]',
  '[机智]',
  '[吓]',
  '[困]',
  '[丢脸]',
  '[捂脸]',
  '[牛逼]',
  '[offer]',
  '[还招人吗]',
  '[喝酒]',
  '[真相了]',
  '[膜拜]',
  '[秃头]',
  '[福报]',
  '[柠檬]',
  '[啤酒]',
  '[狗]',
  '[猿]',
  '[鸡]',
  '[猪]',
  '[牛]',
  '[mark]',
  '[奋斗]',
  '[OK]',
  '[握手]',
  '[抱拳]',
  '[耶]',
  '[赞]',
  '[弱]',
  '[比心]',
  '[勾引]',
  '[爱心]',
  '[心碎]',
  '[太阳]',
  '[月亮]',
  '[便便]',
  '[灯泡]',
  '[蛋糕]',
  '[碰杯]',
  '[炸弹]',
  '[咖啡]',
  '[沙发]',
  '[钱]',
  '[衰]',
  '[骷髅]',
  '[跪]',
  '[沾喜气]',
  '[滋你一身]',
  '[抱大腿]',
  '[狗头]',
]

export default class emojiPanel extends React.Component {
  onSelect = (e) => {
    this.props.onSelect(e.target.title)
  }

  render() {
    const position = this.props.position || {}

    const panelStyle = {
      ...styles.panel,
      ...position,
    }

    return (
      <div style={panelStyle}>
        <div style={styles.face_container}>
          {emojiNames.map((name) => {
            return (
              <span
                key={name}
                onClick={this.onSelect}
                style={styles.face}
                title={name}
              >
                {name}
              </span>
            )
          })}
        </div>
      </div>
    )
  }
}
