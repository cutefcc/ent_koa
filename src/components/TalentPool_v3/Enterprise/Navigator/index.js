/* eslint-disable */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  CaretDownOutlined,
  CaretUpOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { message, Progress } from 'antd'
import { Icon, Button } from 'mm-ent-ui'
import { Modal } from 'mm-ent-ui'
import ErrorBoundary from 'components/Common/ErrorBoundary'
import * as R from 'ramda'
import EditEntCustomGroup from './EditEntCustomGroup'
import EditCompanyFocused from './EditCompanyFocused_v2'
import styles from './index.less'

@connect((state) => ({
  statLoading: state.loading.effects['talentPool/fetchStat'],
  navigatorLoading: state.loading.effects['talentPool/fetchNavigator'],
  currentUser: state.global.currentUser,
  navigator: state.talentPool.navigator,
  stat: state.talentPool.stat,
}))
export default class Navigator extends React.PureComponent {
  static propTypes = {
    onNavigatorChange: PropTypes.func.isRequired,
    currentNavigator: PropTypes.object.isRequired,
    defaultNavigatorKey: PropTypes.string,
  }

  static defaultProps = {
    defaultNavigatorKey: '',
  }

  constructor(props) {
    super(props)
    const { defaultNavigatorKey, navigator } = props
    // 设置默认的选项
    if (defaultNavigatorKey && !R.isEmpty(navigator)) {
      this.setDefaultNavigator(defaultNavigatorKey, navigator)
    }
    this.fetchNavigator()
  }

  state = {
    itemCollapseState: {},
    showEditGroup: false,
    showEditCompanyGroup: false,
  }

  componentWillReceiveProps(newProps) {
    const { defaultNavigatorKey, navigator } = newProps
    if (defaultNavigatorKey && navigator !== this.props.navigator) {
      this.setDefaultNavigator(defaultNavigatorKey, navigator)
    }

    if (newProps.navigator !== this.props.navigator) {
      // 如果有 navigator 项目正在加载，则一定时间之后重新刷新数据
      if (this.thereisLoadingItem(newProps.navigator)) {
        setTimeout(this.fetchNavigator, 1000)
      }
    }
  }

  getItemKey = (item) =>
    item.key || `${item.title}-${JSON.stringify(item.post_param || {})}`

  setDefaultNavigator = (defaultNavigatorKey, navigators) => {
    const nav1 = navigators.reduce((res, item) => [...res, ...item.options], [])
    const currentNavigator = nav1.find(R.propEq('key', defaultNavigatorKey))
    if (currentNavigator) {
      this.props.onNavigatorChange({
        url: currentNavigator.url,
        itemKey: this.getItemKey(currentNavigator),
        total: currentNavigator.total,
        param: currentNavigator.post_param,
      })
    } else {
      this.props.onNavigatorChange({
        url: '/api/ent/talent/pool/search_v2',
        itemKey: 'total',
        param: {},
        method: 'POST',
      })
    }
  }

  isAdmin = () => R.pathOr(0, ['ucard', 'is_adm'], this.props.currentUser) === 1

  thereisLoadingItem = (nav = []) => {
    const navItems = nav.reduce((res, item) => [...res, ...item.options], [])
    const loadingItem = navItems.find((item) => !!item.loading_percent)
    return !!loadingItem
  }

  formatItem = (item) => {
    const map = {
      company_group: {
        extraButton: (
          <Button
            type="likeLink"
            className="color-dilution"
            onClick={this.handleShowEditGroup}
          >
            <Icon type="edit" className="margin-right-5" />
            编辑
          </Button>
        ),
        placeholder: (
          <span
            onClick={this.handleShowEditGroup}
            className="cursor-pointer padding-left-16"
          >
            + 添加员工分组
          </span>
        ),
      },
      attention: {
        extraButton: (
          <Button
            type="likeLink"
            className="color-dilution"
            onClick={this.handleShowEditCompanyGroup}
          >
            <Icon type="add" className="margin-right-5 font-size-12" /> 添加
          </Button>
        ),
      },
    }
    return {
      ...item,
      ...map[item.key],
    }
  }

  fetchNavigator = () => {
    this.props.dispatch({
      type: 'talentPool/fetchNavigator',
      payload: {
        navigator_type: 2,
      },
    })
  }

  handleShowSearch = () => {
    this.props.onNavigatorChange({
      url: '/api/ent/talent/pool/search_v2',
      itemKey: 'total',
      param: {},
      method: 'POST',
    })
  }

  handleChange = (navigator) => () => {
    const { key, title } = navigator
    if (window.voyager) {
      const eventName = 'jobs_pc_pool_enterprise_navigator_change'
      const param = {
        datetime: new Date().getTime(),
        key: key || title,
        title,
      }
      window.voyager.trackEvent(eventName, eventName, param)
    }
    this.props.onNavigatorChange(navigator)
    setTimeout(this.fetchNavigator, 100) //点击导航栏的item时，刷新导航栏的数量
  }

  handleItemCollapseStateChange = (title, state) => () => {
    this.setState({
      itemCollapseState: {
        ...this.state.itemCollapseState,
        [title]: state,
      },
    })
  }

