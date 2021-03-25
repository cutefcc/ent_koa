import React from 'react'
// import * as R from 'ramda'
import styles from './index.less'

export default class FeedMultiImg extends React.PureComponent {
  contrainWidth = (width, height, maxWidth) => {
    if (width <= maxWidth) {
      return {
        width: parseInt(width, 10),
        height: parseInt(height, 10),
      }
    }
    const ratio = maxWidth / width
    return {
      width: parseInt(maxWidth, 10),
      height: parseInt(height * ratio, 10),
    }
  }

  renderImg = (img) => {
    const { multiImgSize = 80 } = this.props
    return (
      <img
        key={img.turl}
        src={img.turl}
        className={styles.multiImg}
        style={{
          width: `${multiImgSize}px`,
          height: `${multiImgSize}px`,
          objectFit: 'cover',
        }}
        alt="img"
      />
    )
  }

  renderMultiImg = (pics) => {
    return pics.map(this.renderImg)
  }

  renderSingleImg = (pics) => {
    const pic = pics[0]
    const size = this.contrainWidth(pic.tx / 2, pic.ty / 2, 200)

    const style = {
      width: `${size.width}px`,
      height: `${size.height}px`,
    }

    return (
      <img
        key={pic.turl}
        className={styles.singleImg}
        src={pic.turl}
        style={style}
        alt="img"
      />
    )
  }

  render() {
    const { pics = [] } = this.props
    const picCount = pics.length

    return (
      <div className={styles.main}>
        {this.renderMultiImg(pics)}
        {/* {picCount === 1
          ? this.renderSingleImg(pics)
          : this.renderMultiImg(pics)} */}
      </div>
    )
  }
}
