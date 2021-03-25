import React from 'react'
import { Modal } from 'antd'
import styles from './index.less'

class MUIModal extends React.PureComponent {
  state = {
    contentHeight: '0px',
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize = () => {
    const contentHeight =
      document.documentElement.clientHeight -
      128 -
      56 -
      48 -
      (this.props.footer ? 56 : 0)
    this.setState({
      contentHeight: `${contentHeight}px`,
    })
  }

  render() {
    const {
      width = 560,
      footer,
      height,
      type = 'nomal',
      noHeaderBorder = false,
    } = this.props
    const style = {}
    // type === 'nomal' ? { minHeight: footer ? '240px' : '296px' } : {}
    style.paddingRight = '24px'
    if (height === 'auto') {
      style.overflow = 'auto'
      style.height = this.state.contentHeight
    } else if (height) {
      style.height = `${height - 56 - 48 - (footer ? 56 : 0)}px`
      style.overflow = 'auto'
    }

    return (
      <Modal
        footer={footer || null}
        {...this.props}
        width={width}
        className={`${this.props.className} ${styles.modal} ${
          type === 'notice' ? styles.notice : ''
        } ${noHeaderBorder ? styles.noHeaderBorder : ''}`}
      >
        <div style={style}>{this.props.children}</div>
      </Modal>
    )
  }
}

MUIModal.info = Modal.info
MUIModal.success = Modal.success
MUIModal.error = Modal.error
MUIModal.warning = Modal.warning
MUIModal.destroyAll = Modal.destroyAll
export default MUIModal
