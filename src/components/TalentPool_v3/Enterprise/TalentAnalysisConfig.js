import * as R from 'ramda'

const TalentAnalysisConfig = {
  titleMap: {
    current_companys_analysis: '目前就职',
    ever_companys_analysis: '曾经就职',
    worktimes_analysis: '经验年限',
    schools_analysis: '就读学校',
    pfmj_analysis: '行业方向',
    province_city_analysis: '城市地区',
  },

  defaultState: {
    titleMap: {
      current_companys_analysis: '目前就职',
      ever_companys_analysis: '曾经就职',
      worktimes_analysis: '经验年限',
      schools_analysis: '就读学校',
      pfmj_analysis: '行业方向',
      province_city_analysis: '城市地区',
    },
    // // 当前点击的列表与柱条数据
    // currentClickChart: {
    //   chartItem: '',
    //   chartItemKey: '',
    //   chartItemValue: '',
    //   chartItemClickFlag: false,
    // },
    // workTimesMap: {},
    // // 每个图表的收起/更多显示flag
    // showMoreOrNormal: {
    //   0: true,
    //   1: true,
    //   2: true,
    //   3: true,
    //   4: true,
    //   5: true,
    // },
    // // 处理完以后的表格数据
    // allChartData: [],
  },
  // 当前点击 currentClickChart 由外部传入更新
  currentState: {},
  // 同props.value 用于做渲染点击值的判断
  searchValue: {},
  // 预处理接口返回数据 存储为表格展示数据格式，加入最大值，表格ID，与唯一KEY
  // eslint-disable-next-line max-statements
  handleProcessData(record) {
    const Data = Object.assign({}, record)
    const newPfmjAnalysisData = []
    const newProvinceCityAnalysisData = []
    const sortDataArr = []
    R.propOr([], 'province_city_analysis', Data).forEach((item) => {
      newProvinceCityAnalysisData.push({
        count: item.count,
        name: item.city || '',
        province: item.province || '',
        city: item.city || '',
      })
    })
    R.propOr([], 'pfmj_analysis', Data).forEach((item) => {
      newPfmjAnalysisData.push({
        count: item.count,
        name: (item.pf_name || '') + (item.mj_name || ''),
        pf_name: item.pf_name || '',
        mj_name: item.mj_name || '',
      })
    })
    Data.pfmj_analysis = newPfmjAnalysisData
    Data.province_city_analysis = newProvinceCityAnalysisData
    Object.keys(Data).forEach((chartItem, index) => {
      if (Data[chartItem].length < 10) {
        for (let i = Data[chartItem].length; i < 10; i++) {
          Data[chartItem].push({
            count: 0,
            name: '',
          })
        }
      }
      sortDataArr.push({
        chartItem,
        chartIndex: index,
        all: Math.ceil(
          Math.max(...Data[chartItem].map((item) => item.count)) * 1.5
        ),
        data: Data[chartItem],
      })
    })

    return sortDataArr
  },
  // 柱状条颜色渲染 点击事件/ 已筛选项目
  handleItemStyleColor(record, chartItem) {
    if (Object.keys(this.currentState).length === 0) {
      // 没有点击任何项目 默认全选
      return '#CCDCFF'
    }
    if (
      this.currentState.chartItem !== chartItem &&
      this.searchValue[chartItem].split(',').indexOf(record.name) !== -1
    ) {
      // 当前点击图表非本次渲染图表  searchValue中存在的值进行选择
      return '#CCDCFF'
    }
    if (
      this.currentState.chartItem === chartItem &&
      this.searchValue[this.currentState.chartItem]
        .split(',')
        .indexOf(record.name) !== -1
    ) {
      // 当前点击图表为本次渲染图表 searchValue中存在的值进行选择
      return '#CCDCFF'
    }
    if (
      this.currentState.chartItem !== chartItem &&
      this.searchValue[chartItem] === ''
    ) {
      // 对从未做过选择的图表 searchValue中不存在的值进行初始色赋值
      return '#CCDCFF'
    }
    if (
      Object.keys(this.currentState).length > 0 &&
      record.name === this.currentState.chartItemKey &&
      chartItem === this.currentState.chartItem
    ) {
      // 点击某一项 直接选中
      return '#CCDCFF'
    }
    // 其他未点击项置灰
    return '#EEE'
  },
  // 更新公共值
  handleUpdataCommonValue(currentState, searchValue) {
    if (searchValue) {
      // 对searchValue的传参格式map
      this.searchValue = {
        current_companys_analysis: searchValue.companys || '',
        ever_companys_analysis: searchValue.ever_companys || '',
        worktimes_analysis: searchValue.worktimes
          ? searchValue.worktimes
              .split(',')
              .map((item) => this.defaultState.workTimesMap[item])
              .join()
          : '',
        schools_analysis: searchValue.schools || '',
        pfmj_analysis: searchValue.positions || '',
        province_city_analysis: searchValue.city || '',
      }
    }
    // 更新当前点击值
    if (currentState && Object.keys(currentState).length > 0) {
      this.currentState = currentState
    }
  },
  // 图表配置项 与最新点击或者searchValue的更新，每次重绘进行判断
  handleChartOption(chartData, currentState, searchValue) {
    this.handleUpdataCommonValue(currentState, searchValue)
    const canvas = document.createElement('canvas')
    return {
      backgroundColor: {
        type: 'pattern',
        image: canvas,
        repeat: 'repeat',
      },
      grid: [
        {
          id: chartData.chartItem,
          top: 0,
          bottom: 0,
          left: 0,
          width: '90%',
          containLabel: true,
          z: 10,
        },
      ],
      xAxis: [
        {
          show: false,
          type: 'value',
          max: () => {
            return chartData.all
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
          axisLabel: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: 'category',
          data: Object.keys(chartData.data).map(
            (item) => chartData.data[item].name
          ),
          z: 100,
          inverse: true,
          axisLabel: {
            fontSize: 12,
            color: '#363D4D',
            inside: true,
            align: 'left',
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
          cursor: 'auto',
          z: 3,
          itemStyle: {
            color: (value) =>
              this.handleItemStyleColor(value, chartData.chartItem),
          },
          barWidth: '24px',
          emphasis: {
            itemStyle: {
              color: '#CCDCFF',
            },
          },
          data: Object.keys(chartData.data).map((item) => {
            return Number(chartData.data[item].count)
          }),
        },
        {
          type: 'bar',
          stack: 'chart',
          silent: true,
          label: {
            normal: {
              position: 'right',
              formatter: (params) => {
                return chartData.all - params.data === 0
                  ? ''
                  : chartData.all - params.data
              },
              show: true,
              fontSize: 12,
              color: '#363D4D',
            },
          },
          itemStyle: {
            normal: {
              color: 'transparent',
            },
          },
          data: Object.keys(chartData.data).map((item) => {
            return chartData.all - chartData.data[item].count
          }),
        },
      ],
    }
  },
  // 将图表数据转换为回传后端的数据结构，由于每个字段判断与取值和字段名的不同 此函数一一分类处理
  // eslint-disable-next-line max-statements
  handleProcessParamsUpdata(value, currentClickChart, allChartData) {
    let params = Object.assign({}, value)
    if (currentClickChart.chartItem === 'worktimes_analysis') {
      let workTimesMapKey = null
      Object.keys(this.defaultState.workTimesMap).forEach((item) => {
        if (
          this.defaultState.workTimesMap[item] ===
          currentClickChart.chartItemKey
        ) {
          workTimesMapKey = item
        }
      })
      params = TalentAnalysisConfig.handleJudgeAddOrDelete(
        params,
        'worktimes',
        workTimesMapKey
      )
    }
    if (currentClickChart.chartItem === 'schools_analysis') {
      params = TalentAnalysisConfig.handleJudgeAddOrDelete(
        params,
        'schools',
        currentClickChart.chartItemKey
      )
    }
    if (currentClickChart.chartItem === 'current_companys_analysis') {
      params = TalentAnalysisConfig.handleJudgeAddOrDelete(
        params,
        'companys',
        currentClickChart.chartItemKey
      )
    }
    if (currentClickChart.chartItem === 'ever_companys_analysis') {
      params = TalentAnalysisConfig.handleJudgeAddOrDelete(
        params,
        'ever_companys',
        currentClickChart.chartItemKey
      )
    }
    if (currentClickChart.chartItem === 'pfmj_analysis') {
      let pfmjAnalysisData = []
      Object.keys(allChartData).forEach((key) => {
        if (allChartData[key].chartItem === 'pfmj_analysis') {
          pfmjAnalysisData = allChartData[key].data
        }
      })
      pfmjAnalysisData.forEach((item) => {
        if (item.name === currentClickChart.chartItemKey) {
          params = TalentAnalysisConfig.handleJudgeAddOrDelete(
            params,
            'positions',
            (item.mj_name || '') + (item.pf_name || '')
          )
        }
      })
    }

    if (currentClickChart.chartItem === 'province_city_analysis') {
      let provinceCityAnalysisData = []
      Object.keys(allChartData).forEach((key) => {
        if (allChartData[key].chartItem === 'province_city_analysis') {
          provinceCityAnalysisData = allChartData[key].data
        }
      })
      provinceCityAnalysisData.forEach((item) => {
        if (item.name === currentClickChart.chartItemKey) {
          params = TalentAnalysisConfig.handleJudgeAddOrDelete(
            params,
            'province',
            item.province
          )
          params = TalentAnalysisConfig.handleJudgeAddOrDelete(
            params,
            'city',
            item.city
          )
        }
      })
    }
    return params
  },
  // 传参处理数据抽出函数
  handleJudgeAddOrDelete(params, key, paramsName) {
    const p = params
    const Arr = params[key] ? params[key].split(',') : []
    if (Arr.indexOf(paramsName) === -1) {
      Arr.push(paramsName)
    } else {
      Arr.splice(Arr.indexOf(paramsName), 1)
    }
    p[key] = Arr.join()
    return p
  },
}

export default TalentAnalysisConfig
