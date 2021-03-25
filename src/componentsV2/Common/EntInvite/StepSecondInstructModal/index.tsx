import * as React from 'react'
import { connect } from 'react-redux'
import { Button } from 'mm-ent-ui'
import * as R from 'ramda'
import * as styles from './index.less'

export interface Props {
  visible: boolean
  onCancel: Function
  currentInvitation: Object
}

export interface StoreGlobalState {
  urlPrefix: string
  currentUser: object
}

export interface GlobalState {
  // loading: Loading,
  global: StoreGlobalState
}

export interface State {}

@connect((state: GlobalState) => ({
  urlPrefix: state.global.urlPrefix,
  currentUser: state.global.currentUser,
}))
export default class StepSecondModal extends React.Component<
  Props & StoreGlobalState,
  State
> {
  renderCard = () => {
    const companyLogo = R.propOr(
      '',
      ['company', 'clogo'],
      this.props.currentUser
    )
    const companyName = R.propOr(
      '',
      ['company', 'stdname'],
      this.props.currentUser
    )
    return (
      <div className={styles.card}>
        <div className="flex space-between flex-align-center">
          <div className="flex">
            <img src={companyLogo} className={styles.clogo} />
            <div className="flex-column space-between">
              <span className="font-size-12 color-gray700 font-weight-bold">
                {companyName}
              </span>
              <span className="ellipsis">已上市·1万人以上·移动互联网</span>
            </div>
          </div>
          <span className={styles.button}>可以聊</span>
        </div>
        <div className="margin-top-16 font-size-14">
          公司紧急招聘PHP、Java、项目经理等热门职位
          考虑换工作环境的同学是个不错的时间点
        </div>
        <div className="margin-top-24 flex space-between font-size-12 color-gray400">
          <span>1分钟前</span>
          <span>···</span>
        </div>
      </div>
    )
  }
  render() {
    // return (
    //   <div className={styles.main}>
    //     <img src={`${this.props.urlPrefix}/images/entInvite/stepSecondInstruct.png`} className={styles.img} />
    //     {this.renderCard()}
    //     <div className={styles.tip}>
    //       下发成功后，，目标人才将在【脉脉APP - 基于 - 企业广场】内看到企业邀约。如目标人才表达了“可以聊”，ta会同步回流到人才银行中。
    //     </div>
    //     <div className={styles.footer}>
    //       <Button type="primary-2" roundCorner>我知道了</Button>
    //     </div>
    //   </div>
    // )
    const { urlPrefix } = this.props
    // const {urlPrefix, currentUser} = this.props
    // const companyLogo = R.pathOr('', ['company', 'clogo'], currentUser)
    // const companyName = R.pathOr('', ['company', 'stdname'], currentUser)
    // const info = R.compose(
    //   R.join('·'),
    //   R.filter(i => !R.isEmpty(i) && !R.isNil(i)),
    //   R.values,
    //   R.pickAll(['stage', 'people', 'domain']),
    //   R.propOr({}, 'company')
    // )(currentUser)
    return (
      <React.Fragment>
        <div
          className={styles.card}
          style={{
            backgroundImage: `url(${urlPrefix}/images/entInvite/stepSecondInstructNew.png)`,
          }}
        >
          {/* <div className={styles.cardContent}>
            <img src={companyLogo} className={styles.clogo}></img>
            <div className="flex flex-column space-between flex-1 margin-left-8 overflow-hidden">
              <span className="font-size-12 color-gray700 font-weight-bold">{companyName}</span>
              <span className="ellipsis font-size-12 color-gray500">{info}</span>
            </div>
          </div> */}
        </div>
        <div className={styles.tip}>
          下发成功后目标人才将在【脉脉App-消息】内看到智能邀约。如目标人才点击‘可以聊’，ta会同步回流到人才银行中。
        </div>
        <div className={styles.footer}>
          <Button type="primary-2" roundCorner onClick={this.props.onCancel}>
            我知道了
          </Button>
        </div>
      </React.Fragment>
    )
  }
}
