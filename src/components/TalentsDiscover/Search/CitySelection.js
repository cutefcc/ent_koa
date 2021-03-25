import React from 'react'
import { Radio } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import CityInput from './CityInput'

export default class City extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    defaultCities: PropTypes.array,
    // allCities: PropTypes.array,
    value: PropTypes.array,
  }

  static defaultProps = {
    defaultCities: [
      ['全部'],
      ['北京'],
      ['上海'],
      ['广东'],
      ['广东', '深圳'],
      ['浙江', '杭州'],
      ['重庆'],
      ['四川', '成都'],
      ['湖北', '武汉'],
    ],
    value: ['全部'],
  }

  constructor(props) {
    super(props)
    this.state = {
      extraCity: props.value,
    }
  }

  componentWillReceiveProps() {
    // if (newProps.value !== this.props.value) {
    //   // this.setState({
    //   //   value: this.getCityCompleteName(newProps.value) || '全部',
    //   // })
    //   this.set
    // }
  }

  handleDefaultCityChange = (e) => {
    this.props.onChange(e.target.value.split('-').filter((item) => !!item))
  }

  handleSelectChange = (value) => {
    const cond = R.cond([
      [() => value[0] === value[1], R.always([value[0]])],
      [
        () => value.length > 1,
        R.always([value[0], R.propOr('', 1, value[1].split('-'))]),
      ],
      [R.T, R.always(value)],
    ])

    const extraCity = cond()

    this.props.onChange(extraCity)
    this.setState({
      extraCity,
    })
  }

  render() {
    const { defaultCities, value } = this.props
    const { extraCity } = this.state

    const showCities = R.uniq([
      ...defaultCities,
      ...(extraCity ? [extraCity] : []),
    ])

    const getLabel = (item) => {
      const province = R.prop(0, item)
      const city = R.prop(1, item)
      if (city && city !== '全部') {
        return city
      }
      if (province === '全部') {
        return '全国'
      }
      return province
    }
    const labels = showCities.map((item) => (
      <Radio.Button key={item} value={item.join('-')}>
        {getLabel(item)}
      </Radio.Button>
    ))

    return (
      <div>
        <Radio.Group
          value={value.join('-')}
          buttonStyle="solid"
          onChange={this.handleDefaultCityChange}
        >
          {labels}
        </Radio.Group>
        <CityInput value={value} onChange={this.handleSelectChange} />
      </div>
    )
  }
}
