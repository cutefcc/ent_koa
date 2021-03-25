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
      current: this.props.query.page,
      visible: false,
      popupText: '',
      selectionArr: [],
      ptype: 0,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      resumeData: nextProps.resumeData,
      filterStatus: nextProps.filterStatus,
    })
  }

  /** 分页事件* */
  handleOnChange = (page) => {
    page -= 1
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
    const { filterStatus = [], query = {} } = this.props
    const { rtype = 0, has_oppo = -1 } = query
    const hasOppoArray = ['not_oppo_cnt', 'oppo_cnt']
    const cntType = hasOppoArray[has_oppo] || 'cnt'
    const filterStatusObj = filterStatus.filter((v) => {
      return v.type === rtype
    })
    const a =
      Array.isArray(filterStatusObj) && filterStatusObj.length > 0
        ? filterStatusObj[0][cntType]
        : 0
    return a
  }

  // 全选
  handleAllElection = () => {
    const { resumeData } = this.state
    let allElectionType = false
    let selectionCount = 0
    resumeData.map((v) => {
      if (v.rstatus !== 3) {
        if (v.type) {
          selectionCount += 1
        }
        if (!v.type) {
          allElectionType = true
        }
      }
      return v
    })
    if (allElectionType) {
      resumeData.map((v) => {
        const value = v
        if (v.rstatus !== 3) {
          value.type = true
        }
        return value
      })
      this.setState({ resumeData })
    } else {
      resumeData.map((v) => {
        const value = v
        if (v.rstatus !== 3) {
          value.type = false
        }
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
  handleBatchEvent = (eventType, type, param) => {
    this.trackEvent('jobs_pc_resume_handle', {
      ...param,
      eventType: `batchProcessing${TRACKEVENTNAMEMAP[eventType]}`,
      type,
    })
  }

  handleShowBatchResume = (ptype) => {
    const { resumeData } = this.state
    const selectionArr = []
    resumeData.map((v) => {
      if (v.type) {
        selectionArr.push({ uid2: v.id, ejid: v.ejid })
      }
      return v
    })
    this.handleBatchEvent(ptype, 'click', selectionArr)
    const objType = {
      2: '不合适',
      1: '通过初筛',
    }
    const popupText = `确定将${selectionArr.length}位候选人标记为${objType[ptype]}?`
    this.setState({
      visible: true,
      popupText,
      selectionArr,
      ptype,
    })
  }

  initParams = (type) => {
    const parmas = {}
    // 不合适
    if (type === 2) {
      parmas.mark_not_fit = 1
    } else if (type === 1) {
      // 通过初筛
      parmas.pass_primary_filter = 1
    }
    return parmas
  }

  handleBatchResume = () => {
    const { ptype, selectionArr } = this.state
    this.handleBatchEvent(ptype, 'confirm', selectionArr)
    const param = {
      infos: JSON.stringify({
        data: selectionArr,
      }),
    }
    this.props
      .dispatch({
        type: 'resumes/multiProcess',
        payload: {
          ...param,
          ...this.initParams(ptype),
        },
      })
      .then((res) => {
        if (res.result === 'ok') {
          message.success('操作成功')
          this.handleBatchEvent(ptype, 'success', selectionArr)
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
    const { resumeData } = this.state
    const { query } = this.props
    const { rtype } = query
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
              {rtype === 3 ? null : (
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
              {rtype === 1 && (
                <Button
                  onClick={() => {
                    this.handleShowBatchResume(1)
                  }}
                  size="small"
                  type="primary"
                >
                  通过初筛
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  render() {
    const { resumeData, visible, popupText } = this.state
    let { current } = this.state
    current += 1
    return (
      <div>
        {this.renderHeader()}
        {resumeData.map((v, k) => {
          return (
            <div key={Math.random()} className="resumeCard">
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
              showSizeChanger={false}
              style={{ margin: '0 auth' }}
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
