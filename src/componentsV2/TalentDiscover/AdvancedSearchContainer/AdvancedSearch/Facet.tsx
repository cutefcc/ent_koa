import * as React from 'react'
import { connect } from 'react-redux'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Select, Input, Button, Slider, message } from 'antd'
import classnames from 'classnames'
import * as $ from 'jquery'
import * as R from 'ramda'
import { isEmpty, trackEvent } from 'utils'
import FacetSelect from './FacetSelect'

import * as styles from './facet.less'

export interface Props {
  currentUser?: object

  title: string
  value: any
  inputType: string
  placeholder: string
  onChange: (value: any) => void
  inputProps: object
  auth: object
}

export interface State {}

@connect((state: any) => ({
  currentUser: state.global.currentUser,
  auth: state.global.auth,
}))
export default class Facet extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      showSelection: false,
      flatternOptions: this.getFlatternOptions(
        R.pathOr([], ['inputProps', 'options'], props)
      ),
      facetDom: undefined,
      tempValue: '',
    }
  }

  componentDidMount() {
    // console.log('Facet this.props', this.props);
  }

  componentWillReceiveProps(newProps) {
    const optionPath = ['inputProps', 'options']
    if (R.path(optionPath, newProps) !== R.path(optionPath, this.props)) {
      this.setState({
        flatternOptions: this.getFlatternOptions(
          R.pathOr([], optionPath, newProps)
        ),
      })
    }
    console.log(this.state.tempValue)
  }

  getMultipleValue = () => R.uniq(R.without([''], this.props.value.split(',')))

  getFlatternOptions = (options) => {
    const mapChidren = (child) => ({
      value: child.value,
      label: child.label,
    })
    const res = R.flatten(
      options.map((parent) => {
        return [
          {
            value: parent.value,
            label: parent.label,
          },
          ...R.propOr([], 'children', parent).map(mapChidren),
        ]
      })
    )
    return res
  }

  getFacetSelectionOptions = () => {
    const {
      inputProps: { options = [] },
      value,
      multiple,
    } = this.props
    const valueList = multiple ? this.getMultipleValue() : [value]
    const isUnSelectedOption = (option) => {
      const isSelected = valueList
        .map((v) => `${v}`)
        .includes(`${option.value}`)
      return !isSelected
    }

    return options.reduce((res, option) => {
      if (!isUnSelectedOption(option)) {
        return res
      }
      const children = R.prop('children', option)
      if (R.is(Array, children)) {
        const childrenRes = children.filter(isUnSelectedOption)
        return [
          ...res,
          {
            ...option,
            children: childrenRes,
          },
        ]
      }
      return [...res, option]
    }, [])
  }

  setCurrentDom = (facetDom) => this.setState({ facetDom })

  handleRemoveValue = (value) => () => {
    const { multiple, onChange } = this.props
    this.handleTempValueChange('') // 同时清除tempValue
    if (!onChange) {
      return
    }

    if (multiple) {
      const values = this.getMultipleValue()
      onChange(R.without([value], values).join(','))
      return
    }

    onChange('')
  }

  handleAddValue = (value) => {
    const { auth } = this.props
    const values = this.getMultipleValue()

    if (values.length >= 10) {
      message.warning('最多添加十个条件')
      return
    }
    // 个人用户只能添加一个筛选条件
    if (auth.limitAdvancedMultipleSearch && values.length > 0) {
      this.props.dispatch({
        type: 'global/setMemberOpenTip',
        payload: {
          show: true,
          msg: '开通招聘企业版 解锁更多功能',
          cancelTxt: '放弃开通',
          confirmTxt: '立即开通',
        },
      })
      return
    }

    const onChange = R.prop('onChange', this.props)
    if (onChange) {
      onChange([...values, value].join(','))
    }
  }

  handleSubmitEditValue = () => {
    const onChange = R.prop('onChange', this.props)
    if (onChange) {
      onChange(this.state.tempValue)
    }
    this.handleHideSelection()
  }

  handleShowSelection = () => {
    const { title } = this.props
    const clickEventName = `click.${title}`
    this.setState({
      showSelection: true,
    })
    trackEvent('jobs_pc_talent_discover_advance_search_click', { type: title })
    // hide selection when click other region
    setTimeout(() => {
      $('body').bind(clickEventName, (e) => {
        const dom = $(e.target)
        const parents = dom.parents()
        const facetDoms = Array.from(parents).filter((item) =>
          Array.from(item.classList).includes(`facet${title}`)
        )
        if (facetDoms.length === 0) {
          this.setState({
            showSelection: false,
          })
          $('body').unbind(clickEventName)
        }
      })
    }, 0)
  }

  handleHideSelection = () => {
    this.setState({
      showSelection: false,
    })
  }

  handleTempValueChange = (tempValue) => {
    this.setState({
      tempValue,
    })
  }

  handleEditValue = () => {
    this.setState({
      tempValue: this.props.value,
    })
    this.showSelection()
  }

  handleShowTipToOpenMember = () => {
    this.props.dispatch({
      type: 'global/setMemberOpenTip',
      payload: {
        show: true,
        msg: '开通招聘企业版 解锁更多功能',
        cancelTxt: '放弃开通',
        confirmTxt: '立即开通',
      },
    })
  }

  formatShowValue = () => {
    const { inputType, value } = this.props
    if (inputType === 'slider') {
      if (value[0] === undefined || value[1] === undefined) {
        return ''
      }
      return `${R.propOr('', 0, value)}~${R.propOr('', 1, value)}`
    }
    return value ? value : ''
  }

  renderExtraParam = () => {
    const {
      extraParam: { options = [], onChange = () => {}, value = '' },
    } = this.props
    return (
      <Select
        onChange={onChange}
        className={`extraParam${this.props.title}`}
        getPopupContainer={() => this.state.facetDom}
        value={value}
        style={this.props.title === '就职公司' ? { minWidth: '125px' } : {}}
      >
        {options.map((item) => (
          <Select.Option key={item.value} value={item.value}>
            {item.label}
          </Select.Option>
        ))}
      </Select>
    )
  }

  renderInput = () => {
    const { inputType } = this.props
    const renderFunc = {
      select: () => (
        <FacetSelect
          {...this.props.inputProps}
          onChange={this.handleAddValue}
          options={this.getFacetSelectionOptions()}
        />
      ),
      input: () => (
        <span>
          <Input
            {...this.props.inputProps}
            onChange={(e) => this.handleTempValueChange(e.target.value)}
            onPressEnter={this.handleSubmitEditValue}
            value={this.state.tempValue || ''}
            autoFocus
          />
          <Button onClick={this.handleSubmitEditValue} className="margin-top-8">
            提交
          </Button>
        </span>
      ),
      slider: () => (
        <span>
          <Slider
            {...this.props.inputProps}
            onChange={this.handleTempValueChange}
            value={this.state.tempValue || [0, 50]}
            autoFocus
          />
          <Button onClick={this.handleSubmitEditValue}>提交</Button>
        </span>
      ),
    }
    return renderFunc[inputType]()
  }

  renderValueLabel = (v) => {
    const { inputType } = this.props
    const { flatternOptions } = this.state
    let label = v

    if (isEmpty(v)) {
      return null
    }

    if (inputType === 'select') {
      const option = R.find(
        (item) => `${item.value}` === `${v}`,
        flatternOptions
      )
      if (!option && this.props.inputProps.mode !== 'tags') {
        return null
      }

      label = R.propOr(v, 'label', option)
    }

    return (
      <span key={label} className={`${styles.valueItem}`}>
        <span className={`${styles.value} ellipsis`}>{label}</span>
        <span className={styles.close} onClick={this.handleRemoveValue(v)}>
          <img
            style={{ width: '8px' }}
            src="https://i9.taou.com/maimai/p/24560/9180_53_3b6W31j7zrdziJ"
          />
        </span>
      </span>
    )
  }

  renderValues = () => {
    return this.props.multiple
      ? this.renderMutipleValues()
      : this.renderSingleValue()
  }

  renderSingleValue = () => {
    const value = this.formatShowValue()
    const empty = isEmpty(value)

    if (this.state.showSelection) {
      return null
    }

    const editButton = (
      <span
        onClick={this.handleShowSelection}
        key="add"
        className={styles.addConditionButton}
      >
        {empty && (
          <span>
            <PlusOutlined />
            <span className={styles.placeholder}>{this.props.placeholder}</span>
          </span>
        )}
        {!empty && (
          <span onClick={this.handleEditValue}>
            <EditOutlined />
          </span>
        )}
      </span>
    )
    return [
      this.renderValueLabel(value),
      this.state.showSelection || value.length >= 10 ? null : editButton,
      // editButton,
    ]
  }

  renderMutipleValues = () => {
    const { auth } = this.props
    const value = this.getMultipleValue()
    const empty = value.length === 0
    const clickFunc =
      auth.limitAdvancedMultipleSearch && !empty
        ? this.handleShowTipToOpenMember
        : this.handleShowSelection

    const plusButton = (
      <span onClick={clickFunc} key="add" className={styles.addConditionButton}>
        <PlusOutlined />
        {empty && (
          <span className={styles.placeholder}>{this.props.placeholder}</span>
        )}
      </span>
    )
    return [
      ...value.map(this.renderValueLabel),
      this.state.showSelection || value.length >= 10 ? null : plusButton,
    ]
  }

  render() {
    const { title, extraParam } = this.props
    const showExtraParam =
      extraParam !== undefined &&
      (this.state.showSelection || !isEmpty(this.props.value))
    return (
      <div
        className={classnames({
          [styles.facet]: true,
          [styles.facetActive]: this.state.showSelection,
        })}
        ref={this.setCurrentDom}
      >
        <div className={styles.header}>
          <h4 className={styles.title}>{title}</h4>
          {showExtraParam && this.renderExtraParam()}
        </div>
        <div className={styles.values}>{this.renderValues()}</div>
        {this.state.showSelection && (
          <div className={styles.selection}>{this.renderInput()}</div>
        )}
      </div>
    )
  }
}
