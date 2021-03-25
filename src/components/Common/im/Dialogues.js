import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { unixToStr, dateTimeFormat } from 'utils/date'
import { message } from 'antd'
import fileDownload from 'utils/fileDownload'
import { formatBytes } from 'utils/size'

import styles from './dialogues.less'

@connect()
export default class Dialogues extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    dialogUser: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    authInfo: PropTypes.object,
  }

  static defaultProps = {
    authInfo: {},
  }

  getCreateTime = (timestamp) => unixToStr(timestamp, dateTimeFormat)

  getFileImage = (fileName) => {
    const dotIndex = fileName.lastIndexOf('.')
    const ext = fileName.substr(dotIndex + 1, fileName.length)
    const imgMap = {
      pdf: 'file_type_pdf.png',
      doc: 'file_type_doc.png',
      docx: 'file_type_doc.png',
      txt: 'file_type_txt.png',
      ppt: 'file_type_ppt.png',
      pptx: 'file_type_ppt.png',
      xls: 'file_type_xls.png',
      xlsx: 'file_type_xls.png',
    }
    return `/ent/images/fileType/${R.propOr(
      'file_type_undefine.png',
      ext,
      imgMap
    )}`
  }

  getFileInfo = (item) => {
    try {
      return JSON.parse(item.extra)
    } catch (e) {
      return {}
    }
  }

  handleShowDetail = (item) => (e) => {
    window.open(`/ent/profile/${item.id}?source=im`)
    e.stopPropagation()
  }

  handleDownload = (fileInfo) => () => {
    this.props
      .dispatch({
        type: 'im/getFile',
        payload: {
          fn: fileInfo.name,
          file_id: fileInfo.file_id,
          ...this.props.authInfo,
        },
      })
      .then((data) => {
        const purl = R.propOr('', 'purl', data)
        if (!purl) {
          message.error('没有找到文件')
          return
        }
        fileDownload(purl, fileInfo.name)
      })
  }

  renderSystemMessage = (item) => {
    return (
      <div className={styles.systemMessage} key={item.id}>
        <span>{item.text}</span>
      </div>
    )
  }

  renderCard = ({ card = {} }) => {
    const data = R.path(['data', 0], card)
    return (
      <div className={styles.card}>
        <div className={styles.head}>
          <h4>{card.top}</h4>
          <span>{card.content}</span>
        </div>
        {data && (
          <div className={styles.content}>
            <img src={data.icon} className={styles.logo} alt="logo" />
            <div className={styles.brief}>
              <p>{data.line1}</p>
              <p>{data.line2}</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  renderCommonLayout = (content, item) => {
    const cl = item.is_me ? styles.commonMessageRight : styles.commonMessageLeft
    const user = item.is_me
      ? this.props.currentUser.ucard
      : this.props.dialogUser
    return (
      <div className={`${cl} ${styles.commonMessage}`}>
        <div
          className={`${styles.avatar}`}
          onClick={this.handleShowDetail(user)}
        >
          <img src={user.avatar} className={styles.avatar} alt="头像" />
        </div>
        <div className={styles.content}>
          <div className={styles.title}>
            <span className={styles.name}>{user.name}</span>
            <span className={styles.date}>
              {this.getCreateTime(item.crtimestamp)}
            </span>
          </div>
          {content}
        </div>
      </div>
    )
  }

  renderCommonMessage = (item) => {
    return this.renderCommonLayout(
      <div className={styles.msg}>{item.text}</div>,
      item
    )
  }

  renderFile = (item) => {
    const fileInfo = this.getFileInfo(item)
    if (R.isEmpty(fileInfo)) {
      return <div>{item.text}</div>
    }

    const content = (
      <div className={styles.file}>
        <img
          className={styles.image}
          src={this.getFileImage(fileInfo.name)}
          alt="file_type_icon"
        />
        <div className={styles.fileContent}>
          <div className={styles.fileName}>{fileInfo.name}</div>
          <div className={styles.fileInfo}>
            <div className="fl">{formatBytes(fileInfo.total_size, 2)}</div>
            <div
              className="fr color-blue cursor-pointer"
              onClick={this.handleDownload(fileInfo)}
            >
              下载
            </div>
          </div>
        </div>
      </div>
    )

    return this.renderCommonLayout(content, item)
  }

  renderItem = (item) => {
    const condition = R.cond([
      [R.propEq('type', 0), this.renderCommonMessage],
      [R.propEq('type', 95), this.renderCard],
      [R.propEq('type', 99), this.renderSystemMessage],
      [R.propEq('type', 4), this.renderFile],
    ])
    return condition(item)
  }

  renderList = () => {
    const { data } = this.props
    return data.map((item) => (
      <div className={styles.messageItem} key={item.id}>
        {this.renderItem(item)}
      </div>
    ))
  }

  render() {
    const { data } = this.props
    if (R.isEmpty(data)) {
      return <div>当前没有会话</div>
    }
    return <div>{this.renderList()}</div>
  }
}
