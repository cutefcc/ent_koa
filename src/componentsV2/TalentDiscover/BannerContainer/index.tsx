import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import * as moment from 'moment'
import { Icon, Button } from 'mm-ent-ui'
import * as styles from './index.less'

export interface Props {
  urlPrefix?: string
  dispatch?: (obj: object) => any
  currentUser: string
  bannerData: object
}

export interface State {}

@connect((state: any) => ({
  urlPrefix: state.global.urlPrefix,
  currentUser: state.global.currentUser,
  bannerData: state.talentDiscover.bannerData,
}))
export default class Banner extends React.PureComponent<Props, State> {
  state = {
    show: true,
  }

  banner = {
    url: 'https://maimai.cn/ent/activity2/21/zt/01/index.html?fr=zhaopinpc', // 点击banner的跳转链接
    img: '/images/banner_PC_1128_120.jpg', // banner 图片
    startDate: '2021-03-08', // banner开始时间，表示 零点
    endDate: '2021-03-21', // banner结束日期，表示至当天 23:59:59
    alt: '跳槽攻略', // 当 banner 图片不存在时的占位文字
  }

  componentDidMount() {
    this.fetchBannerData(this.props)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.currentUser !== newProps.currentUser) {
      this.fetchBannerData(newProps)
    }
  }

  fetchBannerData = (props) => {
    const cid = R.pathOr('', ['currentUser', 'cid'], props)
    const uid = R.pathOr('', ['currentUser', 'ucard', 'id'], props)
    if (cid && uid) {
      props.dispatch({
        type: 'talentDiscover/fetchBannerData',
        payload: {
          cid,
          uid,
        },
      })
    }
  }

  handleGoSignUp = (entryConf) => {
    const { land_page } = entryConf
    if (!land_page) {
      return
    }
    window.open(land_page, '_blank')
  }

  handleHideBanner = () => {
    // const cid = R.pathOr('', ['currentUser', 'cid'], this.props);
    // const uid = R.pathOr('', ['currentUser', 'ucard', 'id'], this.props);
    // this.props
    //     .dispatch({
    //       type: 'talentDiscover/closeBanner',
    //       payload: {
    //         cid,
    //         uid,
    //       }
    //     }).then(() => {
    //       this.fetchBannerData(this.props)
    //     })
    this.setState({
      show: false,
    })
  }

  handleBannerClick = () => {
    if (window.voyager) {
      window.voyager.trackEvent(
        'jobs_pc_v2_banner_click',
        'jobs_pc_v2_banner_click',
        {
          url: encodeURIComponent(this.banner.url),
        }
      )
    }
  }

  render() {
    // const showEntry = R.pathOr(false, ['bannerData', 'show_entry'], this.props)
    // const entryConf = R.pathOr({}, ['bannerData', 'entry_conf'], this.props)
    // return (showEntry && entryConf.banner) ?
    //   (<div className={styles.banner}>
    //   <a
    //       href={entryConf.land_page || ''}
    //       target="_blank"
    //       rel="noopener noreferrer"
    //       className={styles.bannerLink}
    //   >
    //     <img
    //       src={entryConf.banner || ''}
    //       alt="春招报名"
    //       className={styles.bannerImg}
    //     />
    //   </a>
    //   <Button
    //     className={styles.operateBtn}
    //     onClick={() => this.handleGoSignUp(entryConf)}
    //     type="primary"
    //   >
    //     {entryConf.btn || '去看看'}
    //   </Button>
    //   <Icon
    //     type='close-outline'
    //     className={styles.closeIcon}
    //     onClick={this.handleHideBanner}
    //   />
    // </div>) : null
    const expiryTime = moment(
      `${this.banner.endDate} 23:59:59`,
      'YYYY-MM-DD hh:mm:ss'
    ).unix()
    const startTime = moment(
      `${this.banner.startDate} 00:00:00`,
      'YYYY-MM-DD hh:mm:ss'
    ).unix()
    const currentTime = moment().unix()
    if (
      !this.state.show ||
      currentTime < startTime ||
      currentTime > expiryTime
    ) {
      return null
    }

    return (
      <div className={styles.banner}>
        <a
          href={`${this.banner.url}?fr=ent`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.bannerLink}
          onClick={this.handleBannerClick}
        >
          <img
            src={`${this.props.urlPrefix}${this.banner.img}`}
            alt={this.banner.alt}
            className={styles.bannerImg}
          />
        </a>
        <Icon
          type="close-outline"
          className={styles.closeIcon}
          onClick={this.handleHideBanner}
        />
      </div>
    )
  }
}
