import React from 'react'
import { connect } from 'react-redux'
import { Select, Button } from 'antd'

import List from 'components/Account/CompanyAsset/List'
// import DealRecord from 'components/Account/Common/DealRecord'

import styles from './companyAsset.less'

@connect((state) => ({
  assetLoading: state.loading.effects['companyAsset/fetch'],
  recordLoading: state.loading.effects['companyAsset/fetchDealRecord'],
}))
export default class Staff extends React.PureComponent {
  state = {
    staff: [],
    balance: 0,
    // records: [],
    // recordRemain: false,
    // recordPage: 0,
    searchMobile: undefined,
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

  render() {
    const { staff, balance /* , records */ } = this.state
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
            <p className={styles.balance}>资产余额： {balance} 点</p>
          </div>
          <List
            data={this.getFilteredStaff()}
            balance={balance}
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
