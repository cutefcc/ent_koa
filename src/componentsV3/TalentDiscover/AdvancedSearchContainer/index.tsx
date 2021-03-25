import * as React from 'react'
import * as R from 'ramda'
import AdvancedSearch from 'componentsV2/TalentDiscover/AdvancedSearchContainer/AdvancedSearch/index'
import { Modal, Message, Checkbox } from 'mm-ent-ui'
import { Button } from 'antd'
import EntInvite from 'componentsV2/Common/EntInvite'
import { INIT_ADVANCE_SEARCH } from 'constants/talentDiscover'
import { debounce, asyncExtraData, asyncExtraDataNew } from 'utils/index'
import * as styles from './index.less'
import { trackEvent } from 'utils'
import { connect } from 'react-redux'
export interface Props {
  advancedSearch: object
  dispatch?: (obj: object) => any
  className?: string
  subscriptionList: object[]
  showSearchValue: boolean
  mappingTags: object[]
  paginationParam: object
  polarisVariables: object
}

export interface State {
  subscriptionVisible: boolean
  // subscriptionList: object[],
  searchValue: string
  modalState: boolean
  prompt: boolean
}

@connect((state: any) => ({
  advancedSearch: state.talentDiscover.advancedSearch,
  subscriptionList: state.talentDiscover.subscriptionList,
  showSearchValue: state.talentDiscover.showSearchValue,
  mappingTags: state.talentDiscover.mappingTags,
  paginationParam: state.talentDiscover.paginationParam,
  polarisVariables: state.global.polarisVariables,
}))
export default class AdvancedSearchContainer extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props)
    this.state = {
      subscriptionVisible: true,
      // subscriptionList: [],
      searchValue: '',
      modalState: false,
      prompt: true,
      searchParamValue: {},
    }
  }

  componentWillMount() {
    this.fetchTalentDiscoverDataDebounce = debounce(
      this.handlefetchDataDebounce,
      300
    )
  }

  componentDidMount() {
    this.fetchSubscriptionList()
    this.checkSearchValue()
  }

  componentWillReceiveProps(newProps) {
    if (newProps.showSearchValue !== this.props.showSearchValue) {
      this.checkSearchValue(newProps)
    }
    if (newProps.searchValue !== this.props.searchValue) {
      this.setState({
        searchValue: newProps.searchValue,
      })
    }
  }

  checkSearchValue = (props) => {
    props = props || this.props
    if (!props.showSearchValue) {
      this.setState({
        searchValue: '',
      })
    }
  }

  fetchSubscriptionList = () => {
    // V3此处调用没有实际用处，故删除 by yuning
    // this.props.dispatch({
    //   type: 'subscribe/fetchConditionList',
    //   payload: {
    //     size: 20,
    //   },
    // }).then((res) => {
    //   // this.setState({
    //   //   subscriptionList: res.data ? res.data.list : []
    //   // })
    //   this.props.dispatch({
    //     type: 'talentDiscover/setSubscriptionList',
    //     payload: res.data ? res.data.list : [],
    //   })
    // }, (err) => {
    // })
  }

  handleSearchChange = (searchParam: object) => {
    const sign = localStorage.getItem('no_prompt_for_advance_search')
    if (sign !== '1' && this.props.mappingTags.length) {
      this.setState({
        modalState: true,
        searchParamValue: searchParam,
      })
    } else {
      this.handleChangeTags(searchParam)
      this.fetchTalentDiscoverDataDebounce()
    }
  }
  handleChangeTags = (searchParam: object) => {
    const query = R.propOr(
      R.propOr('', 'search_query', searchParam),
      'query',
      searchParam
    )
    this.setState({
      searchValue: query,
    })
    this.props.dispatch({
      type: 'talentDiscover/setSearchDebouncingFlag',
      payload: {
        debouncingFlag: true,
      },
    })
    // 清空总数
    this.props.dispatch({
      type: 'talentDiscover/setPaginationParam',
      payload: {
        ...this.props.paginationParam,
        total: 0,
      },
    })
    this.props.dispatch({
      type: 'talentDiscover/setAdvancedSearch',
      payload: {
        ...searchParam,
        query,
      },
    })
  }

  handlefetchDataDebounce = () => {
    const sign = localStorage.getItem('no_prompt_for_advance_search')
    if (sign !== '1' && this.props.mappingTags.length) {
      this.setState({
        modalState: true,
      })
      return
    }
    this.fetchMappingDate()
    this.props.dispatch({
      type: 'talentDiscover/setSearchDebouncingFlag',
      payload: {
        debouncingFlag: false,
      },
    })
  }

  handleSaveSubscription = (advancedSearch: object) => () => {
    trackEvent('jobs_pc_talent_save_subscribe_click')
    this.props
      .dispatch({
        type: 'subscribe/addCondition',
        payload: {
          ...advancedSearch,
        },
      })
      .then(() => {
        this.fetchSubscriptionList()
        Message.success({
          content: '添加人才订阅成功!',
        })
      })
  }

  handleDeleteSubscription = (id: number | string) => {
    Modal.confirm({
      title: '',
      content: '删除订阅条件，系统将自动取消人才推送，是否确认删除？',
      onOk: () => {
        this.props
          .dispatch({
            type: 'subscribe/deleteCondition',
            payload: {
              id,
            },
          })
          .then(() => {
            Message.success('删除订阅条件成功!')
            this.fetchSubscriptionList()
          })
      },
      onCancel: () => {},
      okText: '确认删除',
      cancelText: '取消',
    })
  }

  handleCurrentSubscriptionChange = (item: object) => {
    this.handleSearchChange(item)
  }

  handleClear = () => {
    if (
      !(
        JSON.stringify(this.props.advancedSearch) ===
        JSON.stringify(INIT_ADVANCE_SEARCH)
      )
    ) {
      this.handleSearchChange(INIT_ADVANCE_SEARCH)
    }

    this.setState({
      searchValue: '',
    })

    this.props.dispatch({
      type: 'talentDiscover/setPaginationParam',
      payload: {
        page: 1,
        size: 20,
        total: 0,
      },
    })
  }

  handleSearchValueChange = (e) => {
    if (!this.props.showSearchValue) {
      this.props.dispatch({
        type: 'talentDiscover/setShowSearchValue',
        payload: true,
      })
    }
    const { advancedSearch } = this.props
    this.setState({
      searchValue: e.target.value,
    })
    this.props.dispatch({
      type: 'talentDiscover/setAdvancedSearch',
      payload: {
        ...advancedSearch,
        query: e.target.value,
      },
    })
  }
  handleModalCancel = () => {
    this.setState({
      modalState: false,
    })
  }
  fetchMappingDate = () => {
    const { dispatch, polarisVariables } = this.props
    const search_basic_v3_switch = R.pathOr(
      'a',
      ['search_basic_v3_switch'],
      polarisVariables
    )
    this.props
      .dispatch({
        type: 'talentDiscover/fetchData',
        payload: { data_version: '3.0' },
        // }).then(({ list = [] }) => asyncExtraData(dispatch, list))
      })
      .then((data) => {
        if (data) {
          const { list = [] } = data
          if (search_basic_v3_switch === 'b') {
            asyncExtraDataNew(dispatch, list)
          } else {
            asyncExtraData(dispatch, list)
          }
        }
      })
  }

  handleOk = () => {
    this.setState({
      modalState: false,
    })
    this.handleChangeTags(this.state.searchParamValue)
    this.fetchTalentDiscoverDataDebounce()
    if (this.state.prompt) {
      localStorage.setItem('no_prompt_for_advance_search', '1')
    }
    this.props.dispatch({
      type: 'groups/setAdvanceSearchModal',
      payload: true,
    })
    this.fetchMappingDate()
  }
  onCheckBoxChange = (e) => {
    this.setState({
      prompt: e.target.checked,
    })
  }
  render() {
    // const { subscriptionList } = this.state
    const { subscriptionList, advancedSearch } = this.props
    const { length: subscriptionListLength } = subscriptionList
    return (
      <div className={this.props.className}>
        {/* {subscriptionListLength > 0 && (
          <Subscription
            subscriptionList={subscriptionList}
            onDeleteSubscription={this.handleDeleteSubscription}
            onCurrentSubscriptionChange={this.handleCurrentSubscriptionChange}
            ref={dom => this.subscription = dom}
          />
        )} */}

        <div className={styles.advancedSearchCon}>
          <div className={styles.advancedSearch}>
            <AdvancedSearch
              value={advancedSearch}
              onChange={this.handleSearchChange}
              searchValue={this.state.searchValue}
              onSearchValueChange={this.handleSearchValueChange}
              onClear={this.handleClear}
              onSaveSubscription={this.handleSaveSubscription(advancedSearch)}
            />
            <EntInvite
              onCurrentSubscriptionChange={this.handleCurrentSubscriptionChange}
              data={this.props.advancedSearch}
              onClear={this.handleClear}
              isNewVersion={true}
            />
          </div>
        </div>
        <Modal
          visible={this.state.modalState}
          onCancel={this.handleModalCancel}
          centered={true}
          footer={null}
          width={360}
          className={styles.dataChange}
        >
          <div className={styles.content}>
            {' '}
            <span>更改检索条件将清空数据面板中的筛选项</span>
          </div>
          <Checkbox
            style={{ marginLeft: '8px' }}
            checked={this.state.prompt}
            onChange={this.onCheckBoxChange}
          >
            下次不再提示
          </Checkbox>
          <div className={styles.cancel}>
            <Button
              key="cancel"
              onClick={this.handleOk}
              type="primary"
              className={styles.buttonCancel}
            >
              我知道了
            </Button>
          </div>
        </Modal>
      </div>
    )
  }
}
