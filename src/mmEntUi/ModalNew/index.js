import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import ModalFooter from './../ModalFooter'
import './index.less'

class MMModal extends React.PureComponent {
  render() {
    // const {type} = this.props
    const footer = <ModalFooter {...this.props} />
    return (
      <Modal
        footer={footer}
        width={480}
        {...this.props}
        className={`${this.props.className} mm-modal`}
      />
    )
  }
}

MMModal.confirm = (props) => {
  const { type = 'common', title } = props
  const mod = Modal.confirm({
    width: 360,
    ...props,
    title: (
      <div className="mm-modal-confirm-title">
        <span>{title}</span>
        <CloseOutlined
          onClick={() => {
            mod.destroy()
            if (props.onCancel) {
              props.onCancel()
            }
          }}
          className="mm-modal-confirm-title-close"
        />
      </div>
    ),
    content: (
      <div>
        {props.content || ''}
        <ModalFooter
          {...props}
          cancelButtonProps={{
            ...props.cancelButtonProps,
            type: 'ghost',
          }}
          onCancel={() => {
            mod.destroy()
            if (props.onCancel) {
              props.onCancel()
            }
          }}
          className="mm-modal-confirm-footer"
          onOk={() => {
            mod.destroy()
            if (props.onCancel) {
              props.onOk()
            }
          }}
        />
      </div>
    ),
    className: `${props.className} mm-modal-confirm mm-modal-confirm-${type}`,
    footer: null,
  })
  return mod
}

MMModal.info = Modal.info
MMModal.success = Modal.success
MMModal.error = Modal.error
MMModal.warning = Modal.warning
MMModal.destroyAll = Modal.destroyAll
export default MMModal
