import React from 'react'
import Button from './../Button'
import styles from './index.less'

function Footer(props) {
  const emptyFunc = () => {}
  return (
    <div className={`${styles.footer} ${props.className}`}>
      <Button
        type="dilution"
        onClick={props.onCancel || emptyFunc}
        fontSize={14}
        {...props.cancelButtonProps}
      >
        {props.cancelText || '取消'}
      </Button>
      <Button
        type="primary"
        onClick={props.onOk || emptyFunc}
        fontSize={14}
        className="margin-left-24"
        {...props.okButtonProps}
      >
        {props.okText || '确定'}
      </Button>
    </div>
  )
}

export default Footer
