import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Row, Col, Affix } from 'antd'
import WaterMark from 'componentsV2/Common/WaterMark'
import { isMappingEmpty } from 'utils'
import { PaginationHiddenLastPage } from 'mm-ent-ui'
import { FILTERITEMS } from 'constants/talentDiscover'
import DynamicContainer from 'componentsV3/Recommend/Groups/DynamicContainer'
import TalentsContainer from 'componentsV3/TalentDiscover/TalentsContainer'
import FeedListContainer from 'componentsV3/TalentDiscover/FeedListContainer'
import CareCompanyBusinessGuide from 'componentsV3/CareCompany/CareCompanyBusinessGuide'
import LeftSide from 'componentsV3/Recommend/Groups/LeftSide'
import SubGroups from 'componentsV3/Recommend/Groups/SubGroups'
import TabContainer from 'componentsV3/TalentDiscover/TabContainer'
import FilterContainer from 'componentsV3/FilterContainer'
import AnslysisChart from 'componentsV3/TalentDiscover/AnslysisChart'
import AdvanceSearchModal from 'componentsV3/Recommend/Subscribe/AdvanceSearchModal'
import styles from './index.less'
import { hotPicPing, removeHotPicPing } from 'utils/HotPicPing'

@connect((state) => ({
  currentUser: state.global.currentUser,
  currentTab: state.groups.currentTab,
  talentList: state.groups.talentList,
  analysis: state.groups.analysis,
  feedList: state.groups.feedList,
  mappingTags: state.groups.mappingTags,
  searchParam: state.groups.searchParam,
  advanceSearchModal: state.groups.advanceSearchModal,
  isShowDataAnalysis: state.groups.isShowDataAnalysis,
  paginationParam: state.groups.paginationParam,
  dynamic: state.groups.dynamic,
  advanceParams: state.groups.advanceParams,
  checkboxGroup: state.groups.checkboxGroup,
  groupsCurrentGroup: state.groups.currentGroup,
  listLoading: state.loading.effects['groups/fetchData'],
}))
export default class Group extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      refRight: null,
    }
  }

  componentDidMount() {
    this.setWaterMark(this.props)
    // 设置 setCurrentDynamicCategory 默认值
    this.props.dispatch({
      type: 'groups/setCurrentDynamicCategory',
      payload: '16',
    })
    if (this.refRight) {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({
        refRight: this.refRight,
      })
    }
    hotPicPing()
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
      container: this.refRight,
    })
  }

  handleFetchData = (param = {}) => {
    // 获取数据
    this.props.dispatch({
      type: 'groups/fetchData',
      payload: param,
    })
  }

  handleFilterChange = (value) => {
    const obj = {}
    FILTERITEMS.forEach((item) => {
      obj[item.key] = 0
    })
    value.forEach((item) => {
      obj[item] = 1
    })
    this.props.dispatch({
      type: 'groups/setSearchParam',
      payload: { ...this.props.searchParam, ...obj },
    })
    this.props.dispatch({
      type: 'groups/setCheckboxGroup',
      payload: value,
    })
    this.props.dispatch({
      type: 'groups/setPaginationParam',
      payload: {
        page: 1,
        total: 0,
        total_match: 0,
      },
    })
    this.handleFetchData({ search_type: 'mapping' })
  }

  handleAnalysisDataClick = () => {
    if (isMappingEmpty(this.props.analysis)) {
      return
    }
    this.state.refRight.scrollTop = 0
    this.props.dispatch({
      type: 'groups/setIsShowDataAnalysis',
      payload: !this.props.isShowDataAnalysis,
    })
  }

  handleTabChange = (obj, refresh = false) => {
    const { currentTab } = this.props
    if (currentTab === obj.tabName) {
      return
    }
    // 清空总数
    this.props.dispatch({
      type: 'groups/setPaginationParam',
      payload: {
        ...this.props.paginationParam,
        total: 0,
      },
    })
    this.props.dispatch({
      type: 'groups/setCurrentTab',
      payload: obj.tabName,
    })
    if (refresh) {
      return
    }
    // 清空总数
    this.props.dispatch({
      type: 'groups/setPaginationParam',
      payload: {
        ...this.props.paginationParam,
        total: 0,
      },
    })
    this.props.dispatch({
      type: 'groups/fetchData',
      payload: { search_type: 'mapping' },
    })
  }

  handleClearMapping = () => {
    // 清除tags
    this.props.dispatch({
      type: 'groups/setMappingTags',
      payload: [],
    })
    // 搜索
    this.handleSearch(this.props.analysis, [])
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
      type: 'groups/setMappingTags',
      payload: [...mappingTags],
    })
    // 搜索
    this.handleSearch(analysis, [...mappingTags])
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

    const { searchParam } = this.props
    this.props.dispatch({
      type: 'groups/setSearchParam',
      payload: { ...this.handleClearSubSearch({ ...searchParam }), ...query },
    })
    this.handleFetchData({ search_type: 'mapping' })
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

  handleAdvanceSearch = (param) => {
    this.props.dispatch({
      type: 'groups/setAdvanceSearchModal',
      payload: false,
    })
    this.props.dispatch({
      type: 'groups/setPaginationParam',
      payload: {
        ...this.props.paginationParam,
        page: 1,
        total: 0,
        total_match: 0,
      },
    })
    // 清除tags
    this.props.dispatch({
      type: 'groups/setMappingTags',
      payload: [],
    })
    this.props.dispatch({
      type: 'groups/setAdvanceParams',
      payload: { ...param, companyscope: 1 },
    })
    this.handleFetchData()
  }

  handleCancel = () => {
    this.props.dispatch({
      type: 'groups/setAdvanceSearchModal',
      payload: false,
    })
  }

  handlePageChange = (page, pageSize) => {
    this.state.refRight.scrollTop = 0
    this.props.dispatch({
      type: 'groups/setPaginationParam',
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

  handleCalcAdvanceParamsNum = () => {
    const { advanceParams } = this.props
    let num = 0
    const keys = Object.keys(advanceParams)
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== 'companyscope' && advanceParams[keys[i]]) {
        const len = String(advanceParams[keys[i]]).split(',').length
        num += len
      }
    }
    return num
  }

  handlePageSizeChange = () => {}

  render() {
    const showTalentList = this.props.currentTab === 'talent'
    const showDynamic = this.props.currentTab === 'dynamic'
    const showFeedList = this.props.currentTab === 'realName'
    const talentList = R.pathOr([], ['props', 'talentList'], this)
    const page = R.pathOr(0, ['props', 'paginationParam', 'page'], this)
    const size = R.pathOr(20, ['props', 'paginationParam', 'size'], this)
    const total = R.pathOr(0, ['props', 'paginationParam', 'total'], this)
    const total_match = R.pathOr(
      0,
      ['props', 'paginationParam', 'total_match'],
      this
    )
    const tlv = R.pathOr(
      2,
      ['props', 'currentUser', 'talent_lib_version'],
      this
    )
    const currentGroupKey = R.pathOr(
      2,
      ['props', 'groupsCurrentGroup', 'key'],
      this
    )
    const {
      currentTab,
      isShowDataAnalysis,
      analysis,
      mappingTags,
      advanceSearchModal,
      paginationParam,
      // paginationParam: {page, size, total},
      dynamic,
      feedList,
      checkboxGroup,
      advanceParams,
      groupsCurrentGroup,
      listLoading,
    } = this.props
    const hiddenFilter = groupsCurrentGroup.key === 'inappropriate'
    const hiddenOpe = groupsCurrentGroup.key === 'inappropriate'
    const showBusinessGuied =
      showFeedList && tlv === 2 && currentGroupKey === 'attention'
    const showFeed =
      showFeedList && !(tlv === 2 && currentGroupKey === 'attention')
    return (
      <div className={`${styles.groups} ent-v3-main-grid`}>
        <h4 className="breadcrumbTitle">
          <span
            className={styles.index}
            onClick={() => {
              this.props.history.push('/ent/v3/index')
            }}
          >
            首页
          </span>{' '}
          &gt; 人才库
        </h4>
        <Row gutter={16} style={{ height: '95%' }}>
          <Col span={5} style={{ height: '100%' }}>
            <LeftSide scrollCon={this.refRight} />
          </Col>
          <Col span={19} style={{ height: '100%' }}>
            <div
              ref={(node) => {
                this.refRight = node
              }}
              className={styles.scrollCon}
            >
              <SubGroups />
              <Affix target={() => this.state.refRight} offsetTop={0}>
                {!hiddenFilter ? (
                  <FilterContainer
                    isShowDataAnalysis={isShowDataAnalysis}
                    onFilterChange={this.handleFilterChange}
                    onAnalysisDataClick={this.handleAnalysisDataClick}
                    checkboxGroup={checkboxGroup}
                    mappingTags={mappingTags}
                    hasAdvancesSearch
                    advanceParamsNum={this.handleCalcAdvanceParamsNum()}
                    analysis={analysis}
                    listLoading={listLoading}
                  />
                ) : null}
              </Affix>
              <AnslysisChart
                isShowDataAnalysis={isShowDataAnalysis}
                analysis={analysis}
                onClearMapping={this.handleClearMapping}
                onMappingTagsChanged={this.handleMappingTagsChanged}
                mappingTags={mappingTags}
              />
              <TabContainer
                className={styles.tabContainer}
                onTabChange={this.handleTabChange}
                currentTab={currentTab}
                allNum={total_match}
              />
              {showTalentList && (
                <TalentsContainer
                  talentList={talentList}
                  refRight={this.state.refRight}
                  isShowDataAnalysis={isShowDataAnalysis}
                  analysis={analysis}
                  checkboxGroup={checkboxGroup}
                  paginationParam={paginationParam}
                  hiddenOpe={hiddenOpe}
                  fr="groupListForPc"
                />
              )}
              {showDynamic && !(tlv === 2 && currentGroupKey === 'attention') && (
                <DynamicContainer
                  className={styles.dynamicContainer}
                  refRight={this.state.refRight}
                  // data={dynamic}
                  version="3.0"
                />
              )}
              {showDynamic && tlv === 2 && currentGroupKey === 'attention' && (
                <div>
                  <CareCompanyBusinessGuide scenes="groups" />
                </div>
              )}
              {advanceSearchModal && (
                <AdvanceSearchModal
                  condition={advanceParams}
                  onSubmit={this.handleAdvanceSearch}
                  onCancel={this.handleCancel}
                />
              )}
              {showBusinessGuied && (
                <div>
                  <CareCompanyBusinessGuide scenes="groups" />
                </div>
              )}
              {showFeed && (
                <FeedListContainer
                  refRight={this.state.refRight}
                  data={feedList}
                  checkboxGroup={checkboxGroup}
                  module="groups"
                />
              )}
              {total > size && (
                <div className={styles.pagination}>
                  <PaginationHiddenLastPage
                    total={total}
                    pageSize={size}
                    current={page}
                    onChange={this.handlePageChange}
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
