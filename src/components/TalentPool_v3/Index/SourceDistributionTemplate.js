/**
 * 人才库人才来源分布图表
 */
import React from 'react'
import PropTypes from 'prop-types'
import styles from 'styled-components'
import * as echarts from 'echarts'
import { connect } from 'react-redux'

const SourceDistributionTemplateWrapper = styles.div`
  padding: 16px;
  background-color: #eee;
`
const HeaderWrapper = styles.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  font-size: 14px;
  border-bottom: 1px solid rgba(238,238,238,1);
`
const HeaderTitle = styles.div`
  color: #363D4D;
  font-family: PingFangSC-Medium;
  font-weight: 500;
`
@connect((state) => ({
  loading: state.loading.effects['talentPool/fetchSourceDistributionService'],
}))
export default class SourceDistributionTemplate extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
  }
  static defaultProps = {
    className: '',
  }
  state = {
    sourceDistributionData: {},
  }
  componentDidMount() {
    this.handGetData()
  }
  // 请求图表数据
  handGetData = () => {
    this.props
      .dispatch({
        type: 'talentPool/fetchSourceDistributionService',
      })
      .then((data) => {
        this.setState(
          {
            sourceDistributionData: data.data,
          },
          () => {
            this.handleInitEchart()
          }
        )
      })
  }
  // 美化数据显示
  handleFormatNumber = (record, splitNumber) => {
    let count = 0
    const formatArr = []
    record
      .toString()
      .split('')
      .reverse()
      .forEach((item) => {
        if (count === splitNumber) {
          formatArr.push(',')
          count = 0
        }
        count += 1
        formatArr.push(item)
      })
    return formatArr.reverse().join('')
  }
  // 初始化表格配置
  handleInitEchart = () => {
    const { sourceDistributionData } = this.state
    const all = Math.ceil(
      Math.max(...sourceDistributionData.list.map((item) => item.count)) * 2
    )
    // 绘制图表。
    const chartOption = {
      tooltip: {
        confine: true,
        formatter: (params) => {
          return `${params.name}:  ${this.handleFormatNumber(params.value, 3)}`
        },
      },
      grid: [
        {
          left: 0,
          right: '3%',
          top: 13,
          bottom: 0,
          containLabel: true,
          borderColor: 'transparent',
        },
        {
          top: '55%',
          width: '50%',
          bottom: 0,
          left: 10,
          containLabel: true,
        },
      ],
      xAxis: [
        {
          type: 'value',
          max: all,
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'category',
          data: sourceDistributionData.list.map((item) => item.name),
          z: 100,
          inverse: true,
          axisLabel: {
            fontSize: 12,
            color: '#666F80',
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
      ],
      series: [
        {
          type: 'bar',
          stack: 'chart',
          z: 3,
          label: {
            position: 'right',
            show: true,
            color: '#666F80',
            formatter: (params) => {
              return `${
                sourceDistributionData.list[params.dataIndex].count
              }人，${sourceDistributionData.list[params.dataIndex].percent}`
            },
          },
          barWidth: '10px',
          itemStyle: {
            barBorderRadius: 20,
            color: '#6A9BFF',
          },
          data: sourceDistributionData.list.map((item) => item.count),
        },
        {
          type: 'bar',
          stack: 'chart',
          silent: true,
          itemStyle: {
            normal: {
              color: 'transparent',
            },
          },
          data: sourceDistributionData.list.map((item) => {
            return all - item.count
          }),
        },
      ],
    }
    const Timer = setInterval(() => {
      if (
        document.querySelector('#echartMainSourceDistributionTemplateEchart')
      ) {
        const myChart = echarts.init(
          document.querySelector('#echartMainSourceDistributionTemplateEchart')
        )
        myChart.setOption(chartOption)
        clearInterval(Timer)
      }
    }, 100)
  }

  render() {
    return (
      <SourceDistributionTemplateWrapper className={this.props.className}>
        <HeaderWrapper>
          <HeaderTitle>人才来源分布</HeaderTitle>
        </HeaderWrapper>
        <div
          id="echartMainSourceDistributionTemplateEchart"
          style={{
            display: 'inline-block',
            width: '100%',
            height: 'calc(100% - 48px)',
            overflow: 'hidden',
          }}
        />
      </SourceDistributionTemplateWrapper>
    )
  }
}
