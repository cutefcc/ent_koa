import * as React from 'react'
import { connect } from 'react-redux'
import { Select, Button } from 'antd'
import * as R from 'ramda'
import EquityList from 'componentsV2/Asset/CompanyAsset/EquityList'

import * as styles from './index.less'

export interface Props {
  assetLoading: boolean
}

export interface State {
  staff: object[]
  balance: number
  searchMobile: number
  addfr: number
  uh: number
  direct_oppo: number
  reachNbr: number
}

@connect((state) => ({
  assetLoading: state.loading.effects['companyAsset/fetch'],
  currentUser: state.global.currentUser,
}))
export default class EnterpriseCoupon extends React.PureComponent<
  Props,
  State
> {
  constructor(props) {
    super(props)
    this.state = {
      staff: [],
      balance: 0,
      addfr: 0, // 配额体系：加好友剩余数量
      uh: 0, // 配额体系：极速联系剩余数量
      direct_oppo: 0, // 配额体系：立即沟通剩余数量
      searchMobile: undefined,
      reachNbr: 0,
    }
  }

  componentDidMount() {
    this.fetchAsset()
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
      .then(({ data }) => {
        this.setState({
          staff: data.staff,
          balance: data.balance,
          addfr: data.addfr || 0,
          uh: data.uh || 0,
          direct_oppo: data.purchase_left || 0, //data.direct_oppo || 0,
          reachNbr: data.reach_nbr || 0,
        })
      })
  }

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
    const {
      currentUser: { reach },
    } = this.props
    const { staff, addfr, uh, direct_oppo, reachNbr } = this.state
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
            <p className={styles.unassign}>
              {R.pathOr(0, ['props', 'currentUser', 'identity'], this) ===
              6 ? null : (
                <span className={styles.addfr}>
                  未分配加好友券 <em>{addfr}</em>
                </span>
              )}
              {R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6 ? (
                <span className={styles.addfr}>
                  未分配立即沟通券 <em>{direct_oppo}</em>
                </span>
              ) : (
                <span className={styles.addfr}>
                  未分配极速联系券 <em>{uh}</em>
                </span>
              )}
              {reach && reach.reach_type === 3 && (
                <span>
                  未分配电话沟通券 <em>{reachNbr}</em>
                </span>
              )}
            </p>
          </div>
          <EquityList
            data={this.getFilteredStaff()}
            addfr={addfr}
            uh={uh}
            direct_oppo={direct_oppo}
            reachNbr={reachNbr}
            refresh={this.fetchAsset}
            loading={this.props.assetLoading}
          />
        </div>
      </div>
    )
  }
}
