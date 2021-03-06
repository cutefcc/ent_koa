import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  CaretDownOutlined,
  CaretUpOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import { Button, message } from 'antd'
import ErrorBoundary from 'components/Common/ErrorBoundary'
import * as R from 'ramda'

import EditEntCustomGroup from './EditEntCustomGroup'
import EditCompanyGroup from './EditCompanyGroup'
import styles from './navigator.less'

@connect((state) => ({
  statLoading: state.loading.effects['talentPool/fetchStat'],
  navigatorLoading: state.loading.effects['talentPool/fetchNavigator'],
  customGroupLoading: state.loading.effects['talentPool/fetchGroups'],
  customEntGroups: state.talentPool.customEntGroups,
  companyGroupLoading: state.loading.effects['talentPool/fetchCompanyGroups'],
  companyGroups: state.talentPool.companyGroups,
  activityListLoading: state.loading.effects['talentPool/fetchActivityList'],
  activityList: state.talentPool.activityList,
  showActivity: state.talentPool.showActivity,
  currentUser: state.global.currentUser,
  stat: state.talentPool.stat,
}))
class AdvancedSearch extends React.PureComponent {
  static propTypes = {
    onNavigatorChange: PropTypes.func.isRequired,
    navigator: PropTypes.string.isRequired,
  }
  state = {
    navigator: [],
    activeItem: '',
    itemCollapseState: {},
    partCollapseState: {},
    showEditGroup: false,
    showEditCompanyGroup: false,
  }
  componentDidMount() {
    this.fetchNavigator()
    this.fetchCustomGroups()
    this.fetchCompanyGroups()
    this.fetchActivityList()
  }
  fetchNavigator = () => {
    this.props
      .dispatch({
        type: 'talentPool/fetchNavigator',
        payload: {
          navigator_type: 1,
        },
      })
      .then(({ data }) => {
        this.setState({
          navigator: data,
        })
      })
  }

  fetchCustomGroups = () => {
    this.props.dispatch({
      type: 'talentPool/fetchGroups',
    })
  }

  fetchCompanyGroups = () => {
    this.props.dispatch({
      type: 'talentPool/fetchCompanyGroups',
    })
  }

  fetchActivityList = () => {
    this.props.dispatch({
      type: 'talentPool/fetchActivityList',
    })
  }

  handleShowSearch = () => {
    this.setState({
      activeItem: '',
    })
    this.props.onNavigatorChange({
      title: '??????',
      url: '/api/ent/talent/pool/search',
      itemKey: 'total',
    })
  }

  handleChange = (option) => () => {
    const title = `${option.id}${option.value}${option.title}`

    if (option.total === 0) {
      message.warn('???????????????')
      return
    }
    this.props.onNavigatorChange(option)
    this.setState({
      activeItem: title,
    })
  }

  handleItemCollapseStateChange = (category, title, state) => () => {
    this.setState({
      itemCollapseState: {
        ...this.state.itemCollapseState,
        [category]: {
          ...this.state.itemCollapseState[category],
          [title]: state,
        },
      },
    })
  }

