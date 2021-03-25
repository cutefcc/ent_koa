import React from 'react'

import ReactDOM from 'react-dom'

import styles from './index.less'

class Drawer extends React.PureComponent {
  handleModalHide = () => {
    const { onHide } = this.props
    onHide.apply(this.props)
  }

  render() {
    return (
      <div className={styles.Popup} id="Drawer">
        <div className={styles.bg} onClick={this.handleModalHide} />
        {this.props.dom}
      </div>
    )
  }
}

const createHost = () => {
  const $el = document.createElement('div')
  const clear = () => {
    ReactDOM.unmountComponentAtNode($el)
    $el.parentNode.removeChild($el)
  }
  document.body.appendChild($el)
  return {
    $el,
    dialog_hide: clear,
  }
}

Drawer.show = (props) => {
  const host = createHost(props)
  ReactDOM.render(<Drawer onHide={host.dialog_hide} {...props} />, host.$el)
}

Drawer.hide = (props) => {
  const host = createHost(props)
  host.dialog_hide(this.props, arguments)
}

export default Drawer
