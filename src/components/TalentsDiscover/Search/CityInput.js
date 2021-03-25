import React from 'react'
import { connect } from 'react-redux'
import { Cascader } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { MUNICIPALITY } from 'constants'

@connect((state) => ({
  dictionary: state.global.dictionary || {},
}))
export default class CityInput extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.array,
    className: PropTypes.string,
  }

  static defaultProps = {
    value: ['全部'],
    className: '',
  }

  getOptions = () => {
    // const {loc = []} = this.props.dictionary
    // const getCityOption = ({city}) => ({
    //   value: city,
    //   label: city,
    // })
    // return [
    //   {
    //     value: '全部',
    //     label: '全国',
    //   },
    //   ...loc.map(({province, cities = []}) => ({
    //     value: province,
    //     label: province,
    //     children: [{city: '全部'}, ...cities].map(getCityOption),
    //   })),
    // ]
  }

  getOptions = () => {
    const { loc = [] } = this.props.dictionary

    const getCityOption = (province) => ({ city }) => ({
      value: `${province}-${city}`,
      label: city,
    })

    return [
      {
        label: '全国',
        value: '全部',
      },
      ...loc.map(({ province, cities = [] }) => ({
        value: province,
        label: province,
        children: MUNICIPALITY.includes(province)
          ? [
              {
                value: province,
                label: province,
              },
            ]
          : [
              {
                value: `${province}-全部`,
                label: '全部',
              },
              ...cities.map(getCityOption(province)),
            ],
      })),
    ]
  }

  handleDefaultCityChange = (e) => {
    this.props.onChange(e.target.value.split('-'))
  }

  handleSelectChange = (value) => {
    this.props.onChange(R.isEmpty(value) ? ['全部'] : value)
  }

  render() {
    const { value } = this.props

    const style = { width: '100%' }

    return (
      <Cascader
        options={this.getOptions()}
        style={style}
        size="large"
        onChange={this.handleSelectChange}
        changeOnSelect
        expandTrigger="hover"
        placeholder="请选择省份/城市"
        value={value}
        showSearch
        className={this.props.className}
      />
    )
  }
}
