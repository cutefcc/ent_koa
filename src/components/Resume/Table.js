import React from 'react'
import { connect } from 'react-redux'
import { Pagination, Button, message, Modal } from 'antd'
import * as R from 'ramda'
import { TRACKEVENTNAMEMAP } from 'constants/resume'

import styles from './Table.less'
import ResumeCard from './ResumeCard'

@connect((state) => ({
  jobs: state.global.jobs,
}))
export default class Table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      resumeData: this.props.resumeData,
      headerCount: this.props.headerCount,
      query: this.props.query,
      current: this.props.query.page || 1,
      visible: false,
      popupText: '',
      electionArr: [],
      ptype: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      resumeData: nextProps.resumeData,
      headerCount: nextProps.headerCount,
      query: nextProps.query,
    })
  }

  /** 分页事件* */
  handleOnChange = (page) => {
    this.props.clickCallback({ page })
  }

  resumeCardCallBack = (value, index) => {
    const { resumeData } = this.state
    if (value === 'pingAct') {
      this.props.clickCallback('pingAct')
    } else if (value && (index || index === 0)) {
      resumeData[index] = value
      this.setState({ resumeData })
    } else {
      this.props.clickCallback()
    }
  }

  /** 初始化分页总数* */
  initTotal = () => {
    const { headerCount, query } = this.state
    const { tp = 0 } = query
    const opObj = {
      0: 'pending_count',
      1: 'interest_count',
      2: 'notprop_count',
      3: 'reserve_talent_cnt',
    }
    const type = opObj[tp]
    return type ? headerCount[type] : 0
  }

  // 全选
  handleAllElection = () => {
    const { resumeData } = this.state
    let allElectionType = false
    let selectionCount = 0
    resumeData.map((v) => {
      if (v.type) {
        selectionCount += 1
      }
      if (!v.type) {
        allElectionType = true
      }
      return v
    })
    if (allElectionType) {
      resumeData.map((v) => {
        const value = v
        value.type = true
        return value
      })
      this.setState({ resumeData })
    } else if (selectionCount === resumeData.length) {
      resumeData.map((v) => {
        const value = v
        value.type = false
        return value
      })
      this.setState({ resumeData })
    }
  }

  trackEvent = (eventName, trackParam = {}) => {
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        ...this.props.trackParam,
        ...trackParam,
      }
      window.voyager.trackEvent(eventName, eventName, param)
    }
  }

  // 批量点击打点
  handleBatchEvent = (type, eventType, param) => {
    const key = R.propOr('', 'event', TRACKEVENTNAMEMAP[type])
    this.trackEvent(`${key}${eventType}`, { param })
  }

  handleShowBatchResume = (ptype) => {
    const { resumeData } = this.state
    const electionArr = []
    resumeData.map((v) => {
      if (v.type) {
        electionArr.push({ uid2: v.uid, ejid: v.ejid })
      }
      return v
    })

    this.handleBatchEvent(ptype, 'click', electionArr)

    const objType = {
      2: '不合适',
      1: '待沟通',
      9: '储备人才',
    }

    const popupText = `确定将${electionArr.length}位候选人标记为${objType[ptype]}?`
    this.setState({
      visible: true,
      popupText,
      electionArr,
      ptype,
    })
  }

  handleBatchResume = () => {
    const { ptype, electionArr } = this.state
    this.handleBatchEvent(ptype, 'confirm', electionArr)

    const param = {
      infos: JSON.stringify({
        data: electionArr,
      }),
    }

    this.props
      .dispatch({
        type: 'resumes/multiProcess',
        payload: {
          ptype,
          ...param,
        },
      })
      .then((res) => {
        if (res.result === 'ok') {
          message.success('操作成功')
          this.handleBatchEvent(ptype, 'success', electionArr)
          this.props.clickCallback()
          this.setState({ visible: false })
        }
      })
  }

  // 隐藏不合适弹窗
  hideModal = () => {
    this.setState({ visible: false })
  }

  handleOk = () => {
    this.handleBatchResume()
  }

  renderHeader = () => {
    const { resumeData, query } = this.state
    const { tp } = query
    let selectionCount = 0
    resumeData.map((v) => {
      if (v.type) {
        selectionCount += 1
      }
      return v
    })
    return (
      <div>
        {selectionCount === 0 ? (
          <div className={styles.headerMain}>
            <div>
              {query.tp !== 2 && (
                <div
                  className={styles.allElection}
                  style={{ display: 'inline-block' }}
                  onClick={this.handleAllElection}
                >
                  <img
                    alt="empty"
                    src="https://i9.taou.com/maimai/p/20614/6595_103_4J3oTaHhkoUpIJ"
                  />
                </div>
              )}
              <span style={{ paddingLeft: '20px' }}>基本信息</span>
            </div>
            <div>投递职位</div>
            <div>简历</div>
            <div>操作</div>
          </div>
        ) : (
          <div className={styles.headerMain}>
            <div style={{ width: 'auto' }}>
              <div
                className={styles.allElection}
                style={{
                  display: 'inline-block',
                  margin: '0 10px 0 16px',
                  width: 'auto',
                }}
                onClick={this.handleAllElection}
              >
                <img
                  alt="empty"
                  src={
                    selectionCount === resumeData.length
                      ? 'https://i9.taou.com/maimai/p/20981/5847_103_6fphchM2oYhi97'
                      : 'https://i9.taou.com/maimai/p/20614/6595_103_4J3oTaHhkoUpIJ'
                  }
                />
              </div>
              已选{selectionCount}人
            </div>
            <div className={styles.buttons} style={{ float: 'right' }}>
              <Button
                onClick={() => {
                  this.handleShowBatchResume(2)
                }}
                size="small"
                type="primary"
              >
                不合适
              </Button>
              {tp !== 1 && (
                <Button
                  onClick={() => {
                    this.handleShowBatchResume(1)
                  }}
                  size="small"
                  type="primary"
                >
                  待沟通
                </Button>
              )}
              {tp !== 1 && tp !== 3 && (
                <Button
                  size="small"
                  onClick={() => {
                    this.handleShowBatchResume(9)
                  }}
                  type="primary"
                >
                  储备人才
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  render() {
    const { resumeData, current, visible, popupText } = this.state
    return (
      <div>
        {this.renderHeader()}
        {resumeData.map((v, k) => {
          return (
            <div key={Math.random()}>
              <ResumeCard
                {...this.props}
                clickCallback={this.resumeCardCallBack}
                index={k}
                value={v}
                resumeData={resumeData}
                trackParam={this.props.trackParam}
              />
            </div>
          )
        })}
        {this.initTotal() > 20 && (
          <div className={styles.page}>
            <Pagination
              defaultPageSize={20}
              style={{ width: '352px', margin: '0 auth' }}
              current={current}
              onChange={this.handleOnChange}
              total={this.initTotal()}
            />
          </div>
        )}
        <Modal
          visible={visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          footer={[
            <Button key="back" onClick={this.hideModal}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              确定
            </Button>,
          ]}
        >
          <p style={{ padding: '30px 0 0 0' }}>{popupText}</p>
        </Modal>
      </div>
    )
  }
}
