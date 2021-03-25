/* eslint-disable max-lines */
import * as global from 'services/global'
import * as personalAsset from 'services/personalAsset'
import * as R from 'ramda'
import { getCookie } from 'tiny-cookie'
import Voyager from 'voyager'
// TODO 建议把getCurrentUserRole 的结果 role，也放到 auth 中，就不要单独放在currentUser 下了
import computeAuth, { getCurrentUserRole } from 'utils/auth'
import Broadcast from 'utils/broadcast'
import { equitySysTypeIds } from 'constants/specialEquitySysTypeIds'
import {
  getIsIgnoreShowTalentMap,
  getHadShowTalentMap,
  isShowTalentMapDate,
  setHadShowTalentMap,
  setShowTalentMapDate,
} from 'utils/talentMap'
import {
  handleIsShowSnatchTalentStrongModal,
  handleIsShowSnatchTalentBottomBanner,
} from 'utils/snatchTalent'
// import {fetchOpportunityList} from '../services/talentPool'
const urlPrefix = process.env.NODE_ENV === 'development' ? '' : '/ent'

const menuKeys = [
  '/talents/discover/search', // 搜索人才
  '/talents/discover/search_v2', // 搜索人才
  '/talents/discover/recommend', // 推荐人才
  '/talents/discover/channel', // 人才专题
  '/talents/discover/invite', // 人才邀约
  '/talents/discover', // 发现

  '/talents/recruit/job_man', // 岗位管理
  // '/talents/recruit/positions/add', // 新建职位
  // '/talents/recruit/positions/modify/:ejid', // 编辑职位
  '/talents/recruit/positions', // 职位管理
  '/talents/recruit/resumes', // 简历管理
  '/talents/recruit/follow', // 人才追踪

  '/talents/pool/enterprise', // 企业人才库
  '/talents/pool/group', // 我的分组
  '/talents/pool', // 人才库一级页面

  '/asset/enterprise', // 企业资产
  '/asset/personal', // 个人资产
  '/talents/pool/old', // 老版企业人才库
  '/asset', // 一级菜单资产

  '/talents/follow',
  '/positions',
  '/talents/pool_new',
  '/talents/pool',
  '/account',
  '/im',
  '/job_man',
  '/stat',
]
const defaultUrl = '/ent/index'

