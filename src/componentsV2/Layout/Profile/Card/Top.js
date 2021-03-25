import React from 'react'
import { Text, Button } from 'mm-ent-ui'
import { compact, checkIsTrial } from 'utils'
import Highlighter from 'react-highlight-words'
import * as R from 'ramda'

import IdentityVerify from 'componentsV2/Common/IdentityVerify'
import ProfessionalVerify from 'componentsV2/Common/ProfessionalVerify'
import AiCallButton from 'componentsV2/Common/RightButton/AiCallButton'
import DirectContactButton from 'componentsV2/Common/RightButton/DirectContactButton'
import DirectChatButton from 'componentsV2/Common/RightButton/DirectChatButton'
import SpecialAttention from 'componentsV2/Common/RightButton/SpecialAttention'

export default function Top(props) {
  const {
    data = {},
    urlPrefix,
    trackParam,
    getWrapperDom,
    onTrial = () => {},
    onSpecialAttentionSuccess = () => {},
    isV3 = false,
    highLight = [],
  } = props

  const renderProfessionalVerify = () => {
    return (
      <ProfessionalVerify
        data={data}
        getContainer={getWrapperDom}
        className="margin-right-8"
        urlPrefix={urlPrefix}
      />
    )
  }

  const renderIdentityVerify = () => {
    return (
      <IdentityVerify
        verifyStatus={data.verify_status || {}}
        getContainer={getWrapperDom}
        urlPrefix={urlPrefix}
      />
    )
  }

  const renderTrialButton = ({ title, ...restProps }) => {
    return (
      <Button {...restProps} onClick={onTrial}>
        {title}
      </Button>
    )
  }

  const isTrial = checkIsTrial()
  // eslint-disable-next-line no-shadow
  const renderButtons = (data) => {
    const isTalentBankStable = R.pathOr(
      false,
      ['auth', 'isTalentBankStable'],
      props
    )
    if (isTrial) {
      return [
        renderTrialButton({
          title: '索要电话',
          type: 'primary-2',
          className: 'margin-right-16',
          key: 'aiCall',
        }),
        renderTrialButton({
          title: data.direct_contact_st === 1 || isV3 ? '立即沟通' : '极速联系',
          type: 'primary',
          key: 'contact',
        }),
      ]
    }
    let chatFr // 立即沟通fr
    let aiCallFr // 拨打电话fr
    if (R.pathOr('', ['trackParam', 'type'], props) === 'canchat') {
      chatFr = 'jobInteractionsAcceptTalksForPc'
      aiCallFr = 'jobInteractionsAcceptTalksForPc'
    } else if (R.pathOr('', ['trackParam', 'type'], props) === 'visitor') {
      chatFr = 'jobInteractionsVisitorsForPc'
      aiCallFr = 'jobInteractionsVisitorsForPc'
    } else if (
      R.pathOr('', ['trackParam', 'type'], props) === 'recruit-resumes'
    ) {
      chatFr = 'resume_list_pc'
      aiCallFr = R.pathOr('', ['fr'], props)
    } else if (R.pathOr('', ['trackParam', 'type'], props) === 'recommend') {
      aiCallFr = 'jobInteractionsRecommendForPc'
    } else {
      aiCallFr = R.pathOr('', ['fr'], props)
    }
    return [
      isTalentBankStable ? (
        <SpecialAttention
          key="specialAttention"
          isShow
          type={data.is_special_attention === 1}
          id={data.id}
          onSpecialAttentionSuccess={onSpecialAttentionSuccess}
        />
      ) : null,
      <AiCallButton
        key="aiCall"
        data={data}
        trackParam={trackParam}
        className="margin-right-16"
        type="primary"
        fr={aiCallFr}
        wrapperDom={getWrapperDom()}
      />,
      data.direct_contact_st === 1 || isV3 ? (
        <DirectContactButton
          key="DirectContactButton"
          talents={[data]}
          trackParam={trackParam}
          buttonText="立即沟通"
          type="primary"
          fr={chatFr}
        />
      ) : (
        <DirectChatButton
          key="DirectChatButton"
          talents={[data]}
          buttonText="极速联系"
          disabled={data.is_direct_im === 1}
          trackParam={trackParam}
          type="primary"
        />
      ),
    ]
  }

  return (
    <div className="flex">
      <div className="flex-1 overflow-hidden">
        <Text type="title" size={18}>
          {data.name}
        </Text>
        <Text type="text_week" size={12} className="margin-left-8">
          {data.active_state || ''}
          {data.active_state === '在线' || !data.active_state ? '' : '来过'}
        </Text>
        <br />
        <span className="margin-top-2 flex flex-nowrap flex-align-center">
          <Text type="title" size={14} className="margin-right-8 ellipsis">
            <Highlighter
              highlightClassName="search_high_light"
              searchWords={highLight}
              autoEscape
              textToHighlight={
                compact([data.company, data.position]).join('·') ||
                '没有填写职位信息'
              }
            />
          </Text>
          {R.path(['judge'], data) === 1 && renderProfessionalVerify()}
          {R.path(['verify_status', 'identification_status'], data) === 3 &&
            renderIdentityVerify()}
        </span>
      </div>
      <div className="flex flex-nowrap margin-left-8">
        {renderButtons(data)}
      </div>
    </div>
  )
}
