/* eslint-disable max-statements */
import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Row, Col, Affix } from 'antd'
import { withRouter } from 'react-router-dom'
import { isMappingEmpty, trackEvent } from 'utils'
import { PaginationHiddenLastPage } from 'mm-ent-ui'
import WaterMark from 'componentsV2/Common/WaterMark'
import { FILTERITEMS } from 'constants/talentDiscover'
import FilterContainer from 'componentsV3/FilterContainer'
import LeftSide from 'componentsV3/Recommend/Subscribe/LeftSide'
import AnslysisChart from 'componentsV3/TalentDiscover/AnslysisChart'
import DynamicContainer from 'componentsV3/Recommend/Subscribe/DynamicContainer'
import TalentsContainer from 'componentsV3/TalentDiscover/TalentsContainer'
import FeedListContainer from 'componentsV3/TalentDiscover/FeedListContainer'
import TabContainer from 'componentsV3/TalentDiscover/TabContainer'
import styles from './index.less'
import { hotPicPing, removeHotPicPing } from 'utils/HotPicPing'

@withRouter
@connect((state) => ({
  currentUser: state.global.currentUser,
  isShowDataAnalysis: state.subscribe.isShowDataAnalysis,
  analysis: state.subscribe.analysis,
  feedList: state.subscribe.feedList,
  mappingTags: state.subscribe.mappingTags,
  currentTab: state.subscribe.currentTab,
  talentList: state.subscribe.talentList,
  dynamic: state.subscribe.dynamic,
  currCondition: state.subscribe.currCondition,
  checkboxGroup: state.subscribe.checkboxGroup,
  conditionList: state.subscribe.conditionList,
  paginationParam: state.subscribe.paginationParam,
  urlPrefix: state.global.urlPrefix,
  listLoading: state.loading.effects['subscribe/fetchData'],
}))
export default class Recommend extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      refRight: null,
    }
  }

  componentDidMount() {
    this.setWaterMark(this.props)
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
      type: 'subscribe/fetchData',
      payload: param,
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
      trackEvent('jobs_pc_talent_subscribe_filter_click', {
        type: 'unselected',
        target,
      })
    } else {
      // 选中
      const target = value.find((item) => !checkboxGroup.includes(item))
      trackEvent('jobs_pc_talent_subscribe_filter_click', {
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
      type: 'subscribe/setCurrCondition',
      payload: { ...this.props.currCondition, ...obj },
    })
    this.props.dispatch({
      type: 'subscribe/setCheckboxGroup',
      payload: value,
    })
    this.props.dispatch({
      type: 'subscribe/setPaginationParam',
      payload: {
        page: 1,
        total_match: 0,
      },
    })
    // 没有订阅不调用接口
    if (this.props.conditionList.length === 0) {
      return
    }
    this.handleFetchData({ search_type: 'mapping' })
  }

  handleAnalysisDataClick = () => {
    if (isMappingEmpty(this.props.analysis)) {
      return
    }
    this.state.refRight.scrollTop = 0
    this.props.dispatch({
      type: 'subscribe/setIsShowDataAnalysis',
      payload: !this.props.isShowDataAnalysis,
    })
  }

  handleTabChange = (obj, refresh) => {
    const { currentTab } = this.props
    if (currentTab === obj.tabName) {
      return
    }
    trackEvent('jobs_pc_talent_subscribe_tab_click', obj)
    // 清空总数
    this.props.dispatch({
      type: 'subscribe/setPaginationParam',
      payload: {
        ...this.props.paginationParam,
        total: 0,
      },
    })
    this.props.dispatch({
      type: 'subscribe/setCurrentTab',
      payload: obj.tabName,
    })
    if (refresh) {
      return
    }
    // 没有订阅不调用接口
    if (this.props.conditionList.length === 0) {
      return
    }
    // 清空总数
    this.props.dispatch({
      type: 'subscribe/setPaginationParam',
      payload: {
        ...this.props.paginationParam,
        total: 0,
      },
    })
    this.props.dispatch({
      type: 'subscribe/fetchData',
      payload: { search_type: 'mapping' },
    })
  }

  handleClearMapping = () => {
    // 清除tags
    this.props.dispatch({
      type: 'subscribe/setMappingTags',
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
      type: 'subscribe/setMappingTags',
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

    const query = {}

    if (sub_cities) query.sub_cities = sub_cities
    if (sub_schools) query.sub_schools = sub_schools
    if (sub_worktimes) query.sub_worktimes = sub_worktimes
    if (sub_professions) query.sub_professions = sub_professions
    if (sub_companies) query.sub_companies = sub_companies
    if (sub_excompanies) query.sub_excompanies = sub_excompanies
    // if (sub_allcompanies) query.sub_allcompanies = sub_allcompanies
    // 二次正任职 加cids
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
      type: 'subscribe/setSearchParam',
      payload: { ...this.handleClearSubSearch({ ...searchParam }), ...query },
    })
    this.props.dispatch({
      type: 'subscribe/fetchData',
      payload: { search_type: 'mapping' },
    })
  }

  handleClearSubSearch = (obj) => {
    delete obj.sub_cities
    delete obj.sub_schools
    delete obj.sub_worktimes
    delete obj.sub_professions
    delete obj.sub_companies
    delete obj.sub_excompanies
    delete obj.sub_allcompanies
    return obj
  }

  handlePageChange = (page, pageSize) => {
    this.refRight.scrollTop = 0
    this.props.dispatch({
      type: 'subscribe/setPaginationParam',
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

  handlePageSizeChange = () => {}

  defaultDynamicTip = () => {
    return (
      <div>
        <img
          src={`${this.props.urlPrefix}/images/empty_subscription.png`}
          alt="emptyImage"
          style={{
            display: 'block',
            width: '198px',
            margin: '167px auto',
            marginBottom: '0',
          }}
        />
        <div className={styles.emptyText}>暂无匹配动态</div>
      </div>
    )
  }

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
    const {
      isShowDataAnalysis,
      analysis,
      feedList,
      mappingTags,
      currentTab,
      paginationParam,
      dynamic,
      checkboxGroup,
      conditionList,
      listLoading,
    } = this.props
    return (
      <div className={`${styles.subscribe} ent-v3-main-grid`}>
        <h4 className="breadcrumbTitle">
          <span
            className={styles.index}
            onClick={() => {
              this.props.history.push('/ent/v3/index')
            }}
          >
            首页
          </span>{' '}
          &gt; 人才订阅
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
              <Affix target={() => this.state.refRight} offsetTop={0}>
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
                  fr="subscribeListForPc"
                />
              )}
              {showDynamic && (
                <div>
                  {conditionList.length > 0 ? (
                    <DynamicContainer
                      className={styles.dynamicContainer}
                      refRight={this.state.refRight}
                      data={dynamic}
                      version="3.0"
                    />
                  ) : (
                    this.defaultDynamicTip()
                  )}
                </div>
              )}
              {showFeedList && (
                <FeedListContainer
                  refRight={this.state.refRight}
                  data={feedList}
                  checkboxGroup={checkboxGroup}
                  module="subscribe"
                />
              )}
              {total !== 0 && total > size && (
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
