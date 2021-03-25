import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { SearchOutlined } from '@ant-design/icons'
import { AutoComplete, Input } from 'antd'

import styles from './searchInput.less'

const { Option } = AutoComplete

export default class SearchInput extends React.PureComponent {
  static propTypes = {
    // onChange: PropTypes.func,
    onSearch: PropTypes.func.isRequired,
    autoFocus: PropTypes.bool,
    className: PropTypes.string,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    autoFocus: false,
    className: '',
    placeholder: '搜索人名、技能、职位、公司...',
    // onChange: () => {},
  }

  constructor(props) {
    super(props)

    this.state = {
      dataSource: [],
      value: '',
    }
  }

  getSearchResult = (value) => {
    const searchHistory = R.pathOr(
      '',
      ['localStorage', 'MaiEntSearchHistory'],
      window
    )

    const list = searchHistory.split(',').filter((item) => !R.isEmpty(item))

    if (!value) {
      return searchHistory ? list : []
    }

    return list.filter(R.contains(value))
  }

  handleChange = (value) => {
    // 取搜索历史的前 5 个作为 autocomplete 的选项
    const searchResult = this.getSearchResult(value)
    this.setState({
      dataSource: value
        ? R.uniq([value, ...searchResult]).slice(0, 5)
        : searchResult.slice(0, 5),
    })
    this.setState({
      value,
    })
  }

  handleSelect = (value) => {
    this.handleSearch(value)
  }

  handleSearch = (value) => {
    const search = R.trim(value)
    const history = R.pathOr(
      '',
      ['localStorage', 'MaiEntSearchHistory'],
      window
    )
    if (window.localStorage) {
      const res = R.uniq([search, ...history.split(',')]).join(',')
      window.localStorage.setItem('MaiEntSearchHistory', res)
    }
    this.setState({
      value: '',
    })
    this.props.onSearch(search)
  }

  renderOption = (item) => {
    return (
      <Option key={item} text={item}>
        {item}
      </Option>
    )
  }

  render() {
    return (
      <AutoComplete
        className={`global-search ${this.props.className}`}
        size="large"
        style={{ width: '100%' }}
        dataSource={this.state.dataSource.map(this.renderOption)}
        onSelect={this.handleSelect}
        onSearch={this.handleChange}
        optionLabelProp="text"
        backfill
        autoFocus={this.props.autoFocus}
        defaultValue={this.state.value}
      >
        <Input.Search
          placeholder={this.props.placeholder}
          size="large"
          enterButton={<SearchOutlined />}
          className={styles.input}
          onSearch={this.handleSearch}
        />
      </AutoComplete>
    )
  }
}
