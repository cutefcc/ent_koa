import * as React from 'react'
import { connect } from 'react-redux'
import { Input } from 'antd'
import JobSelect from 'componentsV2/Position/Recommend/JobSelect'
import * as styles from './index.less'

const { TextArea } = Input

export interface Props {
  jobs: object[]
  currentJid: number
  maxLength: number
  inviteText: string
  onJidChange: Function
  onTextChange: Function
}

export interface GlobalStore {}

export interface GlobalState {
  global: GlobalStore
}

@connect((state: GlobalState) => ({
  jobs: state.global.jobs,
}))
export default class InviteJobSelect extends React.PureComponent<
  Props & GlobalStore,
  State
> {
  handleJidChange = (jid) => {
    const { onJidChange } = this.props
    if (onJidChange) {
      onJidChange(jid)
    }
  }

  handleContentChange = (e) => {
    const { onTextChange } = this.props
    if (onTextChange) {
      onTextChange(e.target.value)
    }
  }

  render() {
    const { jobs, currentJid, inviteText = '', maxLength = 100 } = this.props
    return (
      <div className={styles.inviteJobSelect}>
        <div className={styles.inviteText}>
          <p className={styles.label}>
            邀约内容
            <span className={styles.require}>*</span>
          </p>
          <TextArea
            onChange={this.handleContentChange}
            className={styles.textArea}
            value={inviteText}
            maxLength={maxLength}
            placeholder="请输入至少10个字的邀约内容"
          />
          <div className={styles.currentLen}>
            {inviteText.length}/{maxLength}
          </div>
        </div>
        <div className={styles.jobSelectWrapper}>
          <p className={styles.label}>邀约职位</p>
          <JobSelect
            data={jobs}
            onChange={this.handleJidChange}
            width={'100%'}
            value={currentJid}
            placeholder="请选择职位"
            notFoundContent="暂无在招职位"
            dropdownStyle={{
              paddingTop: 40,
              paddingBottom: 40,
              textAlign: 'center',
            }}
          />
        </div>
      </div>
    )
  }
}
