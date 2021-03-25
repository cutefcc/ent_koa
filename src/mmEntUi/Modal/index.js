import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import ModalFooter from './../ModalFooter'
import styles from './index.less'

class MMModal extends React.PureComponent {
  render() {
    // const {type} = this.props
    const footer = <ModalFooter {...this.props} />
    const { noFooter } = this.props
    return (
      <Modal
        footer={noFooter ? null : footer}
        {...this.props}
        className={`${this.props.className} ${styles.modal}`}
      />
    )
  }
}

MMModal.confirm = (props) => {
  const { type = 'common', title } = props
  const mod = Modal.confirm({
    width: 450,
    ...props,
    title: (
      <div className="flex space-between">
        <span>{title}</span>
        <CloseOutlined
          onClick={() => {
            mod.destroy()
            if (props.onCancel) {
              props.onCancel()
            }
          }}
          className="color-dilution cursor-pointer"
        />
      </div>
    ),
    content: (
      <div>
        {props.content || ''}
        {type === 'common' && (
          <ModalFooter
            {...props}
            cancelButtonProps={{ ...props.cancelButtonProps, type: 'ghost' }}
            className="margin-top-32"
            onCancel={() => {
              mod.destroy()
              if (props.onCancel) {
                props.onCancel()
              }
            }}
            onOk={() => {
              mod.destroy()
              if (props.onOk) {
                props.onOk()
              }
            }}
          />
        )}
      </div>
    ),
    className: `${props.className} ${styles[`confirm-${type}`]}`,
  })
  return mod
}

MMModal.info = Modal.info
MMModal.success = Modal.success
MMModal.error = Modal.error
MMModal.warning = Modal.warning
MMModal.destroyAll = Modal.destroyAll
export default MMModal
