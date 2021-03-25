import React from 'react'
import * as R from 'ramda'
import { Text, Popover } from 'mm-ent-ui'

// 实名认证
export default function ProfessionalVerify(props) {
  const contactData = R.pathOr({}, ['data', 'contact_verify'], props)
  const {
    judge_mail: judgeEmail,
    files,
    file_type: fileType,
    official,
    uptime,
    user: { company, position } = {},
  } = contactData
  const { urlPrefix = '' } = props

  const fileTypeVerifyMap = {
    1: '名片认证（人工审核）',
    2: '在职证明认证（人工审核）',
    3: '营业执照认证（人工审核）',
    4: '工牌认证（人工审核）',
    5: '企业邮箱拍摄（人工审核）',
    25: '钉钉二维码名片认证（认证中）',
    26: '企业微信二维码名片认证（认证中）',
  }

  const getType = () => {
    if (fileType && fileTypeVerifyMap[fileType]) {
      return fileTypeVerifyMap[fileType]
    }

    if (official === 1) {
      return '担保认证'
    }

    if (judgeEmail === 1) {
      return '公司邮箱认证'
    }

    if (Array.isArray(files) && files.length) {
      return '资料认证'
    }

    return '线下审核'
  }

  const getContent = () => {
    return [
      <Text key="company" type="text_common" className="margin-top-4">
        {company}
      </Text>,
      <br key="sep1" />,
      <Text key="position" type="text_common" className="margin-top-4">
        {position}
      </Text>,
      <br key="sep2" />,
      <Text
        key="name"
        type="text_common"
        className="margin-top-4 margin-bottom-16"
      >
        {uptime || ''}通过
        {getType()}
      </Text>,
    ]
  }

  return (
    <Popover
      content={getContent()}
      title="职业身份认证"
      width="300px"
      placement="bottomLeft"
      getPopupContainer={props.getContainer}
    >
      <img
        src={`${urlPrefix}/images/icon_v_temperament.png`}
        alt="v职业认证"
        width="27px"
        height="12px"
        className={props.className || ''}
      />
    </Popover>
  )
}
