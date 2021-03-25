import * as React from 'react'
import { connect } from 'react-redux'
import { Select, Button } from 'antd'

import List from 'componentsV2/Asset/CompanyAsset/List'
// import DealRecord from 'componentsV2/Asset/Common/DealRecord'

import * as styles from './index.less'

export interface Props {
  assetLoading: boolean
  recordLoading: boolean
  currentUser: object
}

export interface State {
  staff: object[]
  balance: number
  batch_invite_balance: number
  reach_nbr: number
  searchMobile: number
}

@connect((state) => ({
  assetLoading: state.loading.effects['companyAsset/fetch'],
  recordLoading: state.loading.effects['companyAsset/fetchDealRecord'],
  currentUser: state.global.currentUser,
}))
export default class Enterprise extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      staff: [],
      balance: 0,
      batch_invite_balance: 0,
      reach_nbr: 0,
      // records: [],
      // recordRemain: false,
      // recordPage: 0,
      searchMobile: undefined,
    }
  }

  componentDidMount() {
    this.fetchAsset()
    // this.refreshRecord()
  }

  getFilteredStaff = () => {
    const { searchMobile } = this.state
    const res = searchMobile
      ? this.state.staff.filter(
          ({ sub_mobile: mobile }) => mobile && mobile === searchMobile
        )
      : this.state.staff

    return res
  }

  fetchAsset = () => {
    this.props
      .dispatch({
        type: 'companyAsset/fetch',
        payload: {
          page: 0,
          size: 1000,
        },
      })
      .then(({ data = {} }) => {
        this.setState({
          staff: data.staff,
          balance: data.balance,
          batch_invite_balance: data.batch_invite_balance,
          reach_nbr: data.reach_nbr,
        })
      })
  }

  loadMoreRecord = () => {
    this.setState(
      {
        recordPage: this.state.recordPage + 1,
      },
      () => {
        this.loadRecord().then((/* {data} */) => {
          this.setState({
            // records: [...this.state.records, ...data.records],
            // recordRemain: !!data.remain,
          })
        })
      }
    )
  }

  refreshRecord = () =>
    this.setState(
      {
        recordPage: 0,
      },
      () => {
        this.loadRecord().then((/* {data} */) => {
          this.setState({
            // records: data.records,
            // recordRemain: !!data.remain,
          })
        })
      }
    )

  loadRecord = () =>
    this.props.dispatch({
      type: 'companyAsset/fetchDealRecord',
      payload: {
        page: this.state.recordPage,
        mobile: this.state.searchMobile,
      },
    })

  handleSearchByMobile = (searchMobile) => {
    this.setState({
      searchMobile,
    })
  }

  handleClearMobile = () => {
    this.setState({
      searchMobile: undefined,
    })
  }

  renderBalance = () => {
    const { balance, batch_invite_balance, reach_nbr } = this.state
    const {
      currentUser: { reach, equity_sys_type },
    } = this.props
    const array = [
      `资产余额： ${balance} 点`,
      `智能邀约：${batch_invite_balance} 次`,
    ]
    let title = ''

    if (equity_sys_type === 1) {
      title = '电话沟通券'
    } else if (equity_sys_type === 2) {
      title = '未分配电话沟通劵'
    }

    if (reach && reach.reach_type === 3 && title) {
      array.push(`${title}：${reach_nbr} 次`)
    }

    return <p className={styles.balance}>{array.join('，')}</p>
  }

  render() {
    const { staff, balance, batch_invite_balance, reach_nbr } = this.state
    return (
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span>
              <Select
                showSearch
                style={{ width: 200 }}
                className={styles.mobileSearch}
                onChange={this.handleSearchByMobile}
                placeholder="输入员工手机号"
                value={this.state.searchMobile}
              >
                {staff
                  .filter(({ sub_mobile: mobile }) => !!mobile)
                  .map(({ sub_mobile: mobile }) => (
                    <Select.Option value={mobile} key={mobile}>
                      {mobile}
                    </Select.Option>
                  ))}
              </Select>
              {this.state.searchMobile !== undefined && (
                <Button
                  className="like-link-button margin-left-16 color-dilution"
                  onClick={this.handleClearMobile}
                >
                  清空
                </Button>
              )}
            </span>
            {this.renderBalance()}
          </div>
          <List
            data={this.getFilteredStaff()}
            balance={balance}
            batch_invite_balance={batch_invite_balance}
            reach_nbr={reach_nbr}
            refresh={this.fetchAsset}
            loading={this.props.assetLoading}
          />
          {/* <DealRecord
            onLoadMore={this.loadMoreRecord}
            hasMore={this.state.recordRemain}
            data={records}
            loading={this.state.recordLoading}
          /> */}
        </div>
      </div>
    )
  }
}
