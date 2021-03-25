import * as talentMap from 'services/talentMap'
import * as R from 'ramda'
import { fixed, toPoint } from 'utils/numbers'

export default {
  namespace: 'talentMap',
  state: {
    show: false,
    loading: true,
    totalList: [], // 总数据
    dateList: [], // 日期
    highlyEducatedList: [], // 硕士以上高学历者
    topExperienceddateList: [], // 大厂&500强经验者
    executivesList: [], // 企业高管
    fiveMoreYearsExperiencedList: [], // 5年以上工作经验者
    monthTotalList: [], // 总数
    growthRateList: [], // 增长率
  },
  reducers: {
    setVisible(state, { payload }) {
      return {
        ...state,
        show: payload,
      }
    },
    setData(state, { payload }) {
      const month = R.pathOr([], ['data', 'month'], payload)
      const total = R.pathOr([], ['data', 'total'], payload)
      // 整理总数据
      const totalList = []
      totalList.push({
        title: '5年以上工作经验者',
        msg: `脉脉活跃的中高端人才「5年以上工作经验者」有${R.pathOr(
          0,
          ['five_years'],
          total
        )}万人`,
        num: R.pathOr(0, ['five_years'], total),
      })
      totalList.push({
        title: '大厂&500强经验者',
        msg: `脉脉活跃的中高端人才「大厂&500强经验者」有${R.pathOr(
          0,
          ['big_company_and_five_hundred'],
          total
        )}万人`,
        num: R.pathOr(0, ['big_company_and_five_hundred'], total),
      })
      totalList.push({
        title: '企业高管',
        msg: `脉脉活跃的中高端人才「企业高管」有${R.pathOr(
          0,
          ['senior_management'],
          total
        )}万人`,
        num: R.pathOr(0, ['senior_management'], total),
      })
      totalList.push({
        title: '硕士以上高学历者',
        msg: `脉脉活跃的中高端人才「硕士以上高学历者」有${R.pathOr(
          0,
          ['high_degree'],
          total
        )}万人`,
        num: R.pathOr(0, ['high_degree'], total),
      })
      // 整理分月数据
      const dateList = []
      const highlyEducatedList = []
      const topExperienceddateList = []
      const executivesList = []
      const fiveMoreYearsExperiencedList = []
      const monthTotalList = []
      const growthRateList = []
      month.forEach((item) => {
        dateList.push(`${item.year}.${item.month}`)
        highlyEducatedList.push(fixed(item.high_degree / 10000, 1))
        topExperienceddateList.push(
          fixed(item.big_company_and_five_hundred / 10000, 1)
        )
        executivesList.push(fixed(item.senior_management / 10000, 1))
        fiveMoreYearsExperiencedList.push(fixed(item.five_years / 10000, 1))
        monthTotalList.push(fixed(item.total / 10000, 1))
        growthRateList.push(fixed(toPoint(item.rate), 3))
      })

      return {
        ...state,
        totalList,
        dateList,
        highlyEducatedList,
        topExperienceddateList,
        executivesList,
        fiveMoreYearsExperiencedList,
        monthTotalList,
        growthRateList,
        loading: false,
      }
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const data = yield call(talentMap.fetch, payload)
      yield put({
        type: 'talentMap/setData',
        payload: data.data,
      })
    },
  },
}
