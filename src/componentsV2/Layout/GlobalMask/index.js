import { connect } from 'react-redux'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Popconfirm } from 'antd'
import { withRouter } from 'react-router-dom'
import styles from './index.less'
import React, { useState, useRef } from 'react'

const GlobalMask = withRouter(({ maskConfig }) => {
  const { visible = true, type = 'resume' } = maskConfig
  const storageName = `global-mask-show-${type}`
  const ifShowTipsByLocal = localStorage.getItem(storageName) !== '0'
  const buttons = document.getElementsByClassName('resume-download-button')
  const [maskVisible, setMaskVisible] = useState(false)
  const maskVisibleRef = useRef(true)
  maskVisibleRef.current = true

  const renderResumePop = (style) => {
    return (
      <Popconfirm
        overlayClassName="global-mask"
        icon={<InfoCircleOutlined style={{ color: '#3B7AFF' }} />}
        visible={true}
        title={
          <div>
            新权益上线！解锁人才附件简历，
            <br />
            及时掌握最新动向。
          </div>
        }
        cancelText=""
        okText="我知道了"
        onConfirm={onClick}
      >
        <div style={style}></div>
      </Popconfirm>
    )
  }

  const renderChildren = (type, style) => {
    let childrenView = null
    switch (type) {
      case 'resume':
        childrenView = renderResumePop(style)
        break
      default:
        childrenView = null
        break
    }

    return childrenView
  }

  if (visible && !maskVisible) {
    let count = 0
    const timer = setInterval(() => {
      if (buttons.length || count >= 100) {
        count++
        setMaskVisible(maskVisibleRef.current)
        clearInterval(timer)
      }
    }, 100)
  }

  if (!maskVisible || !ifShowTipsByLocal || !buttons.length) return null

  const button = buttons[0]
  const { x, y, width } = button.getBoundingClientRect()
  const style = { left: x + width / 2, top: y, position: 'absolute' }

  const onClick = () => {
    localStorage.setItem('global-mask-show-resume', 0)
    setMaskVisible(false)
  }

  return (
    <div className={styles.mask} onClick={onClick}>
      {renderChildren(type, style)}
    </div>
  )
})

export default connect((state) => ({
  maskConfig: state.global.maskConfig,
}))(GlobalMask)
