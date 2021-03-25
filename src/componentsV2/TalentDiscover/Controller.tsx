import * as React from 'react'
import { connect } from 'react-redux'

interface CurrentGroup {
  action_code: number & undefined
}

interface Props {
  currentTab: string
  currentGroup: CurrentGroup
}

interface State {}

export default function (WrapperComponent) {
  @connect((state) => ({
    currentGroup: state.talentDiscover.currentGroup,
    currentTab: state.talentDiscover.currentTab,
  }))
  class Controller extends React.PureComponent<Props, State> {
    fetchData = () => {
      const { currentTab, currentGroup } = this.props
      if (currentGroup && currentGroup.action_code === 1) {
        this.resetDatas()
        return
      }
      if (currentTab === 'talent') {
        this.fetchTalentList()
        this.fetchAnalysis()
        this.fetchDynamicHook()
      } else if (currentTab === 'dynamic') {
        this.fetchDynamic()
      }
    }

    resetDatas = () => {
      this.props.dispatch({
        type: 'talentDiscover/resetDatas',
      })
    }

    fetchGroups = () => {
      this.props.dispatch({
        type: 'talentDiscover/fetchGroups',
      })
    }

    fetchTalentList = () => {
      this.props.dispatch({
        type: 'talentDiscover/fetchTalentList',
      })
    }

    fetchAnalysis = () => {
      this.props.dispatch({
        type: 'talentDiscover/fetchAnalysis',
      })
    }

    fetchDynamic = () => {
      this.props.dispatch({
        type: 'talentDiscover/fetchDynamic',
      })
    }

    fetchDynamicHook = () => {
      this.props.dispatch({
        type: 'talentDiscover/fetchDynamicHook',
      })
    }

    onCurrentGroupChange = (param) => {
      this.props.dispatch({
        type: 'talentDiscover/setCurrentGroup',
        payload: param,
      })
      this.fetchData()
    }

    onAdvancedSearchChange = (param) => {
      this.props.dispatch({
        type: 'talentDiscover/setAdvancedSearch',
        payload: param,
      })

      this.fetchData()
    }

    onCurrentTabChange = (payload) => {
      this.props.dispatch({
        type: 'talentDiscover/setCurrentTab',
        payload,
      })

      this.fetchData()
    }

    onPaginationChange = (payload) => {
      this.props.dispatch({
        type: 'talentDiscover/setPaginationParam',
        payload,
      })

      this.fetchData()
    }

    render() {
      const props = {
        fetchData: this.fetchData,
        onCurrentGroupChange: this.onCurrentGroupChange,
        onAdvancedSearchChange: this.onAdvancedSearchChange,
        onCurrentTabChange: this.onCurrentTabChange,
      }
      return <WrapperComponent {...props} />
    }
  }

  return Controller
}
