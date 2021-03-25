import React from 'react'
import { Select } from 'antd'
import { PropTypes } from 'prop-types'
import { connect } from 'react-redux'
import * as R from 'ramda'

import { DEFAULT_POSITION_OPTIONS } from 'constants'

@connect()
export default class PositionSelection extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  }

  state = {
    sugs: DEFAULT_POSITION_OPTIONS.map((item) => ({ name: item.label })),
    currentVal: '',
  }

  getOptions = (values) => {
    return values.map((item) => (
      <Select.Option
        value={item.value === 0 ? item.value : item.value || item.name}
        key={item.value || item.name}
      >
        {item.label || item.name}
      </Select.Option>
    ))
  }

  handleSearch = (currentVal) => {
    this.setState(
      {
        currentVal,
      },
      () => {
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.timer = setTimeout(this.fetchSugs, 400)
      }
    )
  }

  fetchSugs = () => {
    this.props
      .dispatch({
        type: 'global/fetchPositionSugs',
        payload: {
          keyword: this.state.currentVal,
        },
      })
      .then(({ data }) => {
        this.setState({
          sugs: data || [],
        })
      })
  }

  render() {
    return (
      <Select
        placeholder="职位技能"
        onChange={this.props.onChange}
        onSearch={this.handleSearch}
        disabled={this.props.disabled}
        // className={styles.select}
        filterOption={false}
        value={this.props.value}
        getPopupContainer={() => this.props.wrapperDom || document.body}
        notFoundContent=""
        showSearch
        allowClear
        mode="multiple"
        showArrow
      >
        {this.getOptions(
          R.uniqBy(R.prop('name'), [
            ...(this.state.currentVal
              ? [{ name: this.state.currentVal, cid: -1 }]
              : []),
            ...this.state.sugs,
          ])
        )}
      </Select>
    )
  }
}
