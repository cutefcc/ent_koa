import React from 'react'
import { Radio } from 'antd'
import PropTypes from 'prop-types'
import styles from './common.less'

export default class ResumeSource extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array,
  }

  static defaultProps = {
    value: -1,
  }

  handleChange = (e) => {
    const { value } = e.target
    this.props.onChange(value || undefined)
  }

  render() {
    const { value } = this.props
    const options = [
      { label: '不限制', value: '' },
      { label: '我发起的', value: 'initator_hr' },
      { label: '候选人发起的', value: 'initator_candidate' },
      /* {label: '有未读消息', value: 'hasUnread'},
      {label: '最近三天发起的会话', value: 'threeDay'},
      {label: '未回复企业好友邀请的', value: 'noReply'},
      {label: '只同意IM沟通的', value: 'im'},
      {label: '同意成为企业好友的', value: 'friend'}, */
    ]

    return (
      <div className={styles.resumeSource}>
        <h3>筛选</h3>
        <Radio.Group
          options={options}
          onChange={this.handleChange}
          value={value || ''}
        />
      </div>
    )
  }
}
