import React from 'react'
import { Text, Popover } from 'mm-ent-ui'
import * as R from 'ramda'

// 实名认证
export default function IdentityVerify(props) {
  const {
    identification_time: time,
    identification_type: type,
    realname = '',
  } = props.verifyStatus
  const { urlPrefix = '' } = props

  const typeMap = {
    1: '身份证认证', // 通过了身份证号姓名比对, 通过了人脸识别
    2: '身份证认证', // 身份证号与姓名相符 身份证正反面照片通过了人工审核
    29: '身份证认证', // 上传身份证照片通过了人工审核
    30: '护照认证', // 上传护照照片通过了人工审核
  }

  const verifyTime =
    time && time !== '0000-00-00 00:00:00' ? time.substr(0, 10) : ''

  const verifyType = R.propOr('身份证认证', type, typeMap)

  const getContent = () => {
    const name = R.range(1, realname.length).map(R.always('*')).join('')
    return [
      <Text key="name" type="text_common">
        {realname.substr(0, 1)}
        {name}
      </Text>,
      <br key="sep" />,
      <Text
        key="type"
        type="text_common"
        className="margin-top-4 margin-bottom-16"
      >
        {`${verifyTime}通过${verifyType}`}
      </Text>,
    ]
  }

  return (
    <Popover
      content={getContent()}
      title="实名认证"
      getPopupContainer={props.getContainer}
      placement="bottomLeft"
    >
      <img
        src={`${urlPrefix}/images/icon_v_realname.png`}
        alt="实名认证"
        width="27px"
        height="12px"
      />
    </Popover>
  )
}
