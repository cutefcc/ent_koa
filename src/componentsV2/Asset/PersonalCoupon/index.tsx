import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import * as styles from './index.less'

export interface Props {
  assetLoading: boolean,
}

export interface State {
  addfr: number,
  uh: number,
  direct_oppo: number,
  reach: number,
}

@connect(state => ({
  assetLoading: state.loading.effects['personalAsset/fetch'],
  currentUser: state.global.currentUser,
}))
export default class PersonalCoupon extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      addfr: 0,
      uh: 0,
      direct_oppo: 0,
      reach: 0,
    }
  }

  componentDidMount() {
    this.fetchAsset()
  }

  fetchAsset = () => {
    this.props
      .dispatch({
        type: 'personalAsset/fetch',
      })
      .then(({ data }) => {
        this.setState({
          addfr: data.addfr || 0,
          uh: data.uh || 0,
          direct_oppo: data.direct_oppo || 0,
          reach: data.reach || 0,
        })
      })
  }

  renderLeftItem = ({ value, text }) => {
    return <div className={`flex-column flex-justify-center flex-align-center ${styles.leftItem}`}>
      <p className={styles.value}>{value}</p>
      <p className={styles.text}>{text}</p>
    </div>
  }

  render() {
    const { currentUser: { reach: { reach_type } } } = this.props;
    const { addfr, uh, direct_oppo, reach } = this.state;
    const isV3 = R.pathOr(0, ['props', 'currentUser', 'identity'], this) === 6;
    return (
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.header}>本月剩余资产</div>
          <div className='flex'>
            {
              this.renderLeftItem({
                value: addfr,
                text: '加好友券',
              })
            }
            {
              !isV3 && this.renderLeftItem({
                value: uh,
                text: '极速联系券',
              })
            }
            {
              isV3 && this.renderLeftItem({
                value: direct_oppo,
                text: '立即沟通券',
              })
            }
            {
              reach_type === 2 || reach_type === 3 ? this.renderLeftItem({
                value: reach,
                text: reach_type === 2 ? '电话次数（今日剩余）' : '电话沟通券',
              }) : null
            }
          </div>
        </div>
      </div>
    )
  }
}
