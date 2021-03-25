/**
 * 企业粉丝弹窗model
 *
 */

import * as companyFans from 'services/companyFans'
import * as R from 'ramda'

export default {
  namespace: 'companyFans',

  state: {
    list: [], // 粉丝榜列表
    rate: '34%', // 粉丝邀请成功率
    openStatus: 0, // 是否开通了企业粉丝
    isCompanyVip: 0, // 是否企业管理员
    saleType: 0, // 是否是付费企业粉丝
  },

  effects: {
    *fetchCompanyFansCount({ payload }, { call, put }) {
      const { data } = yield call(companyFans.getCompanyFansCount, payload)
      // 处理数据
      const tempList = R.pathOr([], ['data', 'top5'], data)
      const cinfo = R.pathOr({}, ['data', 'cinfo'], data)
      const percent = R.pathOr('34%', ['data', 'percent'], data)
      let inTop5 = false
      const list = tempList.map((temp) => {
        if (temp.cid === cinfo.cid) {
          inTop5 = true
          // eslint-disable-next-line no-param-reassign
          temp.ownerFlag = '1'
        } else {
          // eslint-disable-next-line no-param-reassign
          temp.ownerFlag = '0'
        }
        return temp
      })
      if (!inTop5) {
        cinfo.ownerFlag = '1'
        list.push(cinfo)
      }

      yield put({
        type: 'companyFans/setData',
        payload: {
          list,
          rate: percent,
        },
      })
    },
    *fetchCompanyInfos({ payload }, { call, put }) {
      const { data } = yield call(companyFans.getCompanyInfos, payload)
      yield put({
        type: 'companyFans/setData',
        payload: {
          openStatus: R.pathOr(0, ['data', 'open_status'], data),
          isCompanyVip: R.pathOr(0, ['data', 'is_company_vip'], data),
          saleType: R.pathOr(0, ['data', 'sale_type'], data),
        },
      })
    },
  },

  reducers: {
    setData(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
