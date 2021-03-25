import React, { PureComponent } from 'react'
import { Button, Text, Tab, Message } from 'mm-ent-ui'
import { injectUnmount, trackEvent } from 'utils'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { employerSpreadDataInit } from './constant'
import styles from './employerSpreadBegin.less'

@connect((state) => ({
  loading: state.loading.effects,
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
  employerSpreadData: state.company.employerSpreadData,
}))
@injectUnmount
export default class EmployerSpreadBegin extends PureComponent {
  state = {
    scenesActiveKeys: ['item1'],
  }

  componentDidMount() {}

  getMiddleRigtConfig = () => {
    return [
      {
        title: '精准触达',
        subTitle: '多个维度筛选目标人才，保证信息精准触达',
        key: 'item1',
      },
      {
        title: '高效互动',
        subTitle: '突破人脉限制，一键批量发送消息，保证与人才高效互动',
        key: 'item2',
      },
      {
        title: '多元场景',
        subTitle: '定制内容和互动方式满足雇主品牌和雇主活动等多种场景的推广',
        key: 'item3',
      },
    ]
  }

  getScenseConfig = () => {
    return [
      {
        title: '粉丝头条',
        key: 'item1',
        content: `在粉丝的首页第1条位置展现官方动态，高效触达并影响粉丝，传递官方声音`,
      },
      {
        title: '精准增粉',
        key: 'item2',
        content: `精准挑选潜在粉丝群体，定向邀请关注，助力企业号粉丝转化增长`,
      },
      {
        title: '职位急招',
        key: 'item3',
        content: `给潜在候选人定向推送急招岗位，高效人才匹配，轻松缓解招聘压力`,
      },
      {
        title: '雇主活动',
        key: 'item4',
        content: `企业发起的活动可以推广给脉脉用户，吸引更多人参与，确保活动效果`,
      },
    ]
  }

  handleTabChange = (config) => {
    this.setState({
      scenesActiveKeys: [config.key],
    })
  }

  handleBeginSpread = () => {
    const { onScheduleChanged, employerSpreadData } = this.props
    trackEvent('bprofile_company_manage_employerspread_new')
    // 清空数据
    this.props.dispatch({
      type: 'company/setData',
      payload: {
        employerSpreadData: {
          ...employerSpreadData,
          ...employerSpreadDataInit,
        },
        preData: {},
      },
    })
    onScheduleChanged('processing')
  }

  handleOpen = () => {
    this.props
      .dispatch({
        type: 'entInvite/keepBusiness',
        payload: {
          fr: 'employer_promote',
          uid: window.uid,
        },
      })
      .then(() => {
        Message.success('我们的销售顾问会尽快与您联系')
      })
  }

  renderEmployerSpreadHeader = () => {
    return (
      <div className={`${styles.employerSpreadHeader} flex`}>
        <div className={styles.left}>
          <Text type="title" size={22} className="margin-bottom-16">
            定向推广，让雇主品牌更深入人心
          </Text>
          <Text
            type="text_primary"
            size={16}
            style={{ color: '#666', marginTop: '-5px' }}
          >
            整合亿级优质用户流量，利用专业数据处理算法，为雇主提供社交推广的营销平台。
          </Text>
        </div>
        <div className={`${styles.right}`}>
          {/* {epb > 0 ? ( */}
          <Button
            type="button_l_fixed_blue450"
            onClick={this.handleBeginSpread}
            style={{ width: '126px' }}
          >
            开始推广
          </Button>
          {/* ) : (
            <Button type="button_l_fixed_blue450" onClick={this.handleOpen}>
              立即开通
            </Button>
          )} */}
        </div>
      </div>
    )
  }

  renderEmployerSpreadMiddle = () => {
    return (
      <div className={`${styles.employerSpreadMiddle} flex`}>
        <div className={styles.left}>
          <img
            className={styles.leftImg}
            src={`${this.props.urlPrefix}/images/employer_spread_home.png`}
            alt="employer_spread_home"
          />
        </div>
        <div className={`${styles.right}`}>
          {this.getMiddleRigtConfig().map(this.renderMiddleRightItem)}
        </div>
      </div>
    )
  }

  renderMiddleRightItem = (item) => {
    return (
      <div className={`${styles.rightItem}`} key={item.key}>
        <Text type="title" size={16} className="margin-bottom-6 rightItemTitle">
          <span
            className="icon"
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              border: '2px solid #3375FF',
              borderRadius: '5px',
              marginRight: '8px',
            }}
          />
          {item.title}
        </Text>
        <Text
          type="text_primary"
          size={14}
          style={{ paddingLeft: '18px', color: '#666', marginTop: '6px' }}
        >
          {item.subTitle}
        </Text>
      </div>
    )
  }
  /* eslint-disable */
  renderEmployerSpreadBottom = () => {
    return (
      <div className={`${styles.employerSpreadBottom} flex`}>
        <div className={styles.left}>
          <Text
            type="title"
            size={20}
            className="margin-bottom-6 rightItemTitle"
          >
            你的推送将在以下场景展示
          </Text>
          <div
            style={{
              borderBottom: '1px solid #eee',
              fontSize: '14px',
              marginTop: '25px',
            }}
          >
            <Tab
              tabs={this.getScenseConfig()}
              activeKeys={this.state.scenesActiveKeys}
              onChange={this.handleTabChange}
              type="large"
              style={{ marginLeft: '0px', fontSize: '14px', textAlign: 'left' }}
            />
          </div>
          <Text
            type="text_primary"
            size={14}
            style={{ marginTop: '14px', color: '#666' }}
          >
            {R.propOr(
              '',
              'content',
              R.find(
                R.propEq(
                  'key',
                  R.pathOr('', ['state', 'scenesActiveKeys', 0], this)
                ),
                this.getScenseConfig()
              )
            )}
          </Text>
        </div>
        <div className={`${styles.right}`}>
          <img
            className={styles.rightImg}
            src={`${this.props.urlPrefix}/images/employer_spread_home_botttom${
              // eslint-disable-next-line no-nested-ternary
              this.state.scenesActiveKeys[0] === 'item1'
                ? '1'
                : this.state.scenesActiveKeys[0] === 'item2'
                ? '2'
                : this.state.scenesActiveKeys[0] === 'item3'
                ? '3'
                : '4'
            }.png`}
            alt="employer_spread_home_botttom"
          />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.employerSpreadBeginCon}>
        {this.renderEmployerSpreadHeader()}
        {this.renderEmployerSpreadMiddle()}
        {this.renderEmployerSpreadBottom()}
      </div>
    )
  }
}
