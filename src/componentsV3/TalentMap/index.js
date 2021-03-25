import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Modal, Button } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Checkbox } from 'mm-ent-ui'
import { fixed } from 'utils/numbers'
import {
  setIsIgnoreShowTalentMap,
  getIsIgnoreShowTalentMap,
} from 'utils/talentMap'
import * as styles from './index.less'
import EchartsBottom from './EchartsBottom'
import ReactEchartsCore from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'

@connect((state) => ({
  show: state.talentMap.show,
  totalList: state.talentMap.totalList,
  loading: state.talentMap.loading,
  dateList: state.talentMap.dateList,
  highlyEducatedList: state.talentMap.highlyEducatedList,
  topExperienceddateList: state.talentMap.topExperienceddateList,
  executivesList: state.talentMap.executivesList,
  fiveMoreYearsExperiencedList: state.talentMap.fiveMoreYearsExperiencedList,
  monthTotalList: state.talentMap.monthTotalList,
  growthRateList: state.talentMap.growthRateList,
}))
export default class TalentMap extends React.PureComponent {
  constructor(props) {
    super(props)
    this.echartsCommon = {
      highlyEducated: {
        name: '硕士以上高学历',
        color: '#3b7aff',
      },
      topExperienced: {
        name: '大厂&500强经验者',
        color: '#78c905',
      },
      executives: {
        name: '企业高管',
        color: '#ff4d3c',
      },
      fiveMoreYearsExperienced: {
        name: '5年以上工作经验者',
        color: '#ffa408',
      },
      growthRate: {
        name: '人才增长趋势',
        color: '#3b7add',
        isLine: true,
      },
    }
    this.state = {
      notShowNext: false,
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.show && !this.props.show) {
      const value = getIsIgnoreShowTalentMap()
      this.setState({
        notShowNext: value === '1',
      })
    }
  }

  handleClick = () => {
    window.open('/ent/v2/job/positions/publish')
  }

  onCancel = () => {
    this.props.dispatch({
      type: 'talentMap/setVisible',
      payload: false,
    })
    // 设置不再提示
    setIsIgnoreShowTalentMap(this.state.notShowNext ? '1' : '0')
  }

  onCheckBoxChange = () => {
    this.setState({
      notShowNext: !this.state.notShowNext,
    })
  }

