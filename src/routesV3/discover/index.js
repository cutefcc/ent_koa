import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Affix } from 'antd'
import { PaginationHiddenLastPage } from 'mm-ent-ui'
import AdvancedSearchContainer from 'componentsV3/TalentDiscover/AdvancedSearchContainer'
import TalentsContainer from 'componentsV3/TalentDiscover/TalentsContainer'
import FeedListContainer from 'componentsV3/TalentDiscover/FeedListContainer'
import DynamicContainer from 'componentsV2/TalentDiscover/DynamicContainer'
import TabContainer from 'componentsV3/TalentDiscover/TabContainer'
import { INIT_ADVANCE_SEARCH, FILTERITEMS } from 'constants/talentDiscover'
import FilterContainer from 'componentsV3/FilterContainer'
import AnslysisChart from 'componentsV3/TalentDiscover/AnslysisChart'
import { hotPicPing, removeHotPicPing } from 'utils/HotPicPing'
import WaterMark from 'componentsV2/Common/WaterMark'
import {
  isMappingEmpty,
  asyncExtraData,
  asyncExtraDataNew,
  trackEvent,
} from 'utils'

import urlParse from 'url'
import * as R from 'ramda'

import styles from './index.less'

@connect((state) => ({
  talentList: state.talentDiscover.talentList,
  feedList: state.talentDiscover.feedList,
  currentTab: state.talentDiscover.currentTab,
  currentDynamicCategory: state.talentDiscover.currentDynamicCategory,
  currentUser: state.global.currentUser,
  subscriptionList: state.talentDiscover.subscriptionList,
  advancedSearch: state.talentDiscover.advancedSearch,
  analysis: state.talentDiscover.analysis,
  mappingTags: state.talentDiscover.mappingTags,
  isShowDataAnalysis: state.talentDiscover.isShowDataAnalysis,
  dynamic: state.talentDiscover.dynamic,
  paginationParam: state.talentDiscover.paginationParam,
  checkboxGroup: state.talentDiscover.checkboxGroup,
  listLoading: state.loading.effects['talentDiscover/fetchData'],
  polarisVariables: state.global.polarisVariables,
}))
export default class Discover extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      refRight: null,
      searchValue: '',
    }
  }

  componentDidMount() {
    this.setWaterMark(this.props)
    hotPicPing()
    const { currentTab, location, currentDynamicCategory } = this.props
    const urlObj = urlParse.parse(location.search, true)
    const primaryTab = R.trim(R.pathOr('', ['query', 'primarytab'], urlObj))
    const navigatorTab = R.trim(R.pathOr('', ['query', 'tab'], urlObj))

    // 设置 setCurrentDynamicCategory 默认值
    this.props.dispatch({
      type: 'talentDiscover/setCurrentDynamicCategory',
      payload: '16',
    })
    this.props.dispatch({
      type: 'talentDiscover/setCurrentTab',
      payload: 'talent',
    })

    if (primaryTab && primaryTab !== currentTab) {
      this.props.dispatch({
        type: 'talentDiscover/setCurrentTab',
        payload: primaryTab,
      })
    }

    if (navigatorTab && navigatorTab !== currentDynamicCategory) {
      this.props.dispatch({
        type: 'talentDiscover/setCurrentDynamicCategory',
        payload: navigatorTab,
      })
    }
    // 解决父组件的ref在第一次渲染 传递不到子组件
    if (this.refRight) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        refRight: this.refRight,
      })
    }
    this.handleUrlQuery()
  }

  componentWillUnmount() {
    removeHotPicPing()
  }
  componentWillReceiveProps(newProps) {
    if (this.props.currentUser !== newProps.currentUser) {
      this.setWaterMark(newProps)
    }
  }

  setWaterMark(props) {
    const { currentUser } = props
    if (R.isEmpty(currentUser)) {
      return
    }
    const name = R.pathOr('', ['ucard', 'name'], currentUser)
    const phone = R.pathOr('', ['ucard', 'mobile_last_four'], currentUser)
    if (!name && !phone) {
      return
    }
    WaterMark({
      text: name + phone,
      container: this.state.refRight,
    })
  }

  handleUrlQuery = () => {
    const query = R.pathOr(
      '',
      ['query', 'query'],
      urlParse.parse(window.location.href, true)
    )
    if (query) {
      this.props.dispatch({
        type: 'talentDiscover/setAdvancedSearch',
        payload: { ...INIT_ADVANCE_SEARCH, query },
      })
      this.setState({
        searchValue: query,
      })
    }
  }

  handleFetchData = (param = {}) => {
    const { dispatch, polarisVariables } = this.props
    const search_basic_v3_switch = R.pathOr(
      'a',
      ['search_basic_v3_switch'],
      polarisVariables
    )
    const { search_type } = param
    const payload = search_type
      ? { data_version: '3.0', ...param }
      : { data_version: '3.0' }
    dispatch({
      type: 'talentDiscover/fetchData',
      payload,
    }).then((data) => {
      if (search_basic_v3_switch === 'b') {
        asyncExtraDataNew(dispatch, data ? data.list || [] : [])
      } else {
        asyncExtraData(dispatch, data ? data.list || [] : [])
      }
    })
  }

  handleFilterChange = (value) => {
    const checkboxGroup = R.pathOr([], ['props', 'checkboxGroup'], this)
    const checkboxGroupLength = R.pathOr(
      0,
      ['props', 'checkboxGroup', 'length'],
      this
    )
    const valueLength = value.length
    if (checkboxGroupLength > valueLength) {
      // 取消选中
      const target = checkboxGroup.find((item) => !value.includes(item))
      trackEvent('jobs_pc_talent_discover_filter_click', {
        type: 'unselected',
        target,
      })
    } else {
      // 选中
      const target = value.find((item) => !checkboxGroup.includes(item))
      trackEvent('jobs_pc_talent_discover_filter_click', {
        type: 'selected',
        target,
      })
    }
    const obj = {}
    FILTERITEMS.forEach((item) => {
      obj[item.key] = 0
    })
    value.forEach((item) => {
      obj[item] = 1
    })
    this.props.dispatch({
      type: 'talentDiscover/setAdvancedSearch',
      payload: { ...this.props.advancedSearch, ...obj },
    })
    this.props.dispatch({
      type: 'talentDiscover/setCheckboxGroup',
      payload: value,
    })
    this.props.dispatch({
      type: 'talentDiscover/setPaginationParam',
      payload: {
        page: 1,
        total: 0,
        total_match: 0,
      },
    })
    this.handleFetchData()
  }

  handleAnalysisDataClick = () => {
    if (isMappingEmpty(this.props.analysis)) {
      return
    }
    this.state.refRight.scrollTop = 0
    this.props.dispatch({
      type: 'talentDiscover/setIsShowDataAnalysis',
      payload: !this.props.isShowDataAnalysis,
    })
  }
  handleTabChange = (obj) => {
    const { currentTab, dispatch, polarisVariables } = this.props
    const search_basic_v3_switch = R.pathOr(
      'a',
      ['search_basic_v3_switch'],
      polarisVariables
    )
    if (currentTab === obj.tabName) {
      return
    }
    trackEvent('jobs_pc_talent_discover_tab_click', obj)
    // 清空总数
    dispatch({
      type: 'talentDiscover/setPaginationParam',
      payload: {
        ...this.props.paginationParam,
        total: 0,
      },
    })
    dispatch({
      type: 'talentDiscover/setCurrentTab',
      payload: obj.tabName,
    })
    dispatch({
      type: 'talentDiscover/fetchData',
      payload: { data_version: '3.0', search_type: 'mapping' },
    }).then((data) => {
      if (obj.tabName === 'talent') {
        if (search_basic_v3_switch === 'b') {
          asyncExtraDataNew(dispatch, data ? data.list || [] : [])
        } else {
          asyncExtraData(dispatch, data ? data.list || [] : [])
        }
      }
    })
  }

  handleClearMapping = () => {
    // 清除tags
    this.props.dispatch({
      type: 'talentDiscover/setMappingTags',
      payload: [],
    })
    // 搜索
    this.handleSearch(this.props.analysis, [])
  }

  handleClearSubSearch = (obj) => {
    delete obj.sub_cities
    delete obj.sub_schools
    delete obj.sub_worktimes
    delete obj.sub_professions
    delete obj.sub_companies
    delete obj.sub_excompanies
    delete obj.sub_allcompanies
    delete obj.cids
    delete obj.excids
    return obj
  }

  // eslint-disable-next-line complexity
  handleSearch = (analysis, mappingTags) => {
    const { worktimes_analysis, pfmj_analysis } = analysis
    const obj = {}
    mappingTags.forEach((item) => {
      if (obj[item.key]) {
        obj[item.key] += `,${item.name}`
      } else {
        obj[item.key] = item.name
      }
    })
    // 处理行业方向
    let professionsArr = []
    const sub_professions_arr = []
    if (obj.pfmj_analysis) {
      professionsArr = obj.pfmj_analysis.split(',')
      for (let i = 0; i < professionsArr.length; i++) {
        for (let j = 0; j < pfmj_analysis.length; j++) {
          if (pfmj_analysis[j].name === professionsArr[i]) {
            sub_professions_arr.push(pfmj_analysis[j].id)
          }
        }
      }
      obj.pfmj_analysis = sub_professions_arr.join(',')
    }
    // 处理经验年限
    let worktimesArr = []
    const sub_worktimes_arr = []
    if (obj.worktimes_analysis) {
      worktimesArr = obj.worktimes_analysis.split(',')
      for (let i = 0; i < worktimesArr.length; i++) {
        for (let j = 0; j < worktimes_analysis.length; j++) {
          if (worktimes_analysis[j].name === worktimesArr[i]) {
            sub_worktimes_arr.push(worktimes_analysis[j].id)
          }
        }
      }
      obj.worktimes_analysis = sub_worktimes_arr.join(',')
    }
    const {
      province_city_analysis: sub_cities,
      schools_analysis: sub_schools,
      current_companys_analysis: sub_companies,
      ever_companys_analysis: sub_excompanies,
      worktimes_analysis: sub_worktimes,
      pfmj_analysis: sub_professions,
    } = obj
    // const sub_allcompanies = Array.from(
    //   new Set([
    //     ...R.pathOr('', ['current_companys_analysis'], obj)
    //       .split(',')
    //       .filter(item => item !== ''),
    //     ...R.pathOr('', ['ever_companys_analysis'], obj)
    //       .split(',')
    //       .filter(item => item !== ''),
    //   ])
    // ).join(',')

    const query = {}

    if (sub_cities) query.sub_cities = sub_cities
    if (sub_schools) query.sub_schools = sub_schools
    if (sub_worktimes) query.sub_worktimes = sub_worktimes
    if (sub_professions) query.sub_professions = sub_professions
    if (sub_companies) query.sub_companies = sub_companies
    if (sub_excompanies) query.sub_excompanies = sub_excompanies
    // if (sub_allcompanies) query.sub_allcompanies = sub_allcompanies

    const cids = []
    if (sub_companies) {
      sub_companies.split(',').forEach((item) => {
        for (let i = 0; i < mappingTags.length; i++) {
          if (
            mappingTags[i].key === 'current_companys_analysis' &&
            item === mappingTags[i].name
          ) {
            cids.push(mappingTags[i].id)
          }
        }
      })
      query.cids = cids.join(',')
    }
    // 二次曾经任职 加excids
    const excids = []
    if (sub_excompanies) {
      sub_excompanies.split(',').forEach((item) => {
        for (let i = 0; i < mappingTags.length; i++) {
          if (
            mappingTags[i].key === 'ever_companys_analysis' &&
            item === mappingTags[i].name
          ) {
            excids.push(mappingTags[i].id)
          }
        }
      })
      query.excids = excids.join(',')
    }

    const { advancedSearch, dispatch, polarisVariables } = this.props
    const search_basic_v3_switch = R.pathOr(
      'a',
      ['search_basic_v3_switch'],
      polarisVariables
    )

    dispatch({
      type: 'talentDiscover/setAdvancedSearch',
      payload: {
        ...this.handleClearSubSearch({ ...advancedSearch }),
        ...query,
      },
    })
    dispatch({
      type: 'talentDiscover/fetchData',
      payload: { data_version: '3.0', search_type: 'mapping' },
    }).then((data) => {
      if (search_basic_v3_switch === 'b') {
        asyncExtraDataNew(dispatch, data ? data.list || [] : [])
      } else {
        asyncExtraData(dispatch, data ? data.list || [] : [])
      }
    })
  }

  handleMappingTagsChanged = (item, key) => {
    const itemObj = item
    itemObj.key = key
    const { analysis, mappingTags } = this.props
    let index = -1
    for (let i = 0; i < mappingTags.length; i++) {
      if (mappingTags[i].key === key && mappingTags[i].name === item.name) {
        index = i
      }
    }
    // 当前item不在mappingTags里面，就加入
    if (index === -1) mappingTags.push(itemObj)
    // 当前item在mappingTags里面，就删除
    if (index !== -1) mappingTags.splice(index, 1)
    this.props.dispatch({
      type: 'talentDiscover/setMappingTags',
      payload: [...mappingTags],
    })
    // 搜索
    this.handleSearch(analysis, [...mappingTags])
  }

  handlePageChange = (page, pageSize) => {
    this.refRight.scrollTop = 0
    this.props.dispatch({
      type: 'talentDiscover/setPaginationParam',
      payload: {
        ...this.props.paginationParam,
        page,
        size: pageSize,
      },
    })
    this.handleFetchData({
      search_type: 'mapping',
      pagination: true,
      isNewSid: false,
    })
  }

  render() {
    const showTalentList = this.props.currentTab === 'talent'
    const showDynamic = this.props.currentTab === 'dynamic'
    const showFeedList = this.props.currentTab === 'realName'
    const { refRight } = this.state
    const page = R.pathOr(0, ['props', 'paginationParam', 'page'], this)
    const size = R.pathOr(20, ['props', 'paginationParam', 'size'], this)
    const total = R.pathOr(0, ['props', 'paginationParam', 'total'], this)
    // const tlv = R.pathOr(
    //   2,
    //   ['props', 'currentUser', 'talent_lib_version'],
    //   this
    // )
    const total_match = R.pathOr(
      0,
      ['props', 'paginationParam', 'total_match'],
      this
    )
    const {
      subscriptionList,
      currentTab,
      isShowDataAnalysis,
      analysis,
      mappingTags,
      dynamic,
      feedList,
      paginationParam,
      checkboxGroup,
      listLoading,
    } = this.props
    return (
      <div className="ent-v3-main-grid">
        <div className={styles.mainWrap}>
          <div className={styles.content}>
            <Row gutter={16} className={styles.row}>
              <Col span={5} className={styles.leftCol}>
                <AdvancedSearchContainer
                  className={`${styles.left} ${
                    subscriptionList.length === 0 ? styles.noSubscription : ''
                  }`}
                  searchValue={this.state.searchValue}
                  mappingTags={mappingTags}
                />
              </Col>
              <Col span={19} className={styles.rightCol}>
                <div
                  ref={(node) => {
                    this.refRight = node
                  }}
                  id="talentList"
                  className={styles.scrollCon}
                >
                  <Affix target={() => refRight} offsetTop={0}>
                    <FilterContainer
                      isShowDataAnalysis={isShowDataAnalysis}
                      onFilterChange={this.handleFilterChange}
                      onAnalysisDataClick={this.handleAnalysisDataClick}
                      checkboxGroup={checkboxGroup}
                      mappingTags={mappingTags}
                      analysis={analysis}
                      listLoading={listLoading}
                    />
                  </Affix>
                  <AnslysisChart
                    isShowDataAnalysis={isShowDataAnalysis}
                    analysis={analysis}
                    onClearMapping={this.handleClearMapping}
                    onMappingTagsChanged={this.handleMappingTagsChanged}
                    mappingTags={mappingTags}
                  />
                  <div
                    className={styles.right}
                    ref={(node) => {
                      this.right = node
                    }}
                  >
                    <TabContainer
                      className={styles.tabContainer}
                      currentTab={currentTab}
                      onTabChange={this.handleTabChange}
                      allNum={total_match}
                    />
                    {showTalentList && (
                      <TalentsContainer
                        refRight={refRight}
                        talentList={this.props.talentList}
                        isShowDataAnalysis={isShowDataAnalysis}
                        analysis={analysis}
                        checkboxGroup={checkboxGroup}
                        fr="discoverListForPc"
                        paginationParam={paginationParam}
                      />
                    )}
                    {showDynamic && (
                      <DynamicContainer
                        className={`${styles.dynamicContainer}`}
                        refRight={refRight}
                        data={dynamic}
                        version="3.0"
                      />
                    )}
                    {showFeedList && (
                      <FeedListContainer
                        refRight={refRight}
                        data={feedList}
                        checkboxGroup={checkboxGroup}
                        module="talentDiscover"
                      />
                    )}
                    {total > 0 && (
                      <div className={styles.pagination}>
                        <PaginationHiddenLastPage
                          total={total}
                          pageSize={size}
                          current={page}
                          onChange={this.handlePageChange}
                        />
                      </div>
                    )}
                    {/* {total > size && (
                      <div className={styles.pagination}>
                        <PaginationHiddenLastPage
                          total={total}
                          pageSize={size}
                          current={page}
                          onChange={this.handlePageChange}
                        />
                      </div>
                    )} */}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    )
  }
}
