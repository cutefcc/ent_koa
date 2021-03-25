import React, { PureComponent } from 'react'
import Text from './../Text'
import Icon from './../Icon'
import styles from './index.less'

export default class UploadImg extends PureComponent {
  state = {}

  render() {
    const { loadImg, imgSrc, width = '200px', height = '112px' } = this.props
    return (
      <div className={styles.uploadImgCon} style={{ width, height }}>
        {!loadImg && (
          <input
            className={styles.uploadImgConInput}
            id="upload-input"
            type="file"
            accept=".jpg,.png,.jpeg,.gif"
            onChange={() => {
              this.props.onUploadChange(this.uploadLoad)
            }}
            ref={(node) => {
              this.uploadLoad = node
            }}
          />
        )}
        {!loadImg && (
          <div className={styles.uploadImgConDiv} style={{ width, height }}>
            <Text type="text_primary" size={12} style={{ color: '#999' }}>
              选择图片
            </Text>
          </div>
        )}
        {loadImg && imgSrc && (
          <div style={{ ...{ width, height, position: 'relative' } }}>
            <img
              alt="s"
              src={imgSrc}
              style={{ display: 'block', ...{ width, height } }}
            />
            <Icon
              type="close-outline"
              style={{ position: 'absolute', top: '-15px', right: '0' }}
              onClick={this.props.onCancleImg}
            />
          </div>
        )}
      </div>
    )
  }
}