  handleShowEditGroup = () => {
    this.setState({
      showEditGroup: true,
    })
  }

  handleHideEditGroup = () => {
    this.setState({
      showEditGroup: false,
    })
  }

  handleShowEditCompanyGroup = () => {
    const remain = R.pathOr(
      0,
      ['talent_lib', 'attention_company_left'],
      this.props.currentUser
    )

    if (!this.isAdmin()) {
      Modal.confirm({
        title: '暂无权限',
        content: '您没有此操作的权限，请联系企业管理员进行此操作。',
        type: 'common',
      })
      return
    }

    if (!(remain > 0)) {
      Modal.confirm({
        title: '添加关注公司',
        content:
          '您的关注企业名额已经达上限，请联系销售专员开通高级服务获得更多名额',
        type: 'common',
      })
      return
    }

    this.setState({
      showEditCompanyGroup: true,
    })
  }

  handleHideEditCompanyGroup = () => {
    this.setState({
      showEditCompanyGroup: false,
    })
  }

  renderItemTitle = (item) => {
    return (
      <h5 className={`${styles.title} flex space-between`}>
        {item.title}
        {item.extraButton || null}
      </h5>
    )
  }

  renderItemContent = (item) => {
    const { options } = item
    const maxShow = 6
    const showOptions =
      R.path([item.title], this.state.itemCollapseState) !== false
        ? options.slice(0, maxShow)
        : options

    if (showOptions.length === 0) {
      return item.placeholder
    }

    const renderOption = (option) => {
      const itemKey = this.getItemKey(option)
      const active = this.props.currentNavigator.itemKey === itemKey
      const isLoading = !!option.loading_percent
      const onClick = option.loading_percent
        ? null
        : this.handleChange({
            ...option,
            itemKey,
            param: option.post_param,
          })
      const total = isLoading ? (
        <span className="flex">
          <LoadingOutlined className="margin-right-5 display-inline-block" />
          {option.loading_percent}
        </span>
      ) : (
        option.total
      )
      const disabled = option.action_code === 1
      return (
        <span
          onClick={onClick}
          key={option.title}
          className={`flex space-between margin-top-8 font-size-14 cursor-pointer ${
            active ? 'color-blue' : ''
          } ${isLoading ? styles.disabled : ''}`}
        >
          <span className="ellipsis">
            {`${option.title}${disabled ? '(待开通)' : ''}`}
          </span>
          <span>{total}</span>
        </span>
      )
    }

    const renderCollapse = () => {
      const className =
        'cursor-pointer margin-top-16 color-dilution inline-block font-size-12 display-inline-block'

      if (showOptions.length < options.length) {
        return (
          <span
            onClick={this.handleItemCollapseStateChange(item.title, false)}
            className={className}
          >
            展开更多
          </span>
        )
      }

      if (showOptions.length > maxShow) {
        return (
          <span
            onClick={this.handleItemCollapseStateChange(item.title, true)}
            className={className}
          >
            收起
          </span>
        )
      }

      return null
    }

    return (
      <div className={styles.content}>
        {showOptions.map(renderOption)}
        {renderCollapse()}
      </div>
    )
  }

  renderItem = (item) => {
    const itemRes = this.formatItem(item)
    return (
      <div className={styles.item} key={item.title}>
        {this.renderItemTitle(itemRes)}
        {this.renderItemContent(itemRes)}
      </div>
    )
  }

  renderPartCollapseButton = (title) => {
    if (this.state.partCollapseState[title] === false) {
      return (
        <span
          onClick={this.handlePartCollapseStateChange(title, true)}
          className="color-dilution font-size-14 cursor-pointer font-weight-common"
        >
          展开
          <CaretDownOutlined className="font-size-10 color-dilution font-weight-common margin-left-8" />
        </span>
      )
    }
    return (
      <span
        onClick={this.handlePartCollapseStateChange(title, false)}
        className="color-dilution font-size-14 cursor-pointer font-weight-common"
      >
        收起
        <CaretUpOutlined className="font-size-10 color-dilution font-weight-common margin-left-8" />
      </span>
    )
  }

  renderTotal = () => {
    return (
      <div className={styles.total}>
        <span
          onClick={this.handleShowSearch}
          className={`flex space-between ${
            this.props.currentNavigator.itemKey === 'total'
              ? 'color-blue font-weight-bold'
              : ''
          }`}
        >
          <span className="cursor-pointer">全部分组</span>
          {!this.props.statLoading && <span>{this.props.stat.total || 0}</span>}
          {this.props.statLoading && (
            <LoadingOutlined className="margin-left-16" />
          )}
        </span>
      </div>
    )
  }

  render() {
    const { navigator } = this.props
    return (
      <ErrorBoundary>
        <div>
          {this.renderTotal()}
          {navigator.map(this.renderItem)}
          {this.state.showEditGroup && (
            <EditEntCustomGroup
              onCancel={this.handleHideEditGroup}
              canDelete={this.isAdmin()}
            />
          )}
          {this.state.showEditCompanyGroup && (
            <EditCompanyFocused onCancel={this.handleHideEditCompanyGroup} />
          )}
        </div>
      </ErrorBoundary>
    )
  }
}
