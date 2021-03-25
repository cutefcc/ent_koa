import * as talentReport from 'services/talentReport'
import * as R from 'ramda'
import { defaultMenuKey } from 'utils/talentReport'

export default {
  namespace: 'talentReport',
  state: {
    // yuning 正式数据
    menuList: [
      {
        title: '市场报告',
        key: '0',
        subMenuList: [
          {
            key: '0-1',
            title: '市场行情',
          },
          {
            key: '0-2',
            title: '人才流动',
          },
          {
            key: '0-3',
            title: '人才画像',
          },
        ],
      },
      {
        title: '企业报告',
        key: '1',
        subMenuList: [
          {
            key: '1-3',
            title: '员工画像',
          },
          {
            key: '1-2',
            title: '员工技能',
          },
          {
            key: '1-1',
            title: '员工流动',
          },
          {
            key: '1-7',
            title: '职位吸引力',
          },
          {
            key: '1-4',
            title: '招聘人才画像',
          },
          {
            key: '1-5',
            title: '储备人才画像',
          },
          {
            key: '1-8',
            title: '雇主影响力',
          },
          {
            key: '1-6',
            title: '互动人才画像',
          },
        ],
      },
    ], // 左侧菜单栏列表
    selectPositionCode: 'all_core_positions',
    selectPositionName: '核心岗位',
    selectActiveCode: '1',
    selectActiveName: '查看职位',
    selectMenuKey: defaultMenuKey, // 左侧菜单栏选择
    positionObj: {}, // 职位列表
    positionKeyIndex: {}, // 岗位对应的index
    compareCompanyList: [], // 对比公司列表
    employeeTurnoverData: {}, // 员工技能界面数据
    industryFlowSeekerObj: {}, // 市场行情-城市核心岗位求职者变化趋势
    industryFlowRecruitObj: {}, // 市场行情-城市核心岗位招聘竞争度
    talentFlowPersonInflowObj: {}, // 人才流动-城市核心岗位招聘竞争度
    talentFlowPersonOutflowObj: {}, // 人才流动-城市核心岗位的人才流出
    talentFlowPersonIndustryInflowObj: {}, // 人才流动-核心岗位行业间人才流入
    talentFlowPersonIndustryOutflowObj: {}, // 人才流动-核心岗位行业间人才流出
    talentPortraitNumObj: {}, // 人才画像-城市核心岗位员工人数分布
    talentPortraitEduObj: {}, // 人才画像-核心岗位员工的学历分布画像
    talentPortraitSchoolObj: {}, // 人才画像-核心岗位人才的名校占比画像
    talentPortraitWorkYearObj: {}, // 人才画像-核心岗位人才的工作年限分布画像
    employeePortraitNumObj: {}, // 核心岗位员工人数分布画像
    employeePortraitEduObj: {}, // 核心岗位员工的学历分布画像
    employeePortraitEduSchoolObj: {}, // 核心岗位员工的名校占比画像
    employeePortraitWorkYearObj: {}, // 核心岗位员工的工作年限分布画像s
    employeePortraitLengthObj: {}, // 核心岗位员工的学历分布画像
    employeeTurnoverrRatioObj: {}, // 员工流动-核心岗位流入/流出率
    employeeTurnoverrFlowLeaveObj: {}, // 员工流动-核心岗位员工离职去向
    employeeTurnoverrEntrySourceObj: {}, // 员工流动-核心岗位员工入职来源
    employerInfluenceAffectObj: {}, // 雇主影响力-企业影响力指数排名/内容曝光度指数排名/员工认可指数排名/粉丝互动指数排名
    employerInfluenceCardNumObj: {}, // 雇主影响力-全站提及帖量
    interactiveTalentPortraitNumObj: {}, // 互动人才画像-互动核心岗位人才的人数分布画像
    interactiveTalentPortraitEduObj: {}, // 互动人才画像-互动核心岗位人才的学历分布画像
    interactiveTalentPortraitSchoolObj: {}, // 互动人才画像-互动核心岗位人才的名校占比画像
    interactiveTalentPortraitWorkYearObj: {}, // 互动人才画像-核心岗位人才的工作年限分布画像
    recruitmentPortraitNumObj: {}, // 招聘人才画像-核心岗位查看人才的人数分布
    recruitmentPortraitEduObj: {}, // 招聘人才画像-核心岗位浏览人才的学历分布画像
    recruitmentPortraitSchoolObj: {}, // 招聘人才画像-核心岗位浏览人才的名校占比画像
    recruitmentPortraitWorkYearObj: {}, // 招聘人才画像-核心岗位浏览人才的工作年限分布画像
    reserveTalentPortraitsNumObj: {}, // 储备人才画像-核心岗位人才的人数分布画像
    reserveTalentPortraitsEduObj: {}, // 储备人才画像-核心岗位人才的学历分布画像
    reserveTalentPortraitsSchoolObj: {}, // 储备人才画像-核心岗位人才的名校占比画像
    reserveTalentPortraitsWorkYearObj: {}, // 储备人才画像-核心岗位人才的工作年限分布画像
    jobAttractivenessNumObj: {}, // 职位吸引力-核心岗位JD发布数量
    jobAttractivenessPersonObj: {}, // 职位吸引力-核心岗位JD浏览，表达意向人才数量
    jobAttractivenessSeeRateObj: {}, // 职位吸引力-核心岗位JD查看转化率
    jobAttractivenessTalkObj: {}, // 职位吸引力-企业会员达成双聊数
    loadingError: false, // loading失败
    talentReportVersion: 2, // 人才报告版本 1: 雇主版  2： 完整版
    isJobCheckBox: 0, // 是否可以勾选工作岗位 0: 不可勾选  1：可勾选
  },
  reducers: {
    setMenu(state, { payload }) {
      return {
        ...state,
        menuList: R.pathOr([], ['menuList'], payload),
      }
    },
    selectMenu(state, { payload }) {
      return {
        ...state,
        selectMenuKey: R.pathOr('', ['selectMenuKey'], payload),
        selectPositionCode: 'all_core_positions',
        selectPositionName: '核心岗位',
        selectActiveCode: '1',
        selectActiveName: '查看职位',
      }
    },
    setPosition(state, { payload }) {
      const positionKeyIndex = {}
      if (payload && payload.position) {
        let index = -1
        Object.keys(payload.position).forEach(key => {
          positionKeyIndex[
            R.pathOr('', ['position', key, 'code'], payload)
          ] = index
          index += 1
        })
      }
      return {
        ...state,
        positionObj: payload.position,
        talentReportVersion: payload.menu_version,
        isJobCheckBox: payload.is_job,
        positionKeyIndex,
        compareCompanyList: payload.com,
      }
    },
    setSelectCode(state, { payload }) {
      let tempPositionName = payload.selectPositionName
      if (tempPositionName === '全部' || tempPositionName === '核心岗位') {
        tempPositionName = '核心岗位'
      } else if (tempPositionName.indexOf('岗位') === -1) {
        tempPositionName += '岗位'
      }
      return {
        ...state,
        selectPositionCode: payload.selectPositionCode,
        selectActiveCode: payload.selectActiveCode,
        selectPositionName: tempPositionName,
        selectActiveName: payload.selectActiveName,
      }
    },
    setEmployeeTurnover(state, { payload }) {
      return {
        ...state,
        employeeTurnoverData: payload,
      }
    },
    setEmployeePortraitNum(state, { payload }) {
      return {
        ...state,
        employeePortraitNumObj: payload,
      }
    },
    setEmployeePortraitEdu(state, { payload }) {
      return {
        ...state,
        employeePortraitEduObj: payload,
      }
    },
    setEmployeePortraitEduSchoolObj(state, { payload }) {
      return {
        ...state,
        employeePortraitEduSchoolObj: payload,
      }
    },
    setEmployeePortraitEduWorkYearObj(state, { payload }) {
      return {
        ...state,
        employeePortraitWorkYearObj: payload,
      }
    },
    setEmployeePortraitLength(state, { payload }) {
      return {
        ...state,
        employeePortraitLengthObj: payload,
      }
    },
    setIndustryFlowSeekerObj(state, { payload }) {
      return {
        ...state,
        industryFlowSeekerObj: payload,
      }
    },
    setTalentPortraitNumObj(state, { payload }) {
      return {
        ...state,
        talentPortraitNumObj: payload,
      }
    },
    setTalentPortraitEduObj(state, { payload }) {
      return {
        ...state,
        talentPortraitEduObj: payload,
      }
    },
    setTalentPortraitSchoolObj(state, { payload }) {
      return {
        ...state,
        talentPortraitSchoolObj: payload,
      }
    },
    setTalentPortraitWorkYearObj(state, { payload }) {
      return {
        ...state,
        talentPortraitWorkYearObj: payload,
      }
    },
    setTalentFlowPersonInflowObj(state, { payload }) {
      return {
        ...state,
        talentFlowPersonInflowObj: payload,
      }
    },
    setTalentFlowPersonOutflowObj(state, { payload }) {
      return {
        ...state,
        talentFlowPersonOutflowObj: payload,
      }
    },
    setTalentFlowPersonIndustryInflowObj(state, { payload }) {
      return {
        ...state,
        talentFlowPersonIndustryInflowObj: payload,
      }
    },
    setTalentFlowPersonIndustryOutflowObj(state, { payload }) {
      return {
        ...state,
        talentFlowPersonIndustryOutflowObj: payload,
      }
    },
    setIndustryFlowRecruitObj(state, { payload }) {
      return {
        ...state,
        industryFlowRecruitObj: payload,
      }
    },
    setEmployeeTurnoverrRatioObj(state, { payload }) {
      return {
        ...state,
        employeeTurnoverrRatioObj: payload,
      }
    },
    setEmployeeTurnoverrEntrySourceObj(state, { payload }) {
      return {
        ...state,
        employeeTurnoverrEntrySourceObj: payload,
      }
    },
    setEmployeeTurnoverrFlowLeaveObj(state, { payload }) {
      return {
        ...state,
        employeeTurnoverrFlowLeaveObj: payload,
      }
    },
    setEmployerInfluenceAffectObj(state, { payload }) {
      return {
        ...state,
        employerInfluenceAffectObj: payload,
      }
    },
    setEmployerInfluenceCardNumObj(state, { payload }) {
      return {
        ...state,
        employerInfluenceCardNumObj: payload,
      }
    },
    setInteractiveTalentPortraitNum(state, { payload }) {
      return {
        ...state,
        interactiveTalentPortraitNumObj: payload,
      }
    },
    setInteractiveTalentPortraitEdu(state, { payload }) {
      return {
        ...state,
        interactiveTalentPortraitEduObj: payload,
      }
    },
    setInteractiveTalentPortraitSchool(state, { payload }) {
      return {
        ...state,
        interactiveTalentPortraitSchoolObj: payload,
      }
    },
    setInteractiveTalentPortraitWorkYear(state, { payload }) {
      return {
        ...state,
        interactiveTalentPortraitWorkYearObj: payload,
      }
    },
    setRecruitmentPortraitNum(state, { payload }) {
      return {
        ...state,
        recruitmentPortraitNumObj: payload,
      }
    },
    setRecruitmentPortraitEdu(state, { payload }) {
      return {
        ...state,
        recruitmentPortraitEduObj: payload,
      }
    },
    setRecruitmentPortraitSchool(state, { payload }) {
      return {
        ...state,
        recruitmentPortraitSchoolObj: payload,
      }
    },
    setRecruitmentPortraitWorkYear(state, { payload }) {
      return {
        ...state,
        recruitmentPortraitWorkYearObj: payload,
      }
    },
    setReserveTalentPortraitsNum(state, { payload }) {
      return {
        ...state,
        reserveTalentPortraitsNumObj: payload,
      }
    },
    setReserveTalentPortraitsEdu(state, { payload }) {
      return {
        ...state,
        reserveTalentPortraitsEduObj: payload,
      }
    },
    setReserveTalentPortraitsSchool(state, { payload }) {
      return {
        ...state,
        reserveTalentPortraitsSchoolObj: payload,
      }
    },
    setReserveTalentPortraitsWorkYear(state, { payload }) {
      return {
        ...state,
        reserveTalentPortraitsWorkYearObj: payload,
      }
    },
    setJobAttractivenessNum(state, { payload }) {
      return {
        ...state,
        jobAttractivenessNumObj: payload,
      }
    },
    setJobAttractivenessPerson(state, { payload }) {
      return {
        ...state,
        jobAttractivenessPersonObj: payload,
      }
    },
    setJobAttractivenessSeeRate(state, { payload }) {
      return {
        ...state,
        jobAttractivenessSeeRateObj: payload,
      }
    },
    setJobAttractivenessTalk(state, { payload }) {
      return {
        ...state,
        jobAttractivenessTalkObj: payload,
      }
    },
    setLoadingError(state, { payload }) {
      return {
        ...state,
        loadingError: payload,
      }
    },
  },
  effects: {
    // eslint-disable-next-line no-unused-vars
    *fetchMenu({ payload }, { call, put }) {
      // TODO 需要修改接口
      // const data = yield call(talentReport.fetch, payload)
      // yield put({
      //   type: 'setMenu',
      //   payload: data.data,
      // })
    },
    *fetchPosition({ payload }, { call, put }) {
      const data = yield call(talentReport.fetchPosition, payload)
      yield put({
        type: 'talentReport/setPosition',
        payload: R.pathOr({}, ['data', 'data'], data),
      })
    },
    *fetchEmployeeTurnover({ payload }, { call, put }) {
      try {
        const data = yield call(talentReport.fetchEmployeeTurnover, payload)
        yield put({
          type: 'talentReport/setEmployeeTurnover',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchEmployeePortraitNum({ payload }, { call, put }) {
      try {
        const data = yield call(talentReport.fetchEmployeePortraitNum, payload)
        yield put({
          type: 'talentReport/setEmployeePortraitNum',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchEmployeePortraitEdu({ payload }, { call, put }) {
      try {
        const data = yield call(talentReport.fetchEmployeePortraitEdu, payload)
        yield put({
          type: 'talentReport/setEmployeePortraitEdu',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchEmployeePortraitSchool({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchEmployeePortraitSchool,
          payload
        )
        yield put({
          type: 'talentReport/setEmployeePortraitEduSchoolObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchEmployeePortraitWorkYear({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchEmployeePortraitWorkYear,
          payload
        )
        yield put({
          type: 'talentReport/setEmployeePortraitEduWorkYearObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchEmployeePortraitLength({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchEmployeePortraitLength,
          payload
        )
        yield put({
          type: 'talentReport/setEmployeePortraitLength',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchTalentPortraitNum({ payload }, { call, put }) {
      try {
        const data = yield call(talentReport.fetchTalentPortraitNum, payload)
        yield put({
          type: 'talentReport/setTalentPortraitNumObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchTalentPortraitEdu({ payload }, { call, put }) {
      try {
        const data = yield call(talentReport.fetchTalentPortraitEdu, payload)
        yield put({
          type: 'talentReport/setTalentPortraitEduObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchTalentPortraitSchool({ payload }, { call, put }) {
      try {
        const data = yield call(talentReport.fetchTalentPortraitSchool, payload)
        yield put({
          type: 'talentReport/setTalentPortraitSchoolObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchTalentPortraitWorkYear({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchTalentPortraitWorkYear,
          payload
        )
        yield put({
          type: 'talentReport/setTalentPortraitWorkYearObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchIndustryFlowSeeker({ payload }, { call, put }) {
      try {
        const data = yield call(talentReport.fetchIndustryFlowSeeker, payload)
        yield put({
          type: 'talentReport/setIndustryFlowSeekerObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchTalentFlowPersonInflow({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchTalentFlowPersonInflow,
          payload
        )
        yield put({
          type: 'talentReport/setTalentFlowPersonInflowObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchTalentFlowPersonOutflow({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchTalentFlowPersonOutflow,
          payload
        )
        yield put({
          type: 'talentReport/setTalentFlowPersonOutflowObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchTalentFlowPersonIndustryInflow({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchTalentFlowPersonIndustryInflow,
          payload
        )
        yield put({
          type: 'talentReport/setTalentFlowPersonIndustryInflowObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchTalentFlowPersonIndustryOutflow({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchTalentFlowPersonIndustryOutflow,
          payload
        )
        yield put({
          type: 'talentReport/setTalentFlowPersonIndustryOutflowObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchIndustryFlowRecruit({ payload }, { call, put }) {
      try {
        const data = yield call(talentReport.fetchIndustryFlowRecruit, payload)
        yield put({
          type: 'talentReport/setIndustryFlowRecruitObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchEmployeeTurnoverrRatio({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchEmployeeTurnoverrRatio,
          payload
        )
        yield put({
          type: 'talentReport/setEmployeeTurnoverrRatioObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchEmployeeTurnoverrEntrySource({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchEmployeeTurnoverrEntrySource,
          payload
        )
        yield put({
          type: 'talentReport/setEmployeeTurnoverrEntrySourceObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchEmployeeTurnoverrFlowLeave({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchEmployeeTurnoverrFlowLeave,
          payload
        )
        yield put({
          type: 'talentReport/setEmployeeTurnoverrFlowLeaveObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchEmployerInfluenceAffect({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchEmployerInfluenceAffect,
          payload
        )
        yield put({
          type: 'talentReport/setEmployerInfluenceAffectObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchEmployerInfluenceCardNum({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchEmployerInfluenceCardNum,
          payload
        )
        yield put({
          type: 'talentReport/setEmployerInfluenceCardNumObj',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchInteractiveTalentPortraitNum({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchInteractiveTalentPortraitNum,
          payload
        )
        yield put({
          type: 'talentReport/setInteractiveTalentPortraitNum',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchInteractiveTalentPortraitEdu({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchInteractiveTalentPortraitEdu,
          payload
        )
        yield put({
          type: 'talentReport/setInteractiveTalentPortraitEdu',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchInteractiveTalentPortraitSchool({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchInteractiveTalentPortraitSchool,
          payload
        )
        yield put({
          type: 'talentReport/setInteractiveTalentPortraitSchool',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchInteractiveTalentPortraitWorkYear({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchInteractiveTalentPortraitWorkYear,
          payload
        )
        yield put({
          type: 'talentReport/setInteractiveTalentPortraitWorkYear',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchRecruitmentPortraitNum({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchRecruitmentPortraitNum,
          payload
        )
        yield put({
          type: 'talentReport/setRecruitmentPortraitNum',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchRecruitmentPortraitEdu({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchRecruitmentPortraitEdu,
          payload
        )
        yield put({
          type: 'talentReport/setRecruitmentPortraitEdu',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchRecruitmentPortraitSchool({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchRecruitmentPortraitSchool,
          payload
        )
        yield put({
          type: 'talentReport/setRecruitmentPortraitSchool',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchRecruitmentPortraitWorkYear({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchRecruitmentPortraitWorkYear,
          payload
        )
        yield put({
          type: 'talentReport/setRecruitmentPortraitWorkYear',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchReserveTalentPortraitsNum({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchReserveTalentPortraitsNum,
          payload
        )
        yield put({
          type: 'talentReport/setReserveTalentPortraitsNum',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchReserveTalentPortraitsEdu({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchReserveTalentPortraitsEdu,
          payload
        )
        yield put({
          type: 'talentReport/setReserveTalentPortraitsEdu',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchReserveTalentPortraitsSchool({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchReserveTalentPortraitsSchool,
          payload
        )
        yield put({
          type: 'talentReport/setReserveTalentPortraitsSchool',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchReserveTalentPortraitsWorkYear({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchReserveTalentPortraitsWorkYear,
          payload
        )
        yield put({
          type: 'talentReport/setReserveTalentPortraitsWorkYear',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchJobAttractivenessNum({ payload }, { call, put }) {
      try {
        const data = yield call(talentReport.fetchJobAttractivenessNum, payload)
        yield put({
          type: 'talentReport/setJobAttractivenessNum',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchJobAttractivenessPerson({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchJobAttractivenessPerson,
          payload
        )
        yield put({
          type: 'talentReport/setJobAttractivenessPerson',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchJobAttractivenessSeeRate({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchJobAttractivenessSeeRate,
          payload
        )
        yield put({
          type: 'talentReport/setJobAttractivenessSeeRate',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchJobAttractivenessTalk({ payload }, { call, put }) {
      try {
        const data = yield call(
          talentReport.fetchJobAttractivenessTalk,
          payload
        )
        yield put({
          type: 'talentReport/setJobAttractivenessTalk',
          payload: R.pathOr({}, ['data', 'data'], data),
        })
      } catch (e) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: true,
        })
      }
    },
    *fetchData({ payload }, { put, select }) {
      const talentReportState = yield select(state => state.talentReport)
      // 消除加载失败
      if (talentReportState.loadingError) {
        yield put({
          type: 'talentReport/setLoadingError',
          payload: false,
        })
      }

      const postionCode = R.pathOr(
        talentReportState.selectPositionCode,
        ['code'],
        payload
      )
      const postionName = R.pathOr(
        talentReportState.selectPositionName,
        ['name'],
        payload
      )
      const activeCode = R.pathOr(
        talentReportState.selectActiveCode,
        ['active'],
        payload
      )
      const activeName = R.pathOr(
        talentReportState.selectActiveName,
        ['activeName'],
        payload
      )
      const isFilter = R.pathOr(false, ['isFilter'], payload)
      if (talentReportState.selectMenuKey === '0-1') {
        yield put({
          type: 'talentReport/fetchIndustryFlowSeeker',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchIndustryFlowRecruit',
          payload: {
            code: postionCode,
          },
        })
      } else if (talentReportState.selectMenuKey === '0-2') {
        yield put({
          type: 'talentReport/fetchTalentFlowPersonInflow',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchTalentFlowPersonOutflow',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchTalentFlowPersonIndustryInflow',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchTalentFlowPersonIndustryOutflow',
          payload: {
            code: postionCode,
          },
        })
      } else if (talentReportState.selectMenuKey === '0-3') {
        if (!isFilter) {
          yield put({
            type: 'talentReport/fetchTalentPortraitNum',
            payload: {
              code: postionCode,
            },
          })
        }
        yield put({
          type: 'talentReport/fetchTalentPortraitEdu',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchTalentPortraitSchool',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchTalentPortraitWorkYear',
          payload: {
            code: postionCode,
          },
        })
      } else if (talentReportState.selectMenuKey === '1-1') {
        yield put({
          type: 'talentReport/fetchEmployeeTurnoverrRatio',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchEmployeeTurnoverrEntrySource',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchEmployeeTurnoverrFlowLeave',
          payload: {
            code: postionCode,
          },
        })
      } else if (talentReportState.selectMenuKey === '1-2') {
        yield put({
          type: 'talentReport/fetchEmployeeTurnover',
          payload: {
            code: postionCode,
          },
        })
      } else if (talentReportState.selectMenuKey === '1-3') {
        if (!isFilter) {
          yield put({
            type: 'talentReport/fetchEmployeePortraitNum',
            payload: {
              code: 'all_core_positions',
            },
          })
        }
        yield put({
          type: 'talentReport/fetchEmployeePortraitEdu',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchEmployeePortraitSchool',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchEmployeePortraitWorkYear',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchEmployeePortraitLength',
          payload: {
            code: postionCode,
          },
        })
      } else if (talentReportState.selectMenuKey === '1-4') {
        if (!isFilter || activeCode !== talentReportState.selectActiveCode) {
          yield put({
            type: 'talentReport/fetchRecruitmentPortraitNum',
            payload: {
              code: 'all_core_positions',
              search_type: activeCode,
            },
          })
        }
        yield put({
          type: 'talentReport/fetchRecruitmentPortraitEdu',
          payload: {
            code: postionCode,
            search_type: activeCode,
          },
        })
        yield put({
          type: 'talentReport/fetchRecruitmentPortraitSchool',
          payload: {
            code: postionCode,
            search_type: activeCode,
          },
        })
        yield put({
          type: 'talentReport/fetchRecruitmentPortraitWorkYear',
          payload: {
            code: postionCode,
            search_type: activeCode,
          },
        })
      } else if (talentReportState.selectMenuKey === '1-5') {
        if (!isFilter) {
          yield put({
            type: 'talentReport/fetchReserveTalentPortraitsNum',
            payload: {
              code: 'all_core_positions',
            },
          })
        }
        yield put({
          type: 'talentReport/fetchReserveTalentPortraitsEdu',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchReserveTalentPortraitsSchool',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchReserveTalentPortraitsWorkYear',
          payload: {
            code: postionCode,
          },
        })
      } else if (talentReportState.selectMenuKey === '1-6') {
        if (!isFilter) {
          yield put({
            type: 'talentReport/fetchInteractiveTalentPortraitNum',
            payload: {
              code: 'all_core_positions',
            },
          })
        }
        yield put({
          type: 'talentReport/fetchInteractiveTalentPortraitEdu',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchInteractiveTalentPortraitSchool',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchInteractiveTalentPortraitWorkYear',
          payload: {
            code: postionCode,
          },
        })
      } else if (talentReportState.selectMenuKey === '1-7') {
        yield put({
          type: 'talentReport/fetchJobAttractivenessNum',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchJobAttractivenessPerson',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchJobAttractivenessSeeRate',
          payload: {
            code: postionCode,
          },
        })
        yield put({
          type: 'talentReport/fetchJobAttractivenessTalk',
          payload: {
            code: postionCode,
          },
        })
      } else if (talentReportState.selectMenuKey === '1-8') {
        yield put({
          type: 'talentReport/fetchEmployerInfluenceAffect',
          payload: {
            api_type: '1,2,3,4',
          },
        })
        yield put({
          type: 'talentReport/fetchEmployerInfluenceCardNum',
        })
      }

      yield put({
        type: 'talentReport/setSelectCode',
        payload: {
          selectPositionCode: postionCode,
          selectPositionName: postionName,
          selectActiveCode: activeCode,
          selectActiveName: activeName,
        },
      })
    },
  },
}
