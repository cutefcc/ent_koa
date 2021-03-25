import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import classnames from 'classnames'
import { Icon } from 'mm-ent-ui'

import * as styles from './list.less'

const showEditKeys = ['user_group', 'company_group', 'attention']
const showTextMap = {
  user_group: '编辑分组',
  company_group: '编辑分组',
  attention: '添加关注',
}

export interface Props {
  currentGroup: object
  data: object
  onChangeCurrentGroup: Function
  onHandleShowEdit: Function
  style: object
  showTotal: boolean // 是否展示数字
  strongIntentions: object
  auth: object
}

@connect((state) => ({
  currentGroup: state.talentDiscover.currentGroup,
  strongIntentions: state.talentDiscover.strongIntentions,
  auth: state.global.auth,
}))
export default class List extends React.Component<Props> {
  hanleCurrentGroupChange = (option) => (e) => {
    e.stopPropagation()
    if (option.key) {
      const list = R.pathOr(
        [],
        ['strong_intentions'],
        this.props.strongIntentions
      )
      const find = R.find(R.propEq('key', option.key))(list)
      if (find) {
        this.props.dispatch({
          type: 'talentDiscover/setViewedStrong',
          payload: find,
        })
      }
    }
    const { onChangeCurrentGroup } = this.props
    if (onChangeCurrentGroup) {
      const { key, title } = this.props.data
      onChangeCurrentGroup(option, { parentTitle: title, parentKey: key })
    }
  }

  showEditModal = (key) => () => {
    this.props.onHandleShowEdit(key)
  }

  renderEditIcon = () => {
    const { data, auth } = this.props
    const { key } = data
    const showEditIcon = showEditKeys.includes(key)
    if (!showEditIcon) {
      return null
    }
    if (key === 'attention' && auth.limitFollowCompany) {
      return null
    }
    return (
      <span
        className={`${styles.edit} cursor-pointer`}
        onClick={this.showEditModal(key)}
      >
        {showTextMap[key]}
        <Icon className={'margin-left-5'} type="icon_edit" />
      </span>
    )
  }

  renderOption = (option) => {
    const { currentGroup = {}, showTotal } = this.props
    const { key, title, total, action_code } = option || {}
    const isActive =
      R.equals(currentGroup.title, option.title) &&
      R.equals(currentGroup.post_param, option.post_param)

    return (
      <div
        className={classnames({
          'space-between': true,
          flex: true,
          [styles.active]: isActive,
          [styles.item]: true,
        })}
        onClick={this.hanleCurrentGroupChange(option)}
      >
        {
          <div className={'flex space-between width-p100'}>
            <span
              key={key || title}
              className={`${
                action_code !== 1 ? styles.title : styles.titleLong
              } cursor-pointer text-ellipsis`}
              title={`${title}${action_code === 1 ? '(开通后可见)' : ''}`}
            >
              {title || '-'}
              {action_code === 1 && <span>(开通后可见)</span>}
            </span>
            {action_code !== 1 && (
              <span className={styles.num}>{showTotal ? total || 0 : '-'}</span>
            )}
          </div>
        }
      </div>
    )
  }

  render() {
    const { data, style = {}, currentGroup } = this.props
    const { key, title, total, options = [] } = data
    const isActive = R.equals(currentGroup.title, title)
    return (
      <div
        key={key || title}
        className={`flex flex-column flex-align-start flex-justify-start ${styles.groupItemWrapper}`}
        style={style}
      >
        <div
          onClick={this.hanleCurrentGroupChange(data)}
          className={classnames({
            'space-between': true,
            flex: true,
            'cursor-pointer': true,
            [styles.itemTitle]: true,
            [styles.active]: isActive,
          })}
        >
          <span className={styles.title}>{title}</span>
          <span className={styles.total}>{total}</span>
        </div>
        <div
          className={`flex flex-column flex-justify-start ${styles.itemContent}`}
        >
          {options.length > 0 && options.map(this.renderOption)}
          {this.renderEditIcon()}
        </div>
        <div className={styles.gap}></div>
      </div>
    )
  }
}
