import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { checkIsTrial } from 'utils'
import { Typography, Empty, Button } from 'mm-ent-ui'
import * as styles from './index.less'

export interface Props {
  className: string
  tip: string
  urlPrefix: string
}

export interface State {}

interface talentDiscoverState {
  currentGroup: object
}

@connect((state: talentDiscoverState) => ({
  currentGroup: state.talentDiscover.currentGroup,
  urlPrefix: state.global.urlPrefix,
}))
export default class EmptyTip extends React.PureComponent<
  Props & talentDiscoverState,
  State
> {
  handleShowUpgradeMember = () => {
    const isTrial = checkIsTrial()
    if (isTrial) {
      this.props.dispatch({
        type: 'global/setMemberOpenTip',
        payload: {
          show: true,
          msg: '开通招聘企业版 解锁更多功能',
          cancelTxt: '放弃开通',
          confirmTxt: '立即开通',
        },
      })
    } else {
      this.props.dispatch({
        type: 'global/setMemberUpgradeTip',
        payload: {
          show: true,
        },
      })
    }
  }

  renderEmptyTip = () => {
    const { currentGroup, tip } = this.props
    if (currentGroup.action_code === 1) {
      const desc = (
        <div>
          <Typography.Text
            size="16px"
            strong
            className="margin-top-24 display-block"
            type="stress"
          >
            开通企业高级会员
          </Typography.Text>
          <Typography.Text size="14px" className="margin-top-8 display-block">
            {currentGroup.action_tip || '开通高级会员，解锁更多功能'}
          </Typography.Text>
          <div className="flex flex-justify-center margin-top-16">
            <Button type="primary" onClick={this.handleShowUpgradeMember}>
              立即开通
            </Button>
          </div>
        </div>
      )
      return (
        <Empty
          image={`${this.props.urlPrefix}/images/empty_position.png`}
          description={desc}
        />
      )
    }
    return (
      <div className={styles.defaultTip}>
        <div>
          <p className={styles.resultTip}>{tip || '暂无人才'}</p>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={R.propOr('', 'className', this.props)}>
        {this.renderEmptyTip()}
      </div>
    )
  }
}
