import * as React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import * as R from 'ramda'
import classnames from 'classnames'

import * as styles from './facetSelect.less'

export interface Props {
  options: Array<any>
  onChange: (value: string) => any
}

export interface State {
  searchKey: string
  activeOption: object
}

export default class FacetSelect extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      searchKey: '',
      activeOption: {},
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.options !== this.props.option) {
      this.setState({
        activeOption:
          newProps.options.find(
            (item) => item.value === this.state.activeOption.value
          ) || {},
      })
    }
  }

  getFilteredOptions = () => {
    const { options } = this.props
    const { searchKey } = this.state
    const search = R.trim(searchKey)
    if (search === '') {
      return options
    }
    const formatOptions =
      this.props.level === 2 ? this.getFlatternOptions() : options

    return formatOptions
      .filter((item) => {
        const { label } = item
        if (!label || !R.is(String, label)) {
          return false
        }
        return label.indexOf(search) !== -1
      })
      .slice(0, 10)
  }

  getFlatternOptions = () => {
    const { options } = this.props
    const mapChidren = (parent) => (child) => ({
      value: child.value,
      label: `${parent.label} / ${child.label}`,
    })
    const res = R.flatten(
      options.map((parent) => {
        return [
          {
            value: [parent.value],
            label: parent.label,
          },
          ...R.propOr([], 'children', parent).map(mapChidren(parent)),
        ]
      })
    )
    return res
  }

  handleSelect = (item) => () => {
    this.props.onChange(item.value)
    this.setState({
      searchKey: '',
    })
  }

  handleChildrenSelect = (item) => () => {
    this.props.onChange(item.value)
  }

  handlePressEnter = (e) => {
    if (this.props.mode === `tags`) {
      this.props.onChange(e.target.value)
    }
    this.setState({
      searchKey: '',
    })
  }

  handleSearchKeyChange = (e) => {
    const searchKey = R.trim(e.target.value)
    this.setState({
      searchKey,
    })
    if (this.props.onSearch) {
      this.props.onSearch(searchKey)
    }
  }

  handleSetActiveOption = (item) => () => {
    this.setState({
      activeOption: item,
    })
  }

  renderOptions = () => {
    if (this.props.loading) {
      return <LoadingOutlined />
    }

    const options = this.props.showSearch
      ? this.getFilteredOptions()
      : this.props.options

    if (!R.prop('length', options)) {
      return <li>??????????????????</li>
    }

    return options.map((item) => (
      <li
        key={item.value}
        className={classnames({
          [styles.option]: true,
          [styles.activeOption]: this.state.activeOption.value === item.value,
        })}
      >
        <span
          onClick={this.handleSelect(item)}
          onMouseEnter={this.handleSetActiveOption(item)}
        >
          {item.label}
        </span>
      </li>
    ))
  }

  renderSecondLevelOptions = () => {
    const { activeOption } = this.state
    const children = R.propOr([], 'children', activeOption)
    return children.map((item) => (
      <li key={item.value} className={styles.option}>
        <span onClick={this.handleChildrenSelect(item)}>{item.label}</span>
      </li>
    ))
  }

  render() {
    return (
      <div className={styles.facetSelect}>
        <Input
          placeholder={this.props.placeholder || '?????????'}
          onChange={this.handleSearchKeyChange}
          onPressEnter={this.handlePressEnter}
          value={this.state.searchKey}
          autoFocus
        />
        <div className={styles.options}>
          <ul>{this.renderOptions()}</ul>
          {this.props.level === 2 && this.state.searchKey === '' && (
            <ul>{this.renderSecondLevelOptions()}</ul>
          )}
        </div>
      </div>
    )
  }
}
