import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Affix } from 'antd'
import { getModuleName } from 'utils'
import { ANALYSIS_TITLE_MAP } from 'constants/talentDiscover'
import CareCompanyBusinessGuide from 'componentsV3/CareCompany/CareCompanyBusinessGuide'
import Filter from './Filter'
import TalentList from './TalentList'
import * as styles from './index.less'

export interface Props {
  analysis: object,
  currentUser: object,
  isShowDataAnalysis: boolean,
  hiddenOpe: boolean,
  checkboxGroup: Array<Object>,
}

export interface State {
  analysisVisiable: Boolean,
  selectedIds: Array<Object>,
  filterFixed: Boolean,
}

interface talentDiscoverState {
  talentList: Array<Object>,
}

interface GlobalState {
  talentDiscover: talentDiscoverState,
}

@connect((state: GlobalState) => ({
  currentUser: state.global.currentUser,
  currentGroup: state.groups.currentGroup,
}))
export default class TalentsContainer extends React.PureComponent<Props & talentDiscoverState, State> {
  state = {
    analysisVisiable: false,
    selectedIds: [],
    filterFixed: false,
  }

  componentWillReceiveProps(newProps) {
    if (!R.equals(newProps.talentList.map(R.prop('id')), this.props.talentList.map(R.prop('id')))) {
      this.setState({
        selectedIds: [],
      })
    }
  }

  handleAnalysisVisiableChange = (analysisVisiable: Boolean) => {
    this.setState({
      analysisVisiable,
    })
  }

  handleAllSelectedStatusChange = (isAllSelected: boolean) => {
    console.log('isAllSelected', isAllSelected)
    this.setState({
      selectedIds: isAllSelected ? this.props.talentList.map(R.prop('id')) : [],
    })
  }

  handleSelectedIdsChange = (selectedIds: Array<number>) => {
    this.setState({
      selectedIds,
    })
  }

  handleAnalysisData = () => {
    const { analysis } = this.props
    let analysisData: object = {}
    Object.keys(ANALYSIS_TITLE_MAP).forEach((item) => {
      analysisData[item] = R.propOr([], item, analysis)
    })
    return analysisData
  }

  handleFilterFixedStatusChange = filterFixed => {
    this.setState({
      filterFixed,
    })
  }

  render() {
    const analysisData = this.handleAnalysisData()
    const isAnalysisAvailable = !Object.keys(ANALYSIS_TITLE_MAP).every((item) => analysisData[item].length === 0)
    const { filterFixed, selectedIds } = this.state
    const { checkboxGroup, isShowDataAnalysis, hiddenOpe = false, currentUser: { talent_lib_version: tlv }, currentGroup: { key: currentGroupKey } } = this.props
    return (
      <div className={styles.talentsContainer} style={{ position: 'relative' }}>
        {hiddenOpe ? <div className={styles.filter} style={{ height: '1px', borderTop: 'none' }} /> : <div className={styles.top || ''}>
          <Affix target={() => this.props.refRight} offsetTop={56} onChange={this.handleFilterFixedStatusChange}>
            <Filter
              className={`${filterFixed ? styles.filterFixed : styles.filter} ${isShowDataAnalysis ? styles.filterShowAnalysis : ''}`}
              onAnalysisVisiableChange={this.handleAnalysisVisiableChange}
              onAllSelectedStatusChange={this.handleAllSelectedStatusChange}
              selectedIds={selectedIds}
              isAnalysisAvailable={isAnalysisAvailable}
              talentList={this.props.talentList}
              paginationParam={this.props.paginationParam}
            />
          </Affix>
        </div>}
        {tlv === 2 && getModuleName() === 'groups' && currentGroupKey === 'attention' ? <div><CareCompanyBusinessGuide scenes="groups" /></div> :
          <TalentList
            className={styles.talentList || ''}
            selectedIds={selectedIds}
            onSelectedItemsChange={this.handleSelectedIdsChange}
            scrollDom={this.props.refRight}
            talentList={this.props.talentList}
            checkboxGroup={checkboxGroup}
            fr={R.pathOr('', ['props', 'fr'], this)}
          />}

      </div>
    )
  }
}
