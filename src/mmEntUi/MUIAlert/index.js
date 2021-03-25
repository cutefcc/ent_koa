import React, { useState } from 'react'
import * as R from 'ramda'
import Icon from './../Icon'
import {
  CheckCircleFilled,
  InfoCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import styles from './index.less'

function MMAlert(props) {
  const {
    buttonWord = '',
    buttonType = 'main',
    closable,
    description,
    message,
    type = 'info',
    onClose,
    showIcon,
    style,
    handleClick,
    isTips,
  } = props

  const [visible, setVisible] = useState(true)

  const typeIcon = {
    success: <CheckCircleFilled className={styles.icon} />,
    info: <InfoCircleFilled className={styles.icon} />,
    error: <CloseCircleFilled className={styles.icon} />,
    warning: <ExclamationCircleFilled className={styles.icon} />,
    comment: <QuestionCircleOutlined className={styles.icon} />,
  }

  function handleClickLocal() {
    if (handleClick instanceof Function) {
      handleClick()
    }
  }

  function setVisibleClick() {
    setVisible(false)
    if (onClose instanceof Function) {
      onClose()
    }
  }

  if (isTips) {
    return (
      <span style={style} className={R.pathOr(null, [`tips_${type}`], styles)}>
        {R.pathOr(null, [type], typeIcon)}&nbsp;{message}
      </span>
    )
  }

  return (
    <div
      className={visible ? styles.alertContent : styles.alertContentNone}
      style={style}
    >
      <div className={R.pathOr(null, [type], styles)}>
        <div
          className={
            description
              ? styles.mainTopContentWithDescription
              : styles.mainTopContent
          }
        >
          {showIcon && R.pathOr(null, [type], typeIcon)}
          <div className={styles.mainContent}>
            <div className={styles.message}>{message}</div>
          </div>
          {buttonWord && buttonType === 'word' && (
            <div className={styles.wordStyle} onClick={handleClickLocal}>
              {buttonWord}
            </div>
          )}
          {buttonWord && buttonType === 'main' && (
            <div className={styles.mainBtnStyle} onClick={handleClickLocal}>
              {buttonWord}
            </div>
          )}
          {buttonWord && buttonType === 'second' && (
            <div className={styles.secondBtnStyle} onClick={handleClickLocal}>
              {buttonWord}
            </div>
          )}
          {closable && (
            <Icon
              type="close-outline"
              className={styles.closeIcon}
              onClick={setVisibleClick}
            />
          )}
        </div>
        {description && (
          <div
            className={
              showIcon ? styles.descriptionWithIcon : styles.description
            }
          >
            {description}
          </div>
        )}
      </div>
    </div>
  )
}

export default MMAlert
