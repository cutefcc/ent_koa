/**
 * @file 企业号相关数据
 */

import * as company from 'services/company'
import * as global from 'services/global'
import moment from 'moment'

const today = new Date()
const otherData = {
  invite_time: moment(today).format('YYYY-MM-DD HH:mm:ss'),
  invite_end_time: moment().add(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
}

export default {
  namespace: 'company',

  state: {
    invitations: [],
    schedule: 'begin', // 雇主定向推广进程 begin  processing  end
    employerSpreadData: {
      promote_type: 8,
      push_type: 1,
      consume_num: 1,
      positions: undefined,
      provinces: undefined,
      degrees: undefined,
      worktimes: undefined,
      professions: ['01'],
      companys: [],
      content: '',
      img_url: '',
      jump_url: '',
      is_fan: -1,
      jid: 0,
      fid: 0,
      feed: undefined,
      ...otherData,
    },
    employerBalance: undefined,
    epbRecord: [],
    epbRecordRemain: 1,
    preData: {
      search_total: 0,
    },
    guideType: 0,
    guideTag: 0,
    addFeedLastWeek: 0,
    weeklyData: {},
    exampleFeedData: [],
    taskData: {},
    dynamicModalVisible: false,
  },

  effects: {
    *fetchEmployerDefaulValue({ payload }, { call }) {
      const { data } = yield call(company.fetchEmployerDefaulValue, payload)
      return data
    },
    *fetchDynamicList({ payload }, { call }) {
      const { data } = yield call(company.fetchDynamicList, payload)
      return data
    },
    *fetchQuestionList({ payload }, { call }) {
      const { data } = yield call(company.fetchQuestionList, payload)
      return data
    },
    *answerQuestion({ payload }, { call }) {
      const { data } = yield call(company.answerQuestion, payload)
      return data
    },
    *answerDynamicList({ payload }, { call }) {
      const { data } = yield call(company.answerDynamicList, payload)
      return data
    },
    *getFirstCommmentList({ payload }, { call }) {
      const { data } = yield call(company.getFirstCommmentList, payload)
      return data
    },
    *getSecondCommmentList({ payload }, { call }) {
      const { data } = yield call(company.getSecondCommmentList, payload)
      return data
    },
    *answerLike({ payload }, { call }) {
      const { data } = yield call(company.answerLike, payload)
      return data
    },
    *getSecondCommmentList({ payload }, { call }) {
      const { data } = yield call(company.getSecondCommmentList, payload)
      return data
    },
    *toppingCompanyAnswer({ payload }, { call }) {
      const { data } = yield call(company.toppingCompanyAnswer, payload)
      return data
    },
    *removeCompanyAnswer({ payload }, { call }) {
      const { data } = yield call(company.removeCompanyAnswer, payload)
      return data
    },
    *deleteFirstAnswer({ payload }, { call }) {
      const { data } = yield call(company.deleteFirstAnswer, payload)
      return data
    },
    *fetchEnterpriseData({ payload }, { call }) {
      const { data } = yield call(company.fetchEnterpriseData, payload)
      return data
    },
    *removeEmployeeFeed({ payload }, { call }) {
      const { data } = yield call(company.removeEmployeeFeed, payload)
      return data
    },
    *deleteCompanyFeed({ payload }, { call }) {
      const { data } = yield call(company.deleteCompanyFeed, payload)
      return data
    },
    *getCommmentList({ payload }, { call }) {
      const { data } = yield call(company.getCommmentList, payload)
      return data
    },
    *getCommmentLv2List({ payload }, { call }) {
      const { data } = yield call(company.getCommmentLv2List, payload)
      return data
    },
    *likeFeed({ payload }, { call }) {
      const { data } = yield call(company.likeFeed, payload)
      return data
    },
    *addCmt({ payload }, { call }) {
      const { data } = yield call(company.addCmt, payload)
      return data
    },
    *likeCmt({ payload }, { call }) {
      const { data } = yield call(company.likeCmt, payload)
      return data
    },
    *delCmts({ payload }, { call }) {
      const { data } = yield call(company.delCmts, payload)
      return data
    },
    *sendToFans({ payload }, { call }) {
      const { data } = yield call(company.sendToFans, payload)
      return data
    },
    *fetchTendencyData({ payload }, { call }) {
      const { data } = yield call(company.fetchTendencyData, payload)
      return data
    },
    *fetchCompanyFansPortrait({ payload }, { call }) {
      const { data } = yield call(company.fetchCompanyFansPortrait, payload)
      return data
    },
    *employerPre({ payload }, { call }) {
      const { data } = yield call(company.employerPre, payload)
      return data
    },
    *employerPreCount({ payload }, { call }) {
      const { data } = yield call(company.employerPreCount, payload)
      return data
    },
    *employerAdd({ payload }, { call, put }) {
      const { data } = yield call(company.employerAdd, payload)
      yield put({
        type: 'company/setData',
        payload: {
          employerBalance: data.data.equity_balance,
        },
      })

      return data
    },
    *employerList({ payload }, { call }) {
      const { data } = yield call(company.employerList, payload)
      return data
    },
    *fetchEpbDetail({ payload }, { call, put, select }) {
      const { data } = yield call(company.fetchEpbDetail, payload)
      const companyState = yield select((state) => state.company)
      yield put({
        type: 'company/setData',
        payload: {
          epbRecord: companyState.epbRecord.concat(data.data.list),
          epbRecordRemain: data.data.remain,
        },
      })
      return data
    },
    *uploadImg({ payload }, { call }) {
      const { data } = yield call(company.uploadImg, payload)
      return data
    },
    *setOnTop({ payload }, { call }) {
      const { data } = yield call(company.setOnTop, payload)
      return data
    },
    *fetchPushData({ payload }, { call }) {
      const { data } = yield call(company.getTopicPush, payload)
      return data
    },
    *sendTopicPush({ payload }, { call }) {
      const { data } = yield call(company.sendTopicPush, payload)
      return data
    },
    *removeTopicPush({ payload }, { call }) {
      const { data } = yield call(company.removeTopicPush, payload)
      return data
    },
    *getCompanyJobListService({ payload }, { call }) {
      const { data } = yield call(company.getCompanyJobListService, payload)
      return data
    },
    *preUpload({ payload }, { call }) {
      const { data } = yield call(company.preUpload, payload)
      return data
    },
    *parseUrl({ payload }, { call }) {
      const { data } = yield call(company.parseUrl, payload)
      return data
    },
    *addFeed({ payload }, { call }) {
      const { data } = yield call(company.addFeed, payload)
      return data
    },
    *getWeeklyReport({ payload }, { call, put }) {
      const { data } = yield call(company.getWeeklyReport, payload)
      yield put({
        type: 'company/setData',
        payload: {
          guideType: data.type,
          weeklyData: data.data,
          guideTag: data.show_tag,
          addFeedLastWeek: data.add_feed_last_week, // 1=上周有发布 2=未发布
        },
      })
      return data
    },
    *removeExposureTag({ payload }, { call, put }) {
      const { data } = yield call(company.removeExposureTag, payload)
      yield put({
        type: 'company/setData',
        payload: {
          guideTag: 0,
        },
      })
      return data
    },
    *getExampleFeedData({ payload }, { call, put }) {
      const { data } = yield call(global.getMaterialConfig, payload)
      yield put({
        type: 'company/setData',
        payload: {
          exampleFeedData: data.data,
        },
      })
      return data
    },
    *getTaskData({ payload }, { call, put }) {
      const { data } = yield call(company.getTaskData, payload)
      yield put({
        type: 'company/setData',
        payload: {
          taskData: data,
        },
      })
      return data
    },
    *fetchAuthorityList({ payload }, { call }) {
      const { data } = yield call(company.fetchAuthorityList, payload)
      return data
    },
  },

  reducers: {
    setSchedule(state, { payload }) {
      return {
        ...state,
        schedule: payload,
      }
    },
    setEmployerSpreadData(state, { payload }) {
      return {
        ...state,
        employerSpreadData: payload,
      }
    },
    setPreData(state, { payload }) {
      return {
        ...state,
        preData: { ...state.preData, ...payload },
      }
    },
    setData(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
