import * as React from 'react'
import * as R from 'ramda'
import { Icon, Popover } from 'mm-ent-ui'
import { SubscriptionListItem } from './types/index'
import { connect } from 'react-redux'
import { DEFAULT_COMPANY_OPTIONS } from 'constants'
import { CURRENT_TAB } from 'constants/talentDiscover'
import * as styles from './index.less'

export interface Props {
  subscriptionList: object[]
  onDeleteSubscription: (id: number | string) => any
  dispatch?: (value: object) => any
  onCurrentSubscriptionChange: (item: object) => void
}

export interface State {
  showPop: boolean
}

@connect((state: any) => ({
  config: state.global.config,
  profession: state.global.profession,
}))
export default class Subscription extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      showPop: false,
    }
  }

  handleShowPopChange = (visible: boolean) => {
    this.setState({ showPop: visible })
  }

  handleCombMainTitle = (item: object) => {
    const { config } = this.props
    // 标题: 关键词 / 公司1、公司n / 职位技能1、职位技能n / 城市1、城市n / 工作年限1、工作年限n
    let strArr = []
    let worktimes = R.propOr('', 'worktimes', item)
    //公司
    const companys = R.propOr('', 'companys', item)
    // DEFAULT_COMPANY_OPTIONS.filter(obj => {
    //   return R.propOr('', 'companys', item)
    //     .split(',')
    //     .includes(obj.value)
    // }).forEach(obj => {
    //   companys += `,${obj.label}`
    // })
    // if (companys) companys = companys.slice(1)
    // 工作年限
    let worktimesStr = ''
    R.propOr([], 'worktime', config)
      .filter((obj) => {
        return worktimes.split(',').includes(String(obj.value))
      })
      .forEach((obj) => {
        worktimesStr += `,${obj.label}`
      })
    if (worktimesStr) worktimesStr = worktimesStr.slice(1)

    strArr.push(
      R.propOr('', 'query', item), //关键词
      companys, //公司
      R.propOr('', 'positions', item), //职位技能
      R.propOr('', 'provinces', item), //城市1、城市n
      worktimesStr //工作年限
    )
    strArr = strArr.filter((str) => str !== '')
    return strArr.join('/')
  }

  handleCombSubTitle = (item: object) => {
    // 副标题: 学校1、学校n / 学历1、学历n / 行业方向1、行业方向n
    const { config, profession } = this.props
    let subTitleArr = []
    // 学校
    let schools = item.is_985 === 1 ? '985' : ''
    schools += schools
      ? item.is_211 === 1
        ? ',211'
        : ''
      : item.is_211 === 1
      ? '211'
      : ''
    if (schools) {
      if (item.schools) schools += `,${item.schools}`
    } else {
      if (item.schools) schools += item.schools
    }
    // 学历
    let degreesStr = ''
    let degrees = R.propOr('', 'degrees', item)
    R.propOr([], 'degree', config)
      .filter((obj) => {
        return degrees.split(',').includes(String(obj.value))
      })
      .forEach((obj) => {
        degreesStr += `,${obj.label}`
      })
    if (degreesStr) degreesStr = degreesStr.slice(1)
    //行业方向
    let professionsStr = ''
    let professions = R.propOr('', 'professions', item)
    profession
      .filter((obj) => {
        return professions.split(',').includes(String(obj.code))
      })
      .forEach((obj) => {
        professionsStr += `,${obj.name}`
      })
    if (professionsStr) professionsStr = professionsStr.slice(1)

    subTitleArr.push(schools, degreesStr, professionsStr)
    subTitleArr = subTitleArr.filter((str) => str !== '')
    return subTitleArr.join('/')
  }

  renderSubscriptionList = (subscriptionList: object[]) => (
    <div className={styles.mainCon}>
      <div className={styles.popoverCon}>
        {subscriptionList.map((item: SubscriptionListItem) => {
          const mainTitle = this.handleCombMainTitle(item)
          const subTitle = this.handleCombSubTitle(item)
          return (
            <div
              key={item.id}
              className={styles.subscriptionItem}
              onClick={() => {
                this.handleShowPopChange(false)
                this.props.onCurrentSubscriptionChange(item)
                this.props.dispatch({
                  type: 'talentDiscover/setCurrentTab',
                  payload: CURRENT_TAB.talent,
                })
              }}
            >
              <div className={`${styles.leftArea}`}>
                <div
                  className={`${styles.positions} font-size-14 padding-left-16`}
                >
                  {mainTitle}
                </div>
                <div
                  className={`${styles.tsTitle} font-size-12 padding-left-16`}
                >
                  {subTitle}
                </div>
              </div>
              <div className={styles.rightArea}>
                <div
                  className={styles.delIcon}
                  onClick={(e) => {
                    this.handleShowPopChange(false)
                    this.props.onDeleteSubscription(item.id)
                    e.stopPropagation()
                    e.nativeEvent.stopImmediatePropagation()
                  }}
                >
                  <Icon type="delete" className={'delete font-size-14'} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  render() {
    const { subscriptionList } = this.props
    const { length } = subscriptionList
    return (
      <Popover
        content={this.renderSubscriptionList(subscriptionList)}
        trigger="click"
        // trigger="hover"
        visible={this.state.showPop}
        onVisibleChange={this.handleShowPopChange}
        placement="rightTop"
        autoAdjustOverflow={false}
      >
        <div className={styles.subScriptin}>
          <div className={`${styles.leftSign}`} />
          <div className={styles.rightContent}>
            <div className={`${styles.text} font-size-16`}>
              订阅方案·{length}
            </div>
            <div className={styles.icon}>
              <Icon type="arrow-right-2" className={'arrow-right-2'} />
            </div>
          </div>
        </div>
      </Popover>
    )
  }
}
