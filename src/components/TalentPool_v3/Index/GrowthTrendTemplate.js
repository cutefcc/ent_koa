/**
 * 人才库人数增长走势
 */
import React from 'react'
import PropTypes from 'prop-types'
import styles from 'styled-components'
import * as echarts from 'echarts'
import { connect } from 'react-redux'

const GrowthTrendTemplateWrapper = styles.div`
  padding: 16px;
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
const HeaderActionBox = styles.div`
  display: flex;
  color: #666F80;
  .active {
    color: #276FFF;
  }
  .actionBoxItem {
    margin-left: 32px;
    cursor: pointer;
  }
`
@connect((state) => ({
  loading: state.loading.effects['talentPool/fetchGrownTrendService'],
}))
export default class GrowthTrendTemplate extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
  }
  static defaultProps = {
    className: '',
  }
  state = {
    growthTrendData: {},
    currentPeriod: '',
  }
  componentDidMount() {
    this.handGetData()
  }
  // 请求图表数据
  handGetData = (type = 'day') => {
    this.props
      .dispatch({
        type: 'talentPool/fetchGrownTrendService',
        payload: { period: type },
      })
      .then((data) => {
        this.setState(
          {
            growthTrendData: data.data,
          },
          () => {
            this.handleInitEchart()
          }
        )
      })
  }
  // 初始化表格配置
  handleInitEchart = () => {
    const { growthTrendData, currentPeriod } = this.state
    // 绘制图表。
    const chartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#6A9BFF',
          },
          label: {
            backgroundColor: 'rgba(15, 21, 43, 0.7)',
          },
        },
        backgroundColor: 'rgba(15, 21, 43, 0.8)',
        padding: 16,
        formatter: '{b} 新增{c}人',
        textStyle: {
          fontSize: 12,
          fontWeight: 500,
        },
      },
      grid: {
        left: currentPeriod === 'week' ? '2%' : 0,
        right: '3%',
        top: 28,
        bottom: 0,
        containLabel: true,
        borderColor: 'transparent',
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: growthTrendData.list.map((item) => item.name),
          axisLabel: {
            interval: currentPeriod === 'week' ? 1 : 0,
            color: '#999999',
          },
          axisLine: {
            lineStyle: {
              color: '#EEEEEE',
            },
          },
          axisTick: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: '#999999',
            formatter: (value) => {
              let result = value
              if (value >= 1000) {
                result = value / 1000
                return `${result}k`
              }
              return result
            },
            margin: 14,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#eeeeee',
              type: 'dotted',
            },
          },
        },
      ],
      series: [
        {
          type: 'line',
          stack: '总量',
          smooth: true,
          label: {
            show: false,
          },
          symbol:
            'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAIg0lEQVRYR72YC3BUVx3Gv3Puzd5sNksSSCS0efGyRR6phFIsKsEWQmekSG1olIa2VnlZO2WsaDt2gNGplTpD1QpNtWhJGXmIFHCmpRRJHamVJpSn0AIhLyGZBfLY3ezezb3nOOeePbm7SyCK6E5mcvecvef+9vu+/3ksgXhxTpz/qa81awiwSrae3E6AShz9IdKLi/tu83rTRhKCLAB+QuCXwyAIIMg5uiORvvPNzWkfl/4YUWA7ML6Sy4HWAKtWxa9THkgIJwPCDABypSY2LjPTM5VoKAIDHfALpDZSMG6jJRSKHRq6xHPq3wG7GmgNpFpxRdp/iaLsbHuWpmkFopkxFlfTZVJtlNKEb86cYVSbbdttXV3avvzvoCUJbBWS1HKBlCpxkMU5DXTdujsqPB5taiKEc+2w0AS4ZGkkBHP++q/jcLGYfWjFiiN7X+0sYy6Ya6MESoE5sBzeadNRqROMFACM4SoILtqu8yJUfvNkOHDx3uI4/8FBbJ+5HpFUKILVq6kTXKFMII/sWjHBW3Hf0G8QjlxHBcSBRGjjEIwL2waLEQMl0kIXDpxCqscJLu1968rGeetORJAX4DL0Ii+rOVUwlXl5dNPm8QspZ6OkKtIWF0Sq4vRJ166yzVFExkfcLlUi8r8Ak/3M6WOENi5aeHLz9kCAKSiCym2aUAZBP+n5yx1zDF2b6qoi7mKEcRCZI6lYojqiP9E5khJspYgAEWCyXwKJPtOyDw354pG34Q9yAUVQyTU0NtAzOycUFQ03HlUwQhVljVBEgbgAFDEbdP9xXtTYQXO7wsgUYNk+hEbl88A9E1irRwPrBwDlUjFppVRLQrV0mL8bO/9EC0aVMYJyriPvJA3XjnuMEhSKh0uYuCqObaItrhBj5GIX8W6so9OOnicTYjaMgbLt0WCWjuQnvvkl/rcR2SwiwBwgxy6lloRiHK2+6lO/RWA8I1jM01p/hHG5Q9gChmQY8V7Ykwiz40MydutBbU7MGhgkFc6jw6z6An/rwTvtM65aMkvSQqES+KUeuq3wOZwSlnnCm7CIUpQIJWzbotIiF0aFeMM+vWzvUZSLfKoHaxQYVwCMyJEtFzuBU22AHQ92/HO8opTXfbvCrk+GAtc0nTkqMTT5FmETqdl2JevhuVlPi2LotwrCLmmTgtnxoTa29j1yv4Ix0oCqzwML7gayMpJ16e4Ftr0PbPkrYPb19/HqGfbuyrv4J8o+oYxSSRTvG3u6f0YaW3unDs815rm5keokwlzoJBlPva49rmzKHQL8tBq47Zbrr2gfXwC+Xwtc6pGfE/b9/FH7N7cO5b0OlAASlsWt67hk7iJXglaVoZOJAsiyGVU5UkuDCPfzO/Xy+kaUiUGFMusXDw6jUAXU8lddpe4cwxuee4D/WVSbyo+uUSauTYsfJ1091mJdIyWyqpQ67rxj9jGt+mV9uaqmR2YC37r3+sqk9v76XeD1A3GVNJibn7R+ZaRRWwEplSybN5GekP1dSjBMAFmMyRz1LxEg7xwjxa/s0x4Uw4kA737m6swMhicydf9P3KAvm21vr5jEmwWIgNIpZcI2xnGZBMP2as6ZwRhNyY7YzDBSs18r23uEiMrChCLglSWDPX7g/qU1wIkW2VdRigPLZlkNEkhliXFCqBkHgpFql1BM3PzCm9qMQ+fIFHE9qxRYteDGgNZsA/YdlfdOHc3rn51v14m5KNE2QmCSrh77aUoxTIS5f5aOr1//N6D45MgYLpNAl73U0FE8UH4EUM0+rWzvsZts2SRet2y2XS/GT8yRaaGZXAhYX8/0konJQDI/4ob/RaiXzrL/MKeUNKlVXwU7FOHHyUdne+8enW/MvRZQnwV6s8u+9glrvSj7VKBz7eYesvTF9k+9sCzvKcaYllryKr43e2J8Zp5dpzZtyjJKqf2DDYGXCKaf9nfsGfuw4UHxQKEWUO1dxHuzlo6XHrFfy8/mEQHUX2Vilo6hefjcM284QAdrCm8fX5T+1f7tR0KVKZV21mtj/vvFle+eP8U+64Q5EQjgJ1uiO6YvaT1NUH4iE3pUa9/y2UUeDwrcRdUNtoKKV9yMG9p+TOLvLZllN0gYdxsrJsZYDG35VR9tgpVuE8xu90ELan9cmV9UXpZefa0cJSq19SD5jzZoD03nbytllDqJJV/XEK19YG17C2y/ADrqQ9ig8KbRM68VzB6Wo0+RUPEta7z8E+dnkamNB7S7jjVj0C3sYzPY30Vm1P2uOnKWvtxp1Y99vO0dRPoYfCYjmFufgWA6hdegBSymf7D59oe8OhuZuP241mIhpoQD/yCF5wM0tzMoN/k5foRG5rFLMz/DW9N0dSByR1DZESUfsej5aQtPb22jHgsRk8EfZQSfe98Lv48qlaomp/nWrRxR7dExLHHVv7EVLPmuxFKPWbi8Yu3F2i2H+8JKHQTDjOC+Mwb0bk2phIhOq8ozM9Yuy/qKzyDOPlsMqxbbGwVLhAmbvGnlhu43t9SFeuG1mFIHVpbtbPIRaKLwGxRBnUJv0RD10FtyDO3dX5TcMzyHlvWfVMVBcYBMXQ9SZUaFuKOTNdz7ZNP+C52mjfQYg1Vkw28xBE2GvBJ5DELrWYqudAr/lX7rEA1TGGm09nuFBeWTveUZHtya9CvIIGDJIJT3xvDPusORuuoXW9tg9jGk+5hr1VCG7ChD4Rj3oIiQQZCZTtGdAuXLITB76Z+eL/z0xFF6WUY6Kbj6Byv1w0Py2UcI2hvlbccbrYYvP9v6CYwMhnAnT4LJGsoQijJkmlweFONHaYxKJwj4KPJ04kKFKKxhDhAyKIFNybzJmd4nvjZkdPFwo8TwwK9R7vd4qE9YEouxsM1I0Iwh2NxhNr38+55zuw6HItAYRy/jDpB+mSOS6ZQ4BEzA4sgLMzRGuThK/wuM/EUK52FaPgAAAABJRU5ErkJggg==',
          showSymbol: false,
          symbolSize: 18,
          itemStyle: {
            color: '#3B7AFF',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(22, 65, 185, 0.2)',
                },
                {
                  offset: 1,
                  color: 'rgba(22, 65, 185, 0)',
                },
              ],
              global: false,
            },
          },
          data: growthTrendData.list.map((item) => item.count),
        },
      ],
    }
    const Timer = setInterval(() => {
      if (document.querySelector('#echartMainGrowthTrendTemplateEchart')) {
        const myChart = echarts.init(
          document.querySelector('#echartMainGrowthTrendTemplateEchart')
        )
        myChart.setOption(chartOption)
        clearInterval(Timer)
      }
    }, 100)
  }
  handlePeriodClick = (e) => {
    const evt = e
    const evtClassName = evt.target.className.split(' ')
    const itemArr = document.querySelectorAll('.actionBoxItem')
    itemArr.forEach((item) => {
      const avtionItem = item
      avtionItem.className = item.className
        .split(' ')
        .filter((classItem) => classItem !== 'active')
        .join(' ')
    })
    const switchClassName = evtClassName
      .concat()
      .filter((item) => item !== 'actionBoxItem' && item !== 'active')
      .join()
    this.setState({
      currentPeriod: switchClassName,
    })
    this.handGetData(switchClassName)
    if (evtClassName.indexOf('active') === -1) {
      evtClassName.push('active')
      evt.target.className = evtClassName.join(' ')
    }
  }

  render() {
    return (
      <GrowthTrendTemplateWrapper className={this.props.className}>
        <HeaderWrapper>
          <HeaderTitle>人才增长走势</HeaderTitle>
          <HeaderActionBox>
            <div
              className="actionBoxItem day active"
              onClick={(evt) => this.handlePeriodClick(evt)}
              attr="talent_growth_trend_day"
            >
              按天
            </div>
            <div
              className="actionBoxItem week"
              onClick={(evt) => this.handlePeriodClick(evt)}
              attr="talent_growth_trend_week"
            >
              按周
            </div>
            <div
              className="actionBoxItem month"
              onClick={(evt) => this.handlePeriodClick(evt)}
              attr="talent_growth_trend_month"
            >
              按月
            </div>
          </HeaderActionBox>
        </HeaderWrapper>
        <div
          id="echartMainGrowthTrendTemplateEchart"
          style={{
            display: 'inline-block',
            width: '100%',
            height: 'calc(100% - 48px)',
            overflow: 'hidden',
          }}
        />
      </GrowthTrendTemplateWrapper>
    )
  }
}
