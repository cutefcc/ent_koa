import React from 'react'
import styles from 'styled-components'
import * as echarts from 'echarts'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import TalentAnalysisConfig from './TalentAnalysisConfig'

const TalentAnalysisChartTemplateWrapper = styles.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`
const ChartWrapper = styles.div`
  width: 50%;
  height: auto;
`
const ChartTitleWrapper = styles.div`
  display: flex;
  color: #363D4D;
  margin-bottom: 10px;
  margin-top: 24px;
  font-size: 12px;
`
const ChartName = styles.div`
  font-size: 14px;
  width: 90.5%;
  font-weight: bold;
`
const ChartBtn = styles.div`
  cursor: pointer;
  width: 9.5%;
  line-height: 21px;
`
@connect((state) => ({
  config: state.global.config,
}))
export default class TalentAnalysisChartTemplate extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props)
    if (props.config && props.config.talent_lib_worktimes) {
      const workTimesMapObj = {}
      props.config.talent_lib_worktimes.forEach((item) => {
        workTimesMapObj[item.value] = item.label
      })
      this.state = {
        titleMap: {
          current_companys_analysis: '目前就职',
          ever_companys_analysis: '曾经就职',
          worktimes_analysis: '经验年限',
          schools_analysis: '就读学校',
          pfmj_analysis: '行业方向',
          province_city_analysis: '城市地区',
        },
        // 当前点击的列表与柱条数据
        currentClickChart: {
          chartItem: '',
          chartItemKey: '',
          chartItemValue: '',
          chartItemClickFlag: false,
        },
        workTimesMap: workTimesMapObj,
        // 每个图表的收起/更多显示flag
        showMoreOrNormal: {
          0: true,
          1: true,
          2: true,
          3: true,
          4: true,
          5: true,
        },
        // 处理完以后的表格数据
        allChartData: [],
      }
      TalentAnalysisConfig.defaultState = this.state
    }
  }
  componentDidMount() {
    this.handleProcessChartData()
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.data !== this.props.data ||
      nextProps.value !== this.props.value
    ) {
      TalentAnalysisConfig.handleUpdataCommonValue(this.state, nextProps.value)
      this.handleProcessChartData(nextProps.data)
    }
  }
  componentWillUnmount() {
    TalentAnalysisConfig.currentState = {}
    TalentAnalysisConfig.searchValue = {}
  }
  // 预处理接口返回数据为Echart所需数据格式
  handleProcessChartData = (newData) => {
    const Data = Object.assign({}, newData || this.props.data)
    const sortDataArr = TalentAnalysisConfig.handleProcessData(Data || {})
    this.setState({ allChartData: sortDataArr }, () => {
      sortDataArr.forEach((item) => {
        this.handleChartBtnShow(item)
        this.handleInitEchart(item)
      })
    })
  }
  // 初始化Ecahrt表格样式与绑定事件
  handleInitEchart = (chartData) => {
    const chartOption = TalentAnalysisConfig.handleChartOption(chartData)
    // 绘制图表。
    const timer = setInterval(() => {
      if (document.getElementById(`echartMain-${chartData.chartIndex}`)) {
        const myChart = echarts.init(
          document.getElementById(`echartMain-${chartData.chartIndex}`)
        )
        myChart.setOption(chartOption)
        myChart.on('click', (params) => {
          this.handleChartItemClick(params, chartData)
        })
        this.setState({
          // 初始绘图之后恢复显示
          showMoreOrNormal: {
            ...this.state.showMoreOrNormal,
            [chartData.chartIndex]: false,
          },
        })
        clearInterval(timer)
      }
    }, 100)
  }
  // 图表中柱条被点击 将点击的图表ID与当前点击的柱条值存储
  handleChartItemClick = (params) => {
    this.setState({
      currentClickChart: {
        ...this.state.currentClickChart,
        chartItemKey: params.name,
        chartItemValue: params.value,
        chartItemClickFlag: true,
      },
    })
  }
  // 图表中柱条被点击之后整个小图表模板冒泡事件 获取外部chart id并回调上传点击参数
  handleChartWrapClick = (record) => {
    const { value } = this.props
    const { currentClickChart } = this.state
    if (currentClickChart.chartItemClickFlag) {
      this.setState(
        {
          currentClickChart: {
            ...currentClickChart,
            chartItem: record.chartItem,
            chartItemClickFlag: false,
          },
        },
        () => {
          TalentAnalysisConfig.handleChartOption(
            record,
            this.state.currentClickChart,
            value
          )
          this.handleParamsUpdata()
        }
      )
    }
  }
  // 后端传参结构转换
  handleParamsUpdata = () => {
    const { value, onChange } = this.props
    const { currentClickChart, allChartData } = this.state
    const params = TalentAnalysisConfig.handleProcessParamsUpdata(
      value,
      currentClickChart,
      allChartData
    )
    onChange(params)
  }
  // 收起/更多 按钮点击事件
  handleChartBtnClick = (chartIndex) => {
    const { showMoreOrNormal } = this.state
    this.setState({
      showMoreOrNormal: {
        ...showMoreOrNormal,
        [chartIndex]: !showMoreOrNormal[chartIndex],
      },
    })
  }
  // 渲染表格高度
  handleCalculationHeight = (record) => {
    let Height = 0
    const Length = record.data.filter(
      (item) => item.count !== 0 && item.count !== '0'
    ).length
    if (this.state.showMoreOrNormal[record.chartIndex]) {
      // true为显示收起，展开状态
      Height = record.data.length * 24 + 8 * (record.data.length - 2)
    } else {
      // false为显示更多，收起状态
      Height = 152
      if (Length < 5) {
        Height = Length * 24 + 8 * Length
      }
    }
    return `${Height}px`
  }
  // 收起/更多/不展示按钮
  handleChartBtnShow = (record) => {
    let result = ''
    // 过滤count === 0的假数据
    const Length = record.data.filter(
      (item) => item.count !== 0 && item.count !== '0'
    ).length
    if (Length > 5) {
      result = this.state.showMoreOrNormal[record.chartIndex] ? '收起' : '更多'
    }
    return result
  }
  render() {
    return (
      <TalentAnalysisChartTemplateWrapper>
        {this.state.allChartData &&
          this.state.allChartData.length > 0 &&
          Object.keys(this.state.allChartData).map((item) => (
            <ChartWrapper key={this.state.allChartData[item].chartIndex}>
              <ChartTitleWrapper>
                <ChartName>
                  {this.state.titleMap[this.state.allChartData[item].chartItem]}
                </ChartName>
                {this.state.allChartData[item].chartItem !==
                  'worktimes_analysis' &&
                  this.handleChartBtnShow(this.state.allChartData[item]) && (
                    <ChartBtn
                      onClick={() =>
                        this.handleChartBtnClick(
                          this.state.allChartData[item].chartIndex
                        )
                      }
                    >
                      {this.handleChartBtnShow(this.state.allChartData[item])}
                    </ChartBtn>
                  )}
              </ChartTitleWrapper>
              {this.state.allChartData[item].data.filter(
                (dataItem) => dataItem.count !== 0 && dataItem.count !== '0'
              ).length === 0 && <div>未找到搜索结果</div>}
              <div
                id={`echartMain-${this.state.allChartData[item].chartIndex}`}
                onClick={() => {
                  this.handleChartWrapClick(this.state.allChartData[item])
                }}
                style={{
                  display: 'inline-block',
                  width: '100%',
                  overflow: 'hidden',
                  height: this.handleCalculationHeight(
                    this.state.allChartData[item]
                  ),
                }}
              />
            </ChartWrapper>
          ))}
      </TalentAnalysisChartTemplateWrapper>
    )
  }
}
