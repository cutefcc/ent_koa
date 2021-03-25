import React, { memo } from 'react'
import * as R from 'ramda'
import Avatar from 'componentsV2/Common/Avatar'
import PreviewButton from 'componentsV2/Common/RightButton/PreviewButton'
import { Icon, Button } from 'mm-ent-ui'
import { redirectToIm } from 'utils'
import styles from './CommonFriendsItem.less'

const bigAvatarStyle = {
  width: '40px',
  height: '40px',
  fontSize: '22px',
  lineHeight: '40px',
  borderRadius: '20px',
  cursor: 'pointer',
}
export default memo(({ data, onAvatarClick = () => {} }) => {
  const { list = [] } = data
  return (
    <div className={styles.commonFriends}>
      {list.map((item, index) => {
        return (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={`${item.name}${index}`}
            className={`flex ${styles.talentItem}`}
          >
            <PreviewButton
              data={item}
              key="previewButton"
              className="margin-right-5"
              iconType="preview"
            >
              <Avatar
                avatar={item.avatar}
                name={R.propOr('保密', 'name', item)}
                style={bigAvatarStyle}
                key="avatar"
                onClick={onAvatarClick}
              />
            </PreviewButton>
            <span className="flex-column space-between margin-left-16 flex-1">
              <span className="color-common">{item.name}</span>
              <span className="color-dilution">
                {`${item.company}·${item.position}`}
                {item.judge === 1 && (
                  <Icon
                    type="v"
                    className="color-orange2 margin-left-4 font-size-12"
                  />
                )}
              </span>
            </span>
            <span>
              <Button
                className="margin-right-5"
                onClick={() => redirectToIm(item.id)}
                type="button_m_fixed_ghost_blue450"
              >
                沟通
              </Button>
            </span>
          </span>
        )
      })}
    </div>
  )
})