  handlePartCollapseStateChange = (title, state) => () => {
    this.setState({
      partCollapseState: {
        ...this.state.partCollapseState,
        [title]: state,
      },
      itemCollapseState:
        state === false
          ? {
              ...this.state.itemCollapseState,
              [title]: {},
            }
          : this.state.itemCollapseState,
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
    this.setState({
      showEditCompanyGroup: true,
    })
  }

  handleHideEditCompanyGroup = () => {
    this.setState({
      showEditCompanyGroup: false,
    })
  }

  renderItem = (item) => {
    const { options } = item
    const maxShow = 6
    const showOptions =
      R.path([item.category, item.title], this.state.itemCollapseState) !==
      false
        ? options.slice(0, maxShow)
        : options
    return (
      <div className={styles.item} key={item.title}>
        <h5 className={`${styles.title} flex space-between`}>
          {item.title}
          {/* {this.state.itemCollapseState[item.title] === false && (
            <span
              onClick={this.handleItemCollapseStateChange(item.title, true)}
              className="margin-left-16 cursor-pointer like-link-button"
            >
              ??????<Icon type="caret-up" className="margin-left-8" />
            </span>
          )} */}
          {item.extraButton || null}
        </h5>
        {showOptions.length === 0 && item.placeholder}
        {showOptions.map((option) => (
          <span
            onClick={this.handleChange(option)}
            key={option.title}
            className={`flex space-between margin-top-8 font-size-14 cursor-pointer ${
              this.state.activeItem ===
              `${option.id}${option.value}${option.title}`
                ? 'color-blue'
                : ''
            }`}
          >
            <span>{option.title}</span>
            <span>{option.total}</span>
          </span>
        ))}
        {R.path([item.category, item.title], this.state.itemCollapseState) !==
          false &&
          options.length > maxShow && (
            <span
              className="cursor-pointer color-dilution margin-top-8 display-inline-block like-link-button"
              onClick={this.handleItemCollapseStateChange(
                item.category,
                item.title,
                false
              )}
            >
              ????????????
            </span>
          )}
      </div>
    )
  }

  renderActivityGroups = () => {
    const { activityList } = this.props
    return this.renderItem({
      title: '????????????',
      options: activityList,
      placeholder: <span className="color-dilution">????????????????????????</span>,
      category: '??????????????????',
    })
  }

  renderCustomGroups = () => {
    const { customEntGroups } = this.props
    const isAdmin =
      R.pathOr(0, ['ucard', 'is_adm'], this.props.currentUser) === 1
    return this.renderItem({
      title: '????????????????????????????????????',
      options: customEntGroups,
      extraButton: isAdmin ? (
        <Button
          className="like-link-button"
          onClick={this.handleShowEditGroup}
          style={{ padding: 0 }}
        >
          ??????
        </Button>
      ) : null,
      placeholder: (
        <span onClick={this.handleShowEditGroup} className="cursor-pointer">
          + ?????????????????????
        </span>
      ),
      category: '????????????????????????????????????',
    })
  }

  renderCompanyGroups = () => {
    const { companyGroups } = this.props
    // const isAdmin =
    //   R.pathOr(0, ['ucard', 'is_adm'], this.props.currentUser) === 1
    return this.renderItem({
      title: '?????????????????????????????????',
      options: companyGroups,
      // extraButton: isAdmin ? (
      //   <Button
      //     className="like-link-button"
      //     onClick={this.handleShowEditCompanyGroup}
      //     style={{padding: 0}}
      //   >
      //     ??????
      //   </Button>
      // ) : null,
      // placeholder: (
      //   <span
      //     onClick={this.handleShowEditCompanyGroup}
      //     className="cursor-pointer"
      //   >
      //     + ??????????????????
      //   </span>
      // ),
      placeholder: <span className="color-dilution">???????????????????????????</span>,
      category: '????????????????????????????????????',
    })
  }

  renderPartCollapseButton = (title) => {
    if (this.state.partCollapseState[title] === false) {
      return (
        <span
          onClick={this.handlePartCollapseStateChange(title, true)}
          className="color-dilution font-size-14 cursor-pointer font-weight-common"
        >
          ??????
          <CaretDownOutlined className="font-size-10 color-dilution font-weight-common margin-left-8" />
        </span>
      )
    }

    return (
      <span
        onClick={this.handlePartCollapseStateChange(title, false)}
        className="color-dilution font-size-14 cursor-pointer font-weight-common"
      >
        ??????
        <CaretUpOutlined className="font-size-10 color-dilution font-weight-common margin-left-8" />
      </span>
    )
  }

  render() {
    const { navigator } = this.state
    return (
      <ErrorBoundary>
        <div>
          <div className={styles.total}>
            <span
              onClick={this.handleShowSearch}
              className={`flex space-between ${
                this.props.navigator.itemKey === 'total'
                  ? 'color-blue font-weight-bold'
                  : ''
              }`}
            >
              <span
                className={`${
                  this.props.navigator.itemKey === 'total'
                    ? 'color-blue'
                    : 'color-common'
                } cursor-pointer`}
              >
                ??????
              </span>
              {!this.props.statLoading && (
                <span>{this.props.stat.total || 0}</span>
              )}
              {this.props.statLoading && (
                <LoadingOutlined className="margin-left-16" />
              )}
            </span>
          </div>
          <div className={styles.part}>
            <h4 className={styles.partTitle}>
              <span>
                ??????????????????
                {this.props.customGroupLoading && (
                  <LoadingOutlined className="margin-left-16" />
                )}
              </span>
              {this.renderPartCollapseButton('??????????????????')}
            </h4>
            {this.state.partCollapseState['??????????????????'] !== false &&
              this.props.showActivity === 1 && (
                <div className="margin-top-8">
                  {this.renderActivityGroups()}
                </div>
              )}
            {this.state.partCollapseState['??????????????????'] !== false && (
              <div className="margin-top-8">{this.renderCustomGroups()}</div>
            )}
            {this.state.partCollapseState['??????????????????'] !== false && (
              <div className="margin-top-8">{this.renderCompanyGroups()}</div>
            )}
          </div>
          <div className={styles.part}>
            <h4 className={styles.partTitle}>
              <span>
                ??????????????????
                {this.props.navigatorLoading && (
                  <LoadingOutlined className="margin-left-16" />
                )}
              </span>
              {this.renderPartCollapseButton('??????????????????')}
            </h4>
            {this.state.partCollapseState['??????????????????'] !== false && (
              <div className="margin-top-8">
                {navigator.map(this.renderItem)}
              </div>
            )}
          </div>
          {this.state.showEditGroup && (
            <EditEntCustomGroup onCancel={this.handleHideEditGroup} />
          )}
          {this.state.showEditCompanyGroup && (
            <EditCompanyGroup onCancel={this.handleHideEditCompanyGroup} />
          )}
        </div>
      </ErrorBoundary>
    )
  }
}

export default AdvancedSearch
