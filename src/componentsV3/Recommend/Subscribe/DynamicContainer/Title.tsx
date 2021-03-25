import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Checkbox } from 'mm-ent-ui'
import { parseCurrentTabParam } from 'utils/talentDiscover'
import * as styles from './title.less'

export interface Props {
  currentDynamicCategory: string
  disabled: boolean
  loading: boolean
  dynamicCategoryMap: object
  paginationParam: object
}

export interface State {
  closeAssociationStatus: boolean
}

@connect((state) => ({
  loading: state.loading.effects['subscribe/fetchData'],
  currentDynamicCategory: state.subscribe.currentDynamicCategory,
  dynamicCategoryMap: state.subscribe.dynamicCategoryMap,
  dynamicTabs: state.subscribe.dynamicTabs,
  paginationParam: state.subscribe.paginationParam,
}))
export default class Title extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      closeAssociationStatus: false, // 是否选中高度先关的筛选
    }
  }

  componentDidMount = () => {
    const { dynamicTabs } = this.props
    console.log('dynamicTabs----subscribe', dynamicTabs)
    if (dynamicTabs.length === 0) {
      this.fetchDynamicTabs()
    }
  }

  fetchDynamicTabs = () => {
    this.props.dispatch({
      type: 'subscribe/fetchDynamicTabs',
      payload: {},
    })
  }

  fetchData = () => {
    this.props.dispatch({
      type: 'subscribe/fetchData',
      payload: {},
    })
  }

  handleTabChange = (tab) => () => {
    const { loading, currentDynamicCategory, dynamicCategoryMap } = this.props
    if (!loading) {
      // e.stopPropagation()
      // 还在loading状态或者点击当前的激活tab都不需要去请求数据和打点
      if (tab === currentDynamicCategory || loading) {
        return
      }

      this.setState({
        closeAssociationStatus: false,
      })
      // 清空总数
      this.props.dispatch({
        type: 'subscribe/setPaginationParam',
        payload: {
          ...this.props.paginationParam,
          total: 0,
        },
      })
      this.props.dispatch({
        type: 'subscribe/setCurrentDynamicCategory',
        payload: tab,
      })
      this.fetchData()
      if (window.voyager) {
        const res = parseCurrentTabParam(dynamicCategoryMap[tab] || {})
        const param = {
          datetime: new Date().getTime(),
          uid: window.uid,
          ...this.props.trackParam,
          current_dynamic_tab: JSON.stringify(res),
        }
        const key = 'jobs_pcv2_discover_dynamic_tab_change'
        window.voyager.trackEvent(key, key, param)
      }
    }
  }

  handleCloseAssociationStatusChange = (e) => {
    const { target = {} } = e
    const { checked = false } = target
    this.setState({
      closeAssociationStatus: checked,
    })
    this.props.dispatch({
      type: 'subscribe/fetchDynamic',
      payload: checked
        ? {
            event_types: '1,2,3,4,5,6', // 具体值，看产品需求
          }
        : {},
    })
  }

  renderAssociationFilter = () => {
    return (
      <Checkbox
        onChange={this.handleCloseAssociationStatusChange}
        checked={this.state.closeAssociationStatus}
        className={styles.associationFilter}
      >
        高度相关
      </Checkbox>
    )
  }

  renderTabs = () => {
    const { currentDynamicCategory, loading, dynamicTabs } = this.props

    // 需要为某些 tab 添加附加的选项
    const extraContent = [
      {
        value: '0',
        extraComp: this.renderAssociationFilter(),
      },
    ]
    return (
      <ul className="flex ul-without-style">
        {dynamicTabs.map((tab, idx) => {
          const { title, trackParam = {}, attr = '', post_param = {} } = tab
          const value = post_param.event_types || ''
          const currentItemExtraContent = R.find(
            R.propEq('value', value),
            extraContent
          )
          const active = currentDynamicCategory === value
          return (
            <li
              key={value}
              className={`margin-left-16 font-size-14 ${
                loading ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              style={{ color: '#999', marginLeft: idx === 0 ? 0 : 16 }}
            >
              <span
                onClick={this.handleTabChange(value)}
                className={active ? 'color-blue font-weight-bold' : ''}
                attr={attr}
                trackparam={JSON.stringify(trackParam)}
              >
                {title}
              </span>
              {/* {currentItemExtraContent && currentItemExtraContent.extraComp} */}
            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    const { dynamicTabs } = this.props
    if (dynamicTabs.length === 0) {
      return null
    }
    return (
      <div
        style={{
          borderBottom: '1px solid #eee',
          borderTop: '1px solid #eee',
          padding: '12px 0',
          textIndent: '16px',
          backgroundColor: '#fff',
        }}
        className="flex space-between"
      >
        <div className="flex">{this.renderTabs()}</div>
      </div>
    )
  }
}
