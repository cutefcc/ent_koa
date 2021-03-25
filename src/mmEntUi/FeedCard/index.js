import React from 'react'
import { isEmpty } from 'utils'
import PreviewButton from 'componentsV2/Common/RightButton/PreviewButton'
import Avatar from './../Avatar'
import Text from './../Text'
import styles from './index.less'

function FeedCard(props) {
  const {
    data = null,
    hideUser = false,
    logoProps = {},
    onClick,
    line1,
    user_msg,
    line2,
    line3,
    line4,
    line_time,
    line5,
    className = '',
    ...otherProp
  } = props
  return (
    <div
      onClick={onClick}
      className={`${styles.card} ${className}`}
      {...otherProp}
    >
      {data ? (
        <PreviewButton showDetail={false} data={data}>
          <Avatar
            size="40px"
            shape="square"
            {...logoProps}
            style={
              logoProps.onClick
                ? { cursor: 'pointer', ...logoProps.styles }
                : { ...logoProps.styles }
            }
          />
        </PreviewButton>
      ) : !hideUser ? (
        <Avatar
          size="40px"
          shape="square"
          {...logoProps}
          style={
            logoProps.onClick
              ? { cursor: 'pointer', ...logoProps.styles }
              : { ...logoProps.styles }
          }
        />
      ) : null}
      <dl>
        {!isEmpty(line1) && <dt className={styles.line1}>{line1}</dt>}
        {!isEmpty(user_msg) && <dt className={styles.line1}>{user_msg}</dt>}
        {!isEmpty(line2) && <dt className={styles.line2}>{line2}</dt>}
        {!isEmpty(line3) && (
          <dt className={styles.line3} style={{ marginTop: '6px' }}>
            <Text
              type="text_common"
              size={14}
              spreadProps={{
                maxLine: 5,
                lineHeight: 21,
              }}
              style={{ width: '100%' }}
            >
              {line3}
            </Text>
          </dt>
        )}
        {!isEmpty(line4) && <dt className={styles.line4}>{line4}</dt>}
        {!isEmpty(line_time) && (
          <dt className={styles.line_time}>{line_time}</dt>
        )}
        {!isEmpty(line5) && <dt className={styles.line5}>{line5}</dt>}
      </dl>
    </div>
  )
}

export default FeedCard
