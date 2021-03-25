import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import EditCustomGroup from 'componentsV2/TalentDiscover/GroupsContainer/EditCustomGroup'
import * as R from 'ramda'

// 个人分组，个数上限
export const GROUP_UPPER_LIMIT = 50
// 企业分组，个数上限
export const ENT_GROUP_UPPER_LIMIT = 20
// 个人分组，每个分组人数上限
export const GROUP_NUM_CAP = 100
// 企业分组，每个分组人数上限
export const ENT_GROUP_NUM_CAP = 1000

export default class GroupUi extends React.PureComponent {
  static propTypes = {
    talents: PropTypes.array.isRequired,
    groups: PropTypes.object,
    defaultValue: PropTypes.object,
    value: PropTypes.object,
    className: PropTypes.string,
    onChange: PropTypes.func,
    isEditMode: PropTypes.bool,
  }

  static defaultProps = {
    groups: {},
    defaultValue: {},
    value: {},
    className: '',
    onChange: () => {},
    isEditMode: false,
    showAddGroupType: '',
  }

  constructor(props) {
    super(props)
    const { entGroups = [], personalGroups = [] } =
      props.value || props.defaultValue
    this.state = {
      // true是v3
      editionThree: window.location.pathname.indexOf('v3') !== -1,
      isEditMode:
        props.talents.length === 1 &&
        (entGroups.length || personalGroups.length),
      personalCheckedValue: personalGroups,
      entCheckedValue: entGroups,
      defaultGroups: entGroups.concat(personalGroups),
      errorMsg: '',
    }
  }
  getErrorMsg = () => {
    let {
      personalCheckedValue = [],
      entCheckedValue = [],
      isEditMode,
    } = this.state
    isEditMode = isEditMode || this.props.isEditMode
    if (this.isControl()) {
      personalCheckedValue = this.props.value.personalGroups
      entCheckedValue = this.props.value.entGroups
    }
    if (!personalCheckedValue.length && !entCheckedValue.length && isEditMode) {
      return '当前未选中任何分组，点击确定后该人才将被移出储备'
    }

    return ''
  }

  // 完全受控
  isControl = () =>
    !!(this.props.value.entGroups || this.props.value.personalGroups)

  handleGroupChange = (type, value) => () => {
    const { personalGroups, entGroups } = this.props.value
    const { personalCheckedValue, entCheckedValue } = this.state
    const isControl = this.isControl()
    const preCheckedValue = isControl
      ? this.props.value[`${type}Groups`]
      : this.state[`${type}CheckedValue`]

    const newGroups = preCheckedValue.includes(value)
      ? preCheckedValue.filter((v) => v !== value)
      : [...preCheckedValue, value]

    if (this.props.onChange) {
      this.props.onChange({
        entGroups: isControl ? entGroups : entCheckedValue,
        personalGroups: isControl ? personalGroups : personalCheckedValue,
        [`${type}Groups`]: newGroups,
      })
    }
    this.setState(
      {
        [[`${type}CheckedValue`]]: newGroups,
      },
      () => {
        this.setState({
          errorMsg: this.getErrorMsg(),
        })
      }
    )
  }
  renderGroup = (type) => (item) => {
    let isChecked = this.state[`${type}CheckedValue`].includes(item.id)
    if (this.isControl()) {
      const value = this.props.value[`${type}Groups`]
      isChecked = value.includes(item.id)
    }
    const defaultChecked = this.state.defaultGroups.includes(item.id)
    const max = type === 'ent' ? ENT_GROUP_NUM_CAP : GROUP_NUM_CAP
    const rest = max - (item.talents_num || item.total || item.total_selected)
    const disabled = rest < this.props.talents.length && !defaultChecked
    return this.state.editionThree ? (
      <span
        className={`${styles.groupItem} ${
          isChecked ? styles.activeGroupItem : ''
        }`}
        key={item.id}
        onClick={this.handleGroupChange(type, item.id)}
      >
        {item.name || item.title || '-'}
      </span>
    ) : (
      <span
        className={`${styles.groupItem} ${
          disabled ? styles.groupDisabled : ''
        } ${isChecked ? styles.activeGroupItem : ''}`}
        key={item.id}
        onClick={!disabled ? this.handleGroupChange(type, item.id) : null}
        title={disabled ? '该分组人数已达上限' : ''}
      >
        {item.name || item.title || '-'}
      </span>
    )
  }

  addGroup = (value) => {
    const { showAddGroupType = '' } = this.state
    if (value !== showAddGroupType) {
      this.setState({ showAddGroupType: value })
    }
  }

  isAdmin = () => R.pathOr(0, ['ucard', 'is_adm'], this.props.currentUser) === 1

  onClose = () => {
    const { fetchEntGroupList } = this.props
    if (fetchEntGroupList) fetchEntGroupList()
    this.setState({ showAddGroupType: '' })
  }
  render() {
    const { className, groups, currentUser } = this.props
    const { personalGroups, entGroups } = groups
    const { showAddGroupType = '' } = this.state

    return (
      <div className={`${styles.main} ${className} `}>
        <div className={styles.content}>
          {showAddGroupType !== '' && (
            <EditCustomGroup
              currentUser={currentUser}
              type={showAddGroupType}
              onCancel={this.onClose}
              canDelete={this.isAdmin()}
            />
          )}
          <div>
            <h4 className={styles.subtitle}>
              个人人才分组{' '}
              <span
                onClick={() => {
                  this.addGroup('personal')
                }}
              >
                编辑
              </span>
            </h4>
            {personalGroups.length ? (
              personalGroups.map(this.renderGroup('personal'))
            ) : (
              <p className={styles.emptyTip}>暂无分组</p>
            )}
          </div>
          <div className={styles.personalGroup}>
            <h4 className={styles.subtitle}>
              企业人才分组{' '}
              <span
                onClick={() => {
                  this.addGroup('ent')
                }}
              >
                编辑
              </span>
            </h4>
            {entGroups.length ? (
              entGroups.map(this.renderGroup('ent'))
            ) : (
              <p className={styles.emptyTip}>暂无分组</p>
            )}
          </div>
        </div>
        {this.state.errorMsg && (
          <span key="errorMsg" className={styles.errorTip}>
            {this.state.errorMsg}
          </span>
        )}
      </div>
    )
  }
}
