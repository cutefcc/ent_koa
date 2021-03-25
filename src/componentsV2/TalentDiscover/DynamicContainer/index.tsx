import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import * as $ from 'jquery'
import { Spin, Loading } from 'mm-ent-ui'
import UpgradeMemberTip from './UpgradeMemberTip'
import DynamicDetailModal from 'componentsV2/Common/TalentCard/DynamicDetailModal'
import EmptyTip from 'componentsV2/Common/EmptyTip'
import UnCopy from 'componentsV2/Common/UnCopy'
import { getFr } from 'utils';
import { TABTYPEMAP } from 'constants/talentDiscover'
import CompanyFansHoverEmpty from 'componentsV3/CompanyFansHover/CompanyFansHoverEmpty'
import Title from './Title'
import Card from './Card'
import { Affix } from 'antd'
import * as styles from './index.less'

export interface Props {
  loading: boolean,
  data: object,
  currentUser: object,
  trackParam: object,
  pagination: object,
  currentTab: string,
  sid: string,
  auth: object,
  refRight: HTMLBaseElement,
  version?: string,
  advancedSearch: object,
  subscriptionIdForV2: string,
}

export interface State {
  userInfo: object,
  // showDetailModal: boolean,
}

@connect(state => ({
  loading: state.loading.effects['talentDiscover/fetchData'],
  data: state.talentDiscover.dynamic,
  pagination: state.talentDiscover.paginationParam,
  advancedSearch: state.talentDiscover.advancedSearch,
  subscriptionIdForV2: state.talentDiscover.subscriptionIdForV2,
  sid: state.talentDiscover.sid,
  currentUser: state.global.currentUser,
  currentTab: state.talentDiscover.currentTab,
  currentGroup: state.talentDiscover.currentGroup,
  urlPrefix: state.global.urlPrefix,
  auth: state.global.auth,
}))
export default class DynamicContainer extends React.PureComponent<Props, State> {
  state = {
    userInfo: {},
    dynamicContainerHeight: '',
    titleRefAffix: false,
    // showDetailModal: false,
  }

  componentDidMount() {
    // const {track} = this.props
    // 初始化的时候给人才动态栏打点
    // const params = {
    //   eventName: 'jobs_pc_talent_bank_dynamic_switch',
    //   trackParam: {
    //     tab_name: 'all',
    //     sid,
    //     ...this.props.trackParam,
    //   },
    // }
    // if (track && typeof track === 'function') {
    //   track(params)
    // }
  }

  handleUserInfoChange(data) {
    this.setState({
      userInfo: data,
    })
  }

  // handleShowDetailModal = () => {
  //   this.setState({showDetailModal: true})
  // }

  // handleHiddenDetailModal = () => {
  //   this.setState({showDetailModal: false})
  // }

  renderContent = () => {
    const { data, loading, pagination, auth, version } = this.props
    const { page, size } = pagination
    const { list = [], pos = 0 } = data
    // 默认要切完整的每页总数

    const currentShow = R.max(0, pos - (page - 1) * size)


    // 是否低权限
    const { limitDynamicCount } = auth
    const firstList = limitDynamicCount ? list.slice(0, currentShow) : list
    const lastList = limitDynamicCount ? list.slice(currentShow) : []
    const showMemberTip =
      limitDynamicCount && lastList.length > 0

    return <div>
      {!loading && firstList.map((talent, i) => this.renderCard(talent, i))}
      {!loading && showMemberTip && <UpgradeMemberTip version={version} />}
      {!loading && lastList.map((talent, i) => this.renderCard(talent, i, true))}
      {this.renderDefault()}
    </div>
  }

  renderEmptyImg = () => {
    const src = `${this.props.urlPrefix}/images/empty_subscription.png`
    return <img src={src} alt="emptyImage" className={styles.emptyImage} />
  }

  renderEmpty = () => {
    const { currentTab, version } = this.props
    if (version === '3.0') {
      const map = {
        talent: '暂无匹配人才',
        dynamic: '暂无匹配动态',
      }
      // 判断是否选中企业粉丝
      const isFans = R.pathOr(0, ['props', 'advancedSearch', 'is_fans'], this) === 1
      return (
        <div className={styles.defaultTip}>
          <div>
            <p>{this.renderEmptyImg()}</p>
          </div>
          <p className={isFans ? styles.guideButtonTextV3 : styles.guideButtonText}>{map[currentTab]}</p>
          {isFans && <CompanyFansHoverEmpty />}
        </div>
      )
    } else {
      const map = {
        talent: '无匹配人才',
        dynamic: '无匹配动态',
      }
      return (
        <div className={styles.defaultTip}>
          <div>
            <p>{this.renderEmptyImg()}</p>
          </div>
          <p className={styles.guideButtonText}>{map[currentTab]}</p>
        </div>
      )
    }
  }

  renderDefault = () => {
    const { list = [] } = this.props.data
    const { version } = this.props
    const isEmpty = list.length === 0
    const isLoading = this.props.loading

    return [
      !isLoading && isEmpty && version !== '3.0' && <EmptyTip tip={'暂无动态'} />,
      !isLoading && isEmpty && version === '3.0' && this.renderEmpty(),
      isLoading && (
        <p style={{ marginTop: '15%', paddingBottom: '30%' }} className="text-center margin-top-32"><Loading /><span className="color-gray400 margin-left-8">加载中...</span></p>
      ),
    ]
  }

  renderCard = (talent, pageIndex, mosaic = false) => {
    const { currentTab, sid, refRight, version = '', advancedSearch, subscriptionIdForV2 } = this.props
    const param = {
      u2: talent.talent.id,
      type: TABTYPEMAP[currentTab],
      sid,
      page_position: pageIndex,
      fr: getFr(currentTab),
      search: advancedSearch,
      subid: subscriptionIdForV2,
      isV2: R.pathOr('0', ['props', 'currentUser', 'isV3'], this) ? '0' : '1',
    }
    return (
      <Card
        data={talent}
        key={`${talent.id} card`}
        trackParam={param}
        mosaic={mosaic}
        // onShowDetailModal={this.handleShowDetailModal}
        onUserInfoChange={data => {
          this.handleUserInfoChange(data)
        }}
        scrollDom={refRight}
        version={version}
        fr={R.pathOr(false, ['props', 'currentUser', 'isV3'], this) || R.isEmpty(this.props.currentGroup) ? 'discoverDynamicListForPc' : 'groupDynamicListForPc'}
      />
    )
  }

  renderDetailModal = () => {
    const { userInfo } = this.state
    const { trackParam } = this.props
    return (
      <DynamicDetailModal
        params={userInfo}
        // onHiddenDetailModal={this.handleHiddenDetailModal}
        trackParam={trackParam}
      />
    )
  }

  render() {
    const { currentTab, sid, version } = this.props
    const param = {
      type: TABTYPEMAP[currentTab],
      sid,
    }
    return (
      <UnCopy className={styles.dynamicContainer}>
        {/* <div className={styles.dynamicContainer}> */}
        <Affix target={() => this.props.refRight} offsetTop={version === '3.0' ? 56 : 0}>
          <Title trackParam={param} version={version} />
        </Affix>

        <div className="padding-left-16 padding-right-16 position-relative">
          <div className={styles.content}>
            {
              this.renderContent()
            }
          </div>
        </div>
        {/* {this.state.showDetailModal && this.renderDetailModal()} */}
        {/* </div> */}
      </UnCopy>
    )
  }
}
