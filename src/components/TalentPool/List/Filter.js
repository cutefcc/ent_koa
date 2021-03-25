import React from 'react'
import { connect } from 'react-redux'
import { LoadingOutlined } from '@ant-design/icons'
import { Radio } from 'antd'
import * as R from 'ramda'
import PropTypes from 'prop-types'

import styles from './filter.less'
import commonStyles from './common.less'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

@connect((state) => ({
  loadingList: state.loading.effects['talentPool/fetchFilterOptions'],
}))
export default class Filter extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    value: '',
  }

  state = {
    list: [],
  }

  componentDidMount() {
    this.fetchList()
  }

  fetchList = () => {
    this.props
      .dispatch({
        type: 'talentPool/fetchFilterOptions',
      })
      .then((data) => {
        const list = R.propOr([], 'data', data)
        this.setState({
          list,
        })
        // if (!R.isEmpty(list)) {
        //   this.props.onChange(list[0].value)
        // }
      })
  }

  handleChange = (e) => {
    this.props.onChange(e.target.value)
  }

  render() {
    return (
      <div className={this.props.className} visible={this.props.filter}>
        <h5 key="title" className={`${commonStyles.title} filterTitle`}>
          动向雷达
          {this.props.loadingList && <LoadingOutlined />}
        </h5>
        <RadioGroup
          defaultValue="a"
          size="large"
          key="options"
          className={styles.options}
          onChange={this.handleChange}
          value={this.props.value}
        >
          {[...this.state.list, { value: -2, label: '全部' }].map((item) => (
            <RadioButton
              value={item.value}
              key={item.value}
              className={styles.item}
            >
              {item.label}
            </RadioButton>
          ))}
        </RadioGroup>
      </div>
    )
  }
}
