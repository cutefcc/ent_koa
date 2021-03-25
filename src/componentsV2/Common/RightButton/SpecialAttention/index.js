import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { getModuleName } from 'utils'
import * as R from 'ramda'
import { Icon, Message } from 'mm-ent-ui'
import { Tooltip } from 'antd'

function SpecialAttention(props) {
  // type: false 表示没有特别关注，true 表示已经特别关注
  const {
    type,
    isShow = false,
    id: toUid = '',
    dispatch,
    onSpecialAttentionSuccess = () => {},
  } = props
  const [attentionType, setAttentionType] = useState(type)

  useEffect(() => {
    setAttentionType(type)
  }, [type])

  const handleIconClick = () => {
    dispatch({
      type: attentionType
        ? 'talentDiscover/closeSpecialAttention'
        : 'talentDiscover/openSpecialAttention',
      payload: { to_uid: toUid },
    }).then((res) => {
      const { code = 0, msg = '' } = res
      if (code === 0) {
        setAttentionType(!attentionType)
        // 修改 is_special_attention
        const oldList = R.pathOr([], [`${getModuleName()}TalentList`], props)
        const currItem = oldList.filter((item) => item.id === toUid)
        if (currItem.length === 1) {
          currItem[0].is_special_attention = attentionType ? 0 : 1
        }

        const oldDynamic = R.pathOr({}, [`${getModuleName()}Dynamic`], props)
        const oldDynamicList = R.pathOr([], [`list`], oldDynamic)
        const currDynamicItem = oldDynamicList.filter(
          (item) => item.talent.id === toUid
        )
        if (currDynamicItem.length === 1) {
          currDynamicItem[0].talent.is_special_attention = attentionType ? 0 : 1
        }

        // 修改对应列表list
        dispatch({
          type: `${getModuleName()}/setTalentList`,
          payload: [...oldList],
        })
        dispatch({
          type: `${getModuleName()}/setDynamic`,
          payload: { ...oldDynamic },
        })
        // 为了关闭profile再次打开时 显示正常
        onSpecialAttentionSuccess()
      } else {
        Message.warning(msg)
      }
    })
  }

  return isShow ? (
    <div style={{ marginRight: '16px' }}>
      <Tooltip
        getPopupContainer={(trigger) => trigger.parentElement}
        title={attentionType ? '已设为特别关注' : '点击设为特别关注'}
      >
        <div style={{ width: '32px', height: '32px' }}>
          <Icon
            type={attentionType ? 'yitebieguanzhu' : 'tebieguanzhu11'}
            style={{ fontSize: '32px' }}
            onClick={handleIconClick}
          />
        </div>
      </Tooltip>
    </div>
  ) : null
}

export default connect((state, dispatch) => ({
  dispatch,
  groupsTalentList: state.groups.talentList,
  talentDiscoverTalentList: state.talentDiscover.talentList,
  subscribeTalentList: state.subscribe.talentList,
  groupsDynamic: state.groups.dynamic,
  talentDiscoverDynamic: state.talentDiscover.dynamic,
  subscribeDynamic: state.subscribe.dynamic,
}))(SpecialAttention)
