/**
 * 需要关注的数据
 */
import React from 'react'
import styles from 'styled-components'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { showMosaic } from 'utils/account'
import * as R from 'ramda'

const HeaderWrapper = styles.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  font-size: 14px;
  border-bottom: 1px solid rgba(238,238,238,1);
`

const HeaderTitle = styles.div`
  color: #363D4D;
  font-family: PingFangSC-Medium;
  font-weight: 500;
`

const AttentionTalentTemplateWrapper = styles.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
`
const AttentionTalentItem = styles.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const AttentionTalentNumber = styles.div`
  display: flex;
  color: rgba(54,61,77,1);
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  height: 20px;
  justify-content: center;
`
const ImportantNumber = styles.span`
  position: absolute;
  left: 64%;
  top: -22px;
  color: #FF4D3C;
  font-size: 14px;
`
const AttentionTalentTitle = styles.div`
  font-weight: 400;
  font-size: 14px;
  color: #999;
  margin-top: 14px;
  width: 120px;
  text-align: center;
`
const Wrapper = styles.div`
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:hover {
    ${AttentionTalentNumber} {
      color: #2263e6;
    }
  }
`
@connect((state) => ({
  loading: state.loading.effects['talentPool/fetchStat'],
  talentPoolStat: state.talentPool.stat,
  runtime: state.global.runtime,
  currentUser: state.global.currentUser,
}))
@withRouter
export default class AttentionTalentTemplate extends React.PureComponent {
  state = {
    isReaded: false,
    attentionTalentData: {
      total: 0,
      willingness: {
        high_total: 0,
        high_new: 0,
        uprush_total: 0,
        uprush_new: 0,
      },
    },
  }
  componentWillReceiveProps(nextPorps) {
    if (
      Object.keys(nextPorps.talentPoolStat).length > 0 &&
      nextPorps.runtime.length > 0
    ) {
      this.handGetData(nextPorps)
    }
  }

  handleShowUpgradeMember = () => {
    this.props.dispatch({
      type: 'global/setMemberUpgradeTip',
      payload: {
        show: true,
      },
    })
  }

  handGetData = (nextPorps) => {
    this.setState({
      attentionTalentData: nextPorps.talentPoolStat || {},
    })
    nextPorps.runtime.forEach((item) => {
      if (item.reddot_type === 2 || item.reddot_type === '2') {
        this.setState({
          isReaded: item.is_read === 1,
        })
      }
    })
  }

  handleSetReddot = () => {
    this.props.dispatch({
      type: 'global/setReddot',
      payload: {
        reddot_type: 2,
      },
    })
  }

  handleTurnToTalentV3 = (nav) => () => {
    const needShowMosaic = showMosaic(this.props.currentUser)
    if (needShowMosaic) {
      this.handleShowUpgradeMember()
      return
    }
    this.handleSetReddot()
    this.props.history.push(`/ent/talents/pool/enterprise_v3?nav=${nav}`)
  }

  render() {
    const { isReaded, attentionTalentData } = this.state

    return (
      <AttentionTalentTemplateWrapper className={this.props.className}>
        <HeaderWrapper>
          <HeaderTitle>高意向人才</HeaderTitle>
        </HeaderWrapper>
        <AttentionTalentItem>
          <Wrapper onClick={this.handleTurnToTalentV3('willingness_high')}>
            <ImportantNumber>
              {R.pathOr(0, ['willingness', 'new'], attentionTalentData) > 0 &&
              !isReaded
                ? `+${attentionTalentData.willingness.new}`
                : ''}
            </ImportantNumber>
            <AttentionTalentNumber>
              <span attr="talent_high_intention">
                {R.pathOr(0, ['willingness', 'total'], attentionTalentData)}
              </span>
            </AttentionTalentNumber>
            <AttentionTalentTitle>
              <div attr="talent_high_intention">当前高意向人才</div>
            </AttentionTalentTitle>
          </Wrapper>
        </AttentionTalentItem>
      </AttentionTalentTemplateWrapper>
    )
  }
}