export default {
  namespace: 'global',
  state: {
    urlPrefix,
    jobs: [],
    newAddCount: 0,
    dictionary: {},
    currentUser: {},
    bprofileUser: {},
    currentMenu: '',
    realPathname: '',
    checkCurrentUserVer: {},
    webShowParam: {},
    profession: [],
    searchKey: '',
    searchKeyNum: 0, // 有时候 searchKey 不变的情况下，用户也希望重新出发渲染，所以添加 searchKeyNum 作为出发搜索的条件
    memberOpenTip: {
      show: false,
      msg: '',
      buttonTxt: '确定',
    },
    memberUpgradeTip: {
      show: false,
      msg: '',
      buttonText: '',
    },
    unreadMsg: 0,
    config: {},
    maskConfig: {
      visible: false,
      type: '',
    }, // global mask config
    runtime: [],
    personalAsset: {}, // 个人权益余额
    aiCallRuntime: {}, // AI 电话实时动态，页面中设置了定时获取该数据
    aiCallPositiveIntension: [], // AI 电话的所有正意向列表
    auth: {},
    env: process.env.NODE_ENV,
    polarisVariables: {},
  },

  effects: {
    *fetchTryMemberSt({ payload }, { call }) {
      const { data } = yield call(global.fetchTryMemberSt, payload)
      return data
    },
    *fetchJobs({ payload }, { call, put }) {
      const { data } = yield call(global.fetchJobs, payload)
      yield put({
        type: 'global/setJobs',
        payload: data,
      })

      yield put({
        type: 'global/setNewAddCount',
        payload: data,
      })
      return data
    },
    *addStar({ payload }, { call }) {
      const { data } = yield call(global.addStar, payload)
      return data
    },
    *cancelStar({ payload }, { call }) {
      const { data } = yield call(global.cancelStar, payload)
      return data
    },
    *fetchDictionary({ payload }, { call, put }) {
      const { data } = yield call(global.fetchDictionary, payload)
      yield put({
        type: 'global/setDictionary',
        payload: data,
      })
      return data
    },
    *fetchCurrentUser(payload, { call, put }) {
      const { data = {} } = yield call(global.getCurrentUser, {})
      const {
        data: {
          ucard: { id },
        },
      } = data
      const {
        data: { variables },
      } = yield call(global.fetchPolaris, {
        u: id,
        variables: 'search_basic_v3_switch',
      })
      yield put({
        type: 'global/setPolarisVariables',
        payload: variables,
      })

      const { data: bprofileData = {} } = yield call(
        global.getCompanyCurrentUser,
        {}
      )
      const { data: bprofileCompanyUser = {} } = bprofileData
      yield put({
        type: 'global/setCurrentUser',
        payload:
          {
            ...data.data,
            ...{
              bprofileCompanyUser,
            },
          } || {},
      })

      yield put({
        type: 'global/setAuth',
        payload:
          {
            ...data.data,
            ...{
              bprofileCompanyUser,
            },
          } || {},
      })

      // 设置打点时的用户参数
      if (window.voyager) {
        window.voyager.setDefaultParams({
          abtest: R.pathOr({}, ['data', 'abtest'], data),
        })
      }

      // 个人权益余额
      if (R.pathOr(0, ['data', 'identity'], data) !== 3) {
        const { data: personalAssetData } = yield call(personalAsset.fetch, {})
        yield put({
          type: 'global/setPersonalAsset',
          payload: personalAssetData.data,
        })
      }

      if (R.pathOr(0, ['data', 'identity'], data) === 6) {
        if (R.pathOr(false, ['payload', 'initFlag'], payload)) {
          // 调用脉脉中高端人才需求图谱接口
          yield put({
            type: 'talentMap/fetch',
          })
          // 调用企业粉丝配置接口
          yield put({
            type: 'companyFans/fetchCompanyInfos',
          })
          // 调用企业粉丝排行榜数量接口
          yield put({
            type: 'companyFans/fetchCompanyFansCount',
          })
        }
        // 显示脉脉中高端人才需求图谱 remove talent map auto open 2021/03/02
        // if (getIsIgnoreShowTalentMap() !== '1') {
        //   const currUser = {
        //     ...data.data,
        //     ...{
        //       bprofileCompanyUser,
        //     },
        //   }
        //   const isShowSnatchTalentStrongModal = handleIsShowSnatchTalentStrongModal(
        //     currUser
        //   )
        //   const isShowSnatchTalentBottomBanner = handleIsShowSnatchTalentBottomBanner(
        //     currUser
        //   )
        //   const snatchTalentPath = ['/ent/v2/discover', '/ent/v3/index']
        //   // 先声夺人 强弹窗时屏蔽 图谱
        //   if (
        //     !(
        //       (isShowSnatchTalentStrongModal ||
        //         isShowSnatchTalentBottomBanner) &&
        //       snatchTalentPath.includes(window.location.pathname)
        //     )
        //   ) {
        //     if (window.location.href.indexOf('/ent/v2/company') !== -1) {
        //       // 设置显示相关数据
        //       setHadShowTalentMap('1')
        //       setShowTalentMapDate()
        //     } else if (
        //       getHadShowTalentMap() !== '1' ||
        //       !isShowTalentMapDate()
        //     ) {
        //       // 显示图谱
        //       yield put({
        //         type: 'talentMap/setVisible',
        //         payload: true,
        //       })
        //       // 设置显示相关数据
        //       setHadShowTalentMap('1')
        //       setShowTalentMapDate()
        //     }
        //   }
        // }
      }
      return bprofileData
    },
    *checkCurrentUserVer(payload, { call, put }) {
      const { data } = yield call(global.checkCurrentUserVer, {})
      yield put({
        type: 'global/setCheckCurrentUserVer',
        payload: data.data,
      })
      return data.data
    },
    *feedback({ payload }, { call }) {
      const { data } = yield call(global.feedback, payload)
      return data.data
    },
    *fetchProfession({ payload }, { call, put }) {
      const { data } = yield call(global.fetchProfession, payload)
      yield put({
        type: 'global/setProfession',
        payload: data,
      })
      return data
    },
    *fetchOpenFreeAccount({ payload }, { call }) {
      const { data } = yield call(global.fetchOpenFreeAccount, payload)
      return data
    },
    *fetchSchoolSugs({ payload }, { call }) {
      const { data } = yield call(global.fetchSchoolSugs, payload)
      return data
    },
    *fetchCompanySugs({ payload }, { call }) {
      const { data } = yield call(global.fetchCompanySugs, payload)
      return data
    },
    *fetchPositionSugs({ payload }, { call }) {
      const { data } = yield call(global.fetchPositionSugs, payload)
      return data
    },
    *fetchUnReadMsg({ payload }, { call, put }) {
      const { data } = yield call(global.fetchUnReadMsg, payload)
      yield put({
        type: 'global/setUnreadMsg',
        payload: R.pathOr(0, ['data', 'badge'], data),
      })
      return data
    },
    *fetchCommonFriends({ payload }, { call }) {
      const { data } = yield call(global.fetchCommonFriends, payload)
      return data
    },
    *fetchUrl({ payload }, { call }) {
      const { data } = yield call(global.fetchUrl, payload)
      return data
    },
    *fetchConfig({ payload }, { call, put }) {
      const { data } = yield call(global.fetchConfig, payload)
      yield put({
        type: 'global/setConfig',
        payload: data,
      })
      return data
    },
    *fetchRuntime({ payload }, { call, put }) {
      const { data } = yield call(global.fetchRuntime, payload)
      yield put({
        type: 'global/setRuntime',
        payload: data.data,
      })
      return data.data
    },
    *fetchPersonalAsset({ payload }, { call, put }) {
      const { data } = yield call(personalAsset.fetch, payload)
      yield put({
        type: 'global/setPersonalAsset',
        payload: data.data,
      })
      return data.data
    },
    *setReddot({ payload }, { call }) {
      const { data } = yield call(global.setReddot, payload)
      return data.data
    },
    *unBind({ payload }, { call }) {
      const { data } = yield call(global.unBind, payload)
      return data
    },
    *fetchCompanyStaffNum({ payload }, { call }) {
      const { data } = yield call(global.fetchCompanyStaffNum, payload)
      return data
    },
    *addOpportunityCustom({ payload }, { call }) {
      const { data } = yield call(global.addOpportunityCustom, payload)
      return data
    },
    // 获取AI电话的最新动态
    *fetchAiCallRuntime(payload, { call, put, select }) {
      const aiCallRuntime = yield select(R.path(['global', 'aiCallRuntime']))
      const { data } = yield call(global.fetchAiCallState, {
        start_time: aiCallRuntime.end_time,
      })
      yield put({
        type: 'global/setAiCallRuntime',
        payload: R.propOr({}, 'data', data),
      })

      // 如果有正向的动态，则需要重新获取正向意向的列表
      const list = R.pathOr([], ['data', 'list'], data)
      if (R.any(R.propEq('process_state', 2), list)) {
        const { data: positiveIntension } = yield call(
          global.fetchAiCallState,
          {
            state: 2,
          }
        )
        yield put({
          type: 'global/setAiCallPositiveIntension',
          payload: R.pathOr([], ['data', 'list'], positiveIntension),
        })
      }
      return data
    },
    // 获取AI电话的所有正意向
    *fetchAiCallPositiveIntension(payload, { call, put }) {
      const { data } = yield call(global.fetchAiCallState, {
        state: 2,
      })
      yield put({
        type: 'global/setAiCallPositiveIntension',
        payload: R.pathOr([], ['data', 'list'], data),
      })
    },
    // 获取Polaris实验变量
    *fetchPolaris({ payload }, { call }) {
      const { data } = yield call(global.fetchPolaris, payload)
      return data
    },
  },

  reducers: {
    setPolarisVariables(state, { payload }) {
      return {
        ...state,
        polarisVariables: payload,
      }
    },
    setJobs(state, { payload: { jobs = [] } }) {
      return {
        ...state,
        jobs,
      }
    },
    setNewAddCount(state, { payload: { new_add_count = [] } }) {
      return {
        ...state,
        newAddCount: new_add_count,
      }
    },
    setDictionary: (state, { payload }) => {
      return {
        ...state,
        dictionary: payload,
      }
    },
    setCurrentUser(state, { payload }) {
      window.uid = R.pathOr(0, ['ucard', 'id'], payload)
      const role = getCurrentUserRole(payload)
      const speSysType =
        equitySysTypeIds[R.pathOr(0, ['license', 'b_mbr_co_id'], payload)]
      return {
        ...state,
        currentUser: {
          ...payload,
          searchUrl: '/ent/talents/discover/search_v2',
          // payload.search_version === 1
          //   ? '/ent/talents/discover/search'
          //   : '/ent/talents/discover/search_v2',
          talentPoolUrl:
            R.pathOr(1, ['talent_lib', 'version'], payload) > 1
              ? '/ent/talents/pool/enterprise_v3'
              : '/ent/talents/pool/enterprise_v2',
          role,
          isV3: payload.identity === 6,
          equity_sys_type:
            payload.identity === 6 ? speSysType || 2 : payload.equity_sys_type, // R.pathOr(2, ['equity_sys_type'], payload) 权益体系。1.兑换体系，2：配额体系 前端强制转换成 劵模式
        },
        bprofileUser: payload.bprofileCompanyUser,
      }
    },
    // 计算相关权限
    setAuth(state, { payload }) {
      const auth = computeAuth(payload)
      return {
        ...state,
        auth: {
          ...state.auth,
          ...auth,
        },
      }
    },
    setPersonalAsset(state, { payload }) {
      return {
        ...state,
        personalAsset: {
          ...state.personalAsset,
          ...payload,
        },
      }
    },
    setMenu(state, { payload }) {
      return {
        ...state,
        currentMenu: payload.currentMenu,
        realPathname: payload.realPathname,
      }
    },
    setCheckCurrentUserVer(state, { payload }) {
      return {
        ...state,
        checkCurrentUserVer: payload,
      }
    },
    setProfession(state, { payload }) {
      return {
        ...state,
        profession: R.propOr([], 'profession', payload),
      }
    },
    setWebShowParam(state, { payload }) {
      return {
        ...state,
        webShowParam: payload,
      }
    },
    setSearchKey(state, { payload }) {
      return {
        ...state,
        searchKey: payload.searchKey,
        searchKeyNum: state.searchKeyNum + 1,
      }
    },
    // 显示开通会员的提示
    setMemberOpenTip(state, { payload }) {
      return {
        ...state,
        memberOpenTip: payload,
      }
    },
    // 显示升级会员的提示
    setMemberUpgradeTip(state, { payload }) {
      return {
        ...state,
        memberUpgradeTip: payload,
      }
    },
    // 未读消息数量
    setUnreadMsg(state, { payload }) {
      return {
        ...state,
        unreadMsg: payload,
      }
    },
    setConfig(state, { payload }) {
      return {
        ...state,
        config: R.propOr({}, 'data', payload),
      }
    },
    setRuntime(state, { payload }) {
      return {
        ...state,
        runtime: R.propOr([], 'list', payload),
      }
    },
    setAiCallRuntime(state, { payload }) {
      return {
        ...state,
        aiCallRuntime: payload,
      }
    },
    setAiCallPositiveIntension(state, { payload }) {
      return {
        ...state,
        aiCallPositiveIntension: payload,
      }
    },
    setMaskConfig(state, { payload }) {
      return {
        ...state,
        maskConfig: payload,
      }
    },
  },

  subscriptions: {
    setup({ history, dispatch }) {
      const { pathname: currentPath = '' } = history.location
      if (!R.contains('/m/', currentPath)) {
        dispatch({
          type: 'fetchDictionary',
          payload: {},
        })

        dispatch({
          type: 'fetchCurrentUser',
          payload: {
            initFlag: true,
          },
        })

        dispatch({
          type: 'fetchConfig',
          payload: {},
        })

        dispatch({
          type: 'fetchRuntime',
          payload: {},
        })

        dispatch({
          type: 'fetchJobs',
          payload: {},
        })
      }

      // 初始化打点功能
      window.voyager = new Voyager({})
      window.broadcast = new Broadcast()
      window.uid = getCookie('u')

      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname }) => {
        if (pathname === '/ent' || pathname === '/ent/') {
          history.push(defaultUrl)
        }
        const realPathname =
          pathname === '/ent' || pathname === '/ent/' ? defaultUrl : pathname
        const currentMenu = menuKeys.find(
          (key) => realPathname.indexOf(key) > -1
        )
        dispatch({
          type: 'setMenu',
          payload: {
            currentMenu,
            realPathname,
          },
        })

        // 页面曝光打点
        const param = {
          screen: `${R.pathOr(0, ['screen', 'width'], window)} * ${R.pathOr(
            0,
            ['screen', 'height'],
            window
          )}`,
          // page: window.location.href,
        }
        window.voyager.callPageViewEvent('end', {})
        window.voyager.refreshPageSessionId()
        window.voyager.callPageViewEvent('begin', param)
      })
    },
  },
}
