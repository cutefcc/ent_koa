import * as resumes from 'services/resumes'

export default {
  namespace: 'resumes',
  state: {
    // 单条的发票详情 用于修改 和 详情页面
    invoice: {},
    list: {},
  },
  reducers: {},
  effects: {
    *fetch({ payload }, { call }) {
      const data = yield call(resumes.fetch, payload)
      return data.data
    },
    *fetchResumeList({ payload }, { call }) {
      const data = yield call(resumes.fetchResumeList, payload)
      return data.data
    },
    *fetchResumeListV2({ payload }, { call }) {
      const data = yield call(resumes.fetchResumeListV2, payload)
      return data.data
    },
    *sendMessage({ payload }, { call }) {
      const data = yield call(resumes.sendMessage, payload)
      return data.data
    },
    *sendDirectMessage({ payload }, { call }) {
      const data = yield call(resumes.sendDirectMessage, payload)
      return data.data
    },
    *complete({ payload }, { call }) {
      const data = yield call(resumes.complete, payload)
      return data.data
    },
    *elimination({ payload }, { call }) {
      const data = yield call(resumes.elimination, payload)
      return data.data
    },
    *replyMessage({ payload }, { call }) {
      const data = yield call(resumes.replyMessage, payload)
      return data.data
    },
    *batchReplyMessage({ payload }, { call }) {
      const data = yield call(resumes.batchReplyMessage, payload)
      return data.data
    },
    *setLatestInfo({ payload }, { call }) {
      const data = yield call(resumes.setLatestInfo, payload)
      return data.data
    },
    *modifyState({ payload }, { call }) {
      const data = yield call(resumes.modifyState, payload)
      return data.data
    },
    *resumeList({ payload }, { call }) {
      const data = yield call(resumes.resumeDataList, payload)
      return data.data
    },
    *validJoblist({ payload }, { call }) {
      const data = yield call(resumes.validJoblist, payload)
      return data.data
    },
    *handleResume({ payload }, { call }) {
      const data = yield call(resumes.handleResume, payload)
      return data.data
    },
    *getPingAct({ payload }, { call }) {
      const data = yield call(resumes.getPingAct, payload)
      return data.data
    },
    *pingAct({ payload }, { call }) {
      const data = yield call(resumes.pingAct, payload)
      return data.data
    },
    *multiProcess({ payload }, { call }) {
      const data = yield call(resumes.multiProcess, payload)
      return data.data
    },
    *resumeListData({ payload }, { call }) {
      const data = yield call(resumes.resumeListData, payload)
      return data.data
    },
    *resumeHandleList({ payload }, { call }) {
      const data = yield call(resumes.resumeHandleList, payload)
      return data.data
    },
    *getDirectChat({ payload }, { call }) {
      const data = yield call(resumes.getDirectChat, payload)
      return data.data
    },
    *reloadResumeList({ payload }, { call }) {
      const data = yield call(resumes.reloadResumeList, payload)
      return data.data
    },
  },
}
