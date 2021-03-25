import * as React from 'react'
import * as R from 'ramda'
import Subscription from './Subscription/index'
import AdvancedSearch from './AdvancedSearch/index'
import { Message } from 'mm-ent-ui'
import { Modal } from 'antd'
import { trackEvent } from 'utils'
import EntInvite from 'componentsV2/Common/EntInvite'
import { INIT_ADVANCE_SEARCH } from 'constants/talentDiscover'
import { debounce, asyncExtraData } from 'utils/index'
import * as styles from './index.less'
import { connect } from 'react-redux'

export interface Props {
  advancedSearch: object,
  dispatch?: (obj: object) => any,
  className?: string,
  subscriptionList: object[],
  showSearchValue: boolean,
}

export interface State {
  subscriptionVisible: boolean,
  // subscriptionList: object[],
  searchValue: string,
}

@connect((state: any) => ({
  advancedSearch: state.talentDiscover.advancedSearch,
  subscriptionList: state.talentDiscover.subscriptionList,
  showSearchValue: state.talentDiscover.showSearchValue,
}))
export default class AdvancedSearchContainer extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      subscriptionVisible: true,
      // subscriptionList: [],
      searchValue: '',
    }
  }

  componentWillMount() {
    this.fetchTalentDiscoverDataDebounce = debounce(this.handlefetchDataDebounce, 500)
  }

  componentDidMount() {
    this.fetchSubscriptionList()
    this.checkSearchValue()
  }

  componentWillReceiveProps(newProps) {
    if (newProps.showSearchValue !== this.props.showSearchValue) {
      this.checkSearchValue(newProps)
    }
  }

  checkSearchValue = props => {
    props = props || this.props
    if (!props.showSearchValue) {
      this.setState({
        searchValue: '',
      })
    }
  }

  fetchSubscriptionList = () => {
    this.props.dispatch({
      type: 'subscribe/fetchConditionList',
      payload: {},
    }).then((res) => {
      // this.setState({
      //   subscriptionList: res.data ? res.data.list : []
      // })
      this.props.dispatch({
        type: 'talentDiscover/setSubscriptionList',
        payload: res.data ? res.data.list : [],
      })
    }, (err) => {
    })
  }

  handleSearchChange = (searchParam: object, isSubscription: boolean | void) => {
    const query = R.propOr(R.propOr('', 'search_query', searchParam), 'query', searchParam)
    this.setState({
      searchValue: query,
    })
    this.props.dispatch({
      type: 'talentDiscover/setAdvancedSearch',
      payload: {
        ...searchParam,
        query,
      },
    })
    this.fetchTalentDiscoverDataDebounce(isSubscription ? R.propOr('', 'id', searchParam) : null)
  }

  handlefetchDataDebounce = (subId) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'talentDiscover/fetchData',
      payload: {
        subId,
      },
    }).then(data => {
      if (data) {
        const { list = [] } = data
        asyncExtraData(dispatch, list)
      }
    })
  }

  handleSaveSubscription = (advancedSearch: object) => () => {
    trackEvent('jobs_pc_talent_save_subscribe_click')
    this.props.dispatch({
      type: 'subscribe/addCondition',
      payload: {
        ...advancedSearch
      },
    }).then(() => {
      this.fetchSubscriptionList()
      Message.success({
        content: '添加人才订阅成功!',
      })
    })
  }

  handleDeleteSubscription = (id: number | string) => {
    Modal.confirm({
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
      onCancel: () => {
      },
      okText: '确认删除',
      cancelText: '取消',
    })
  }

  handleCurrentSubscriptionChange = (item: object) => {

    this.handleSearchChange(item, true)
  }

  handleClear = () => {
    if (!(JSON.stringify(this.props.advancedSearch) === JSON.stringify(INIT_ADVANCE_SEARCH))) {
      this.handleSearchChange(INIT_ADVANCE_SEARCH, false)
    }

    this.setState({
      searchValue: ''
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
      searchValue: e.target.value
    })
    this.props.dispatch({
      type: 'talentDiscover/setAdvancedSearch',
      payload: {
        ...advancedSearch,
        query: e.target.value
      },
    })
  }

  render() {
    // const { subscriptionList } = this.state
    const { subscriptionList, advancedSearch } = this.props
    const { length: subscriptionListLength } = subscriptionList
    return (
      <div className={this.props.className}>
        {subscriptionListLength > 0 && (
          <Subscription
            subscriptionList={subscriptionList}
            onDeleteSubscription={this.handleDeleteSubscription}
            onCurrentSubscriptionChange={this.handleCurrentSubscriptionChange}
            ref={dom => this.subscription = dom}
          />
        )}

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
      </div>
    )
  }
}
