import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import classnames from 'classnames'
import * as QRCode from 'qrcode-react'
import * as logoImgUrl from 'images/app_logo.png'
import { Loading } from 'mm-ent-ui'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Spin } from 'antd'
import * as styles from './index.less'

export interface Props {
  data: object
}

export default class PreCheckErr extends React.Component<Props> {
  noticePreCheckError = () => {
    const { error_code, error_msg } = this.props.data
    let preCheckErr = {}
    if (error_code == -4019 || error_code === -4015) {
      let text =
        error_code === -4019
          ? '商务版会员每月只能发布20个职位\n开通职场招聘会员，无限职位任你发'
          : '非会员每月只能发布5个职位\n开通职场招聘会员，无限职位任你发'

      preCheckErr = {
        type: 'member',
        title: '职位发布量已达上限',
        text,
      }
    } else if (error_code === -4010) {
      preCheckErr = {
        type: 'verify',
        title: '未通过招聘者身份认证',
        text: '需要您通过招聘者身份审核后才可发布职位',
      }
    } else if (error_code === -4009) {
      preCheckErr = {
        type: 'resumes',
        title: '简历处理率过低',
        text: '请先处理已收到的简历',
      }
    } else if (error_code === -4022) {
      preCheckErr = {
        type: 'common',
        title: '职位发布量已达上限',
        text: '每日最多发布50个职位',
      }
    } else if (!error_code) {
      preCheckErr = {}
    } else {
      preCheckErr = {
        type: 'common',
        title: error_msg,
      }
    }
    return preCheckErr
  }

  render() {
    const { type, title, text } = this.noticePreCheckError()
    return (
      <div className={styles.preCheckErr}>
        {!type ? <Spin indicator={<Loading />} /> : null}
        {title ? <p className={styles.title}>{title}</p> : null}
        {text ? <p className={styles.text}>{text}</p> : null}
        {type === 'member' ? (
          <div className={styles.qrCode}>
            <QRCode
              value="https://maimai.cn/uh_memlist?fr=pc_publish_job"
              logo={logoImgUrl}
              size={160}
              logoWidth={50}
            />
            <p>
              请打开<span style={{ color: '#fb6b58' }}>脉脉APP</span>
              用“消息”右上角扫一扫开通会员
            </p>
          </div>
        ) : null}
        {type === 'verify' ? (
          <div className={styles.qrCode}>
            <QRCode
              value="http://maimai.cn/bizjobs/auth_redirect"
              logo={logoImgUrl}
              size={160}
              logoWidth={50}
            />
            <p>
              请打开<span style={{ color: '#fb6b58' }}>脉脉APP</span>
              用“消息”右上角扫一扫完成认证
            </p>
          </div>
        ) : null}
      </div>
    )
  }
}
