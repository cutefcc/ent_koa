import * as React from 'react'
import * as R from 'ramda'
import * as styles from './index.less'
import { connect } from 'react-redux'
import { Loading } from 'mm-ent-ui'
import { talentReportAuthority } from 'utils/talentReport'

export interface Props {
  dispatch?: (obj: object) => any
  menuList: object[]
  selectMenuKey: string
  loading: Boolean
  listLoading: Boolean
  talentReportVersion: string
}

export interface State {}

@connect((state: any) => ({
  menuList: state.talentReport.menuList,
  selectMenuKey: state.talentReport.selectMenuKey,
  talentReportVersion: state.talentReport.talentReportVersion,
  loading: state.loading.effects['talentReport/fetchMenu'],
}))
export default class Menu extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  trackClickEvent = (eventName, param) => {
    if (window.voyager) {
      window.voyager.trackEvent(eventName, eventName, param)
    }
  }

  componentDidMount() {
    this.fetchData()

    // 打点
    const { selectMenuKey } = this.props
    const param = {
      datetime: new Date().getTime(),
      uid: window.uid,
      menu_key: selectMenuKey,
    }
    this.trackClickEvent('jobs_pc_talent_report_click_menu', param)
  }

  renderLoading = () => {
    return (
      <p className="text-center margin-top-32">
        <Loading />
        <span className="color-gray400 margin-left-8">加载中...</span>
      </p>
    )
  }

  fetchData = () => {
    this.props.dispatch({
      type: 'talentReport/fetchMenu',
    })
  }

  onClickMenu = (item, listLoading) => {
    const { selectMenuKey, talentReportVersion } = this.props
    const menuKey = R.pathOr('', ['key'], item)
    if (listLoading || menuKey === selectMenuKey) {
      return
    }

    // 打点
    const param = {
      datetime: new Date().getTime(),
      uid: window.uid,
      menu_key: menuKey,
    }
    this.trackClickEvent('jobs_pc_talent_report_click_menu', param)

    this.props.dispatch({
      type: 'talentReport/selectMenu',
      payload: {
        selectMenuKey: menuKey,
      },
    })

    // 权限判断
    const rightsSet = R.pathOr(
      new Set([]),
      [talentReportVersion],
      talentReportAuthority
    )
    if (rightsSet.has(menuKey)) {
      this.props.dispatch({
        type: 'talentReport/fetchData',
      })
    }
  }

  render() {
    let { menuList = [], loading, selectMenuKey, listLoading } = this.props
    return (
      <div className={styles.main}>
        {loading && this.renderLoading()}

        <div className={styles.list}>
          {menuList &&
            menuList.map((item, index) => {
              return (
                <div>
                  <div className={styles.headerStyle}>
                    {R.pathOr('', ['title'], item)}
                  </div>
                  {R.pathOr([], ['subMenuList'], item).map(single => {
                    return (
                      <div
                        className={`${styles.subItem} ${
                          selectMenuKey === R.pathOr('', ['key'], single)
                            ? styles.selectedItem
                            : null
                        } ${listLoading ? styles.listLoading : null}`}
                        key={R.pathOr('', ['key'], single)}
                        onClick={() => {
                          this.onClickMenu(single, listLoading)
                        }}
                      >
                        <span>{R.pathOr('', ['title'], single)}</span>
                      </div>
                    )
                  })}
                  {index !== menuList.length - 1 && menuList.length !== 1 && (
                    <div className={styles.line} />
                  )}
                </div>
              )
            })}
        </div>
      </div>
    )
  }
}