  getOption = () => {
    const date = R.pathOr([], ['props', 'dateList'], this)
    const highlyEducated = R.pathOr([], ['props', 'highlyEducatedList'], this)
    const topExperienced = R.pathOr(
      [],
      ['props', 'topExperienceddateList'],
      this
    )
    const executives = R.pathOr([], ['props', 'executivesList'], this)
    const fiveMoreYearsExperienced = R.pathOr(
      [],
      ['props', 'fiveMoreYearsExperiencedList'],
      this
    )
    const growthRate = R.pathOr([], ['props', 'growthRateList'], this)
    const sumDataList = R.pathOr([], ['props', 'monthTotalList'], this)
    // 计算数据最大值，以将折线与柱状图分开距离
    let maxNum = 0
    for (let i = 0; i < date.length; i++) {
      const sum = R.add(
        R.add(highlyEducated[i], topExperienced[i]),
        R.add(executives[i], fiveMoreYearsExperienced[i])
      )
      if (maxNum < sum) {
        maxNum = sum
      }
    }
    return {
      tooltip: {
        trigger: 'axis',
        show: false,
        padding: 0,
      },
      legend: {
        show: false,
      },
      grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        containLabel: true,
      },
      toolbox: {
        feature: {
          saveAsImage: {
            show: false,
          },
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: ['10%', '10%'],
        axisLine: {
          lineStyle: {
            color: '#3b7aff',
          },
        },
        axisLabel: {
          interval: 0,
          padding: 0,
          showMinLabel: true,
          fontSize: 12,
          color: '#6e727a',
        },
        axisTick: {
          show: false,
        },
        data: date,
      },
      yAxis: [
        {
          type: 'value',
          splitNumber: 4,
          show: false,
          min: 0,
          max: maxNum + 150,
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
            },
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        {
          type: 'value',
          name: '同比增长',
          show: false,
          min: -1,
          max: 0.5,
          splitNumber: 4,
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dashed',
            },
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
          name: this.echartsCommon.executives.name,
          type: 'bar',
          stack: 'sum',
          id: 'executives',
          smooth: true,
          barWidth: 24,
          yAxisIndex: 0,
          itemStyle: {
            color: this.echartsCommon.executives.color,
          },
          data: executives,
        },
        {
          name: this.echartsCommon.fiveMoreYearsExperienced.name,
          type: 'bar',
          stack: 'sum',
          smooth: true,
          barWidth: 24,
          yAxisIndex: 0,
          itemStyle: {
            color: this.echartsCommon.fiveMoreYearsExperienced.color,
          },
          id: 'fiveMoreYearsExperienced',
          data: fiveMoreYearsExperienced,
        },
        {
          name: this.echartsCommon.topExperienced.name,
          type: 'bar',
          stack: 'sum',
          id: 'topExperienced',
          smooth: true,
          barWidth: 24,
          yAxisIndex: 0,
          itemStyle: {
            color: this.echartsCommon.topExperienced.color,
          },
          data: topExperienced,
        },
        {
          name: this.echartsCommon.highlyEducated.name,
          type: 'bar',
          stack: 'sum',
          id: 'highlyEducated',
          smooth: true,
          barWidth: 24,
          yAxisIndex: 0,
          itemStyle: {
            normal: {
              color: this.echartsCommon.highlyEducated.color,
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#6e727a',
                },
                formatter: (item) => sumDataList[item.dataIndex],
              },
            },
          },
          data: highlyEducated,
        },
        {
          name: this.echartsCommon.growthRate.name,
          type: 'line',
          symbol: 'circle',
          id: 'growthRate',
          smooth: false,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: this.echartsCommon.growthRate.color,
              lineStyle: {
                color: this.echartsCommon.growthRate.color,
              },
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  fontSize: '12px',
                  fontWeight: 400,
                  color: '#6e727a',
                },
                formatter: (item) => `${fixed(item.value * 100, 1)}%`,
              },
            },
          },
          data: growthRate,
        },
      ],
    }
  }

  getFooter = () => {
    return (
      <div className={styles.modalBottom}>
        <div className={styles.modalBottomLeft}>
          <Checkbox
            style={{ marginLeft: '8px' }}
            checked={this.state.notShowNext}
            onChange={this.onCheckBoxChange.bind(this)}
          >
            不再提示
          </Checkbox>
        </div>
        <div className={styles.modalBottomRight}>
          <span className={styles.showPublicTips}>
            获取更多人才，立刻发布职位
          </span>
          <Button
            onClick={this.handleClick.bind(this)}
            className={styles.bottomBtn}
          >
            立即发布
          </Button>
        </div>
      </div>
    )
  }

  render() {
    const show = R.pathOr(false, ['props', 'show'], this)
    const totalList = R.pathOr([], ['props', 'totalList'], this)
    const loading = R.pathOr([], ['props', 'loading'], this)

    if (loading) {
      return null
    }

    return (
      <Modal
        onCancel={this.onCancel.bind(this)}
        className={styles.modal}
        visible={show}
        width={560}
        maskClosable={true}
        footer={this.getFooter()}
      >
        {loading ? (
          <p className={styles.loadingTip}>
            <LoadingOutlined />
            加载中...
          </p>
        ) : (
          <div className={styles.modalContent}>
            <div className={styles.modalTitle}>脉脉中高端人才需求图谱</div>
            <div className={styles.modalSecondTitle}>
              <div className={styles.modalSecondTitleSymbol} />
              脉脉近期活跃的中高端人才分布
              <div className={styles.modalSecondTitleSymbol} />
            </div>
            <div className={styles.totalContent}>
              {totalList.map((item, index) => (
                <div className={styles.singleTotalContent} key={index}>
                  <div className={styles.singleTotalNum}>{`${item.num}万`}</div>
                  <div
                    className={styles.singleTotalTitle}
                  >{`${item.title}`}</div>
                </div>
              ))}
            </div>
            <div className={styles.modalSecondTitle}>
              <div className={styles.modalSecondTitleSymbol} />
              在脉脉求职的中高端人才规模
              <div className={styles.modalSecondTitleSymbol} />
            </div>
            <div className={styles.modalEchartsContent}>
              <ReactEchartsCore
                echarts={echarts}
                style={{ width: '100%', height: 300 }}
                option={this.getOption()}
                notMerge={false}
                lazyUpdate={false}
                theme={'theme_name'}
              />
            </div>
            <EchartsBottom echartsCommon={this.echartsCommon} />
          </div>
        )}
      </Modal>
    )
  }
}
