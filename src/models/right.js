import * as rights from 'services/right'

export default {
  namespace: 'rights',
  state: {},
  reducers: {},
  effects: {
    *directInvite({ payload }, { call }) {
      const data = yield call(rights.directInvite, payload)
      return data.data
    },
    *enableDireactContact({ payload }, { call }) {
      const data = yield call(rights.enableDireactContact, payload)
      return data.data
    },
    *enableDireactContactBatch({ payload }, { call }) {
      const data = yield call(rights.enableDireactContactBatch, payload)
      return data.data
    },
    *recycle({ payload }, { call }) {
      const data = yield call(rights.recycle, payload)
      return data.data
    },
    *askForPhone({ payload }, { call }) {
      const data = yield call(rights.askForPhone, payload)
      return data.data
    },
    *aiCall({ payload }, { call }) {
      const data = yield call(rights.aiCall, payload)
      return data.data
    },
    *askForPhoneV2({ payload }, { call }) {
      const data = yield call(rights.askForPhoneV2, payload)
      return data.data
    },
    *sendTipForConnectByTelphone({ payload }, { call }) {
      const data = yield call(rights.sendTipForConnectByTelphone, payload)
      return data.data
    },
  },
}
