import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'

import Filter from './Filter'
import TalentList from './TalentList'
import AnalysisData from './AnalysisData'
import { ANALYSIS_TITLE_MAP } from 'constants/talentDiscover'
import { Affix } from 'antd'

import * as styles from './index.less'

export interface Props {
  analysis: object
  currentUser: object
}

export interface State {
  analysisVisiable: Boolean
  selectedIds: Array<Object>
  filterFixed: Boolean
}

interface talentDiscoverState {
  talentList: Array<Object>
  currentGroup: object
}

interface GlobalState {
  talentDiscover: talentDiscoverState
}

@connect((state: GlobalState) => ({
  talentList: state.talentDiscover.talentList,
  currentGroup: state.talentDiscover.currentGroup,
  analysis: state.talentDiscover.analysis,
  currentUser: state.global.currentUser,
}))
export default class TalentsContainer extends React.PureComponent<
  Props & talentDiscoverState,
  State
> {
  state = {
    analysisVisiable: false,
    selectedIds: [],
    filterFixed: false,
  }

  componentWillReceiveProps(newProps) {
    if (
      !R.equals(
        newProps.talentList.map(R.prop('id')),
        this.props.talentList.map(R.prop('id'))
      )
    ) {
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

  handleFilterFixedStatusChange = (filterFixed) => {
    this.setState({
      filterFixed,
    })
  }

  renderAnslysisChart = (analysisData: object) => {
    const analysisDatatKeys = Object.keys(analysisData)
    return (
      <div className={styles.analysisCon}>
        {analysisDatatKeys.map((item: string, index: number) => {
          if (analysisData[item].length > 0) {
            return (
              <div key={item} className={styles.analysisItemCon}>
                <AnalysisData
                  key={item}
                  keyForData={item}
                  data={analysisData[item]}
                />
              </div>
            )
          }
        })}
      </div>
    )
  }

  render() {
    const analysisData = this.handleAnalysisData()
    const isAnalysisAvailable = !Object.keys(ANALYSIS_TITLE_MAP).every(
      (item) => analysisData[item].length === 0
    )
    const { filterFixed, analysisVisiable, selectedIds } = this.state
    return (
      <div className={styles.talentsContainer} style={{ position: 'relative' }}>
        <div className={styles.top || ''}>
          <Affix
            target={() => this.props.refRight}
            offsetTop={0}
            onChange={this.handleFilterFixedStatusChange}
          >
            <Filter
              className={`${filterFixed ? styles.filterFixed : styles.filter} ${
                analysisVisiable ? styles.filterShowAnalysis : ''
              }`}
              onAnalysisVisiableChange={this.handleAnalysisVisiableChange}
              onAllSelectedStatusChange={this.handleAllSelectedStatusChange}
              selectedIds={selectedIds}
              analysisVisiable={analysisVisiable}
              isAnalysisAvailable={isAnalysisAvailable}
              dataAvailable={this.props.currentGroup}
            />
          </Affix>
          {analysisVisiable &&
            !R.isEmpty(this.props.currentGroup) &&
            this.props.talentList.length !== 0 &&
            this.renderAnslysisChart(analysisData)}
        </div>
        <TalentList
          className={styles.talentList || ''}
          selectedIds={selectedIds}
          onSelectedItemsChange={this.handleSelectedIdsChange}
          scrollDom={this.props.refRight}
          fr={
            R.isEmpty(this.props.currentGroup)
              ? 'discoverListForPc'
              : 'groupListForPc'
          }
        />
      </div>
    )
  }
}
