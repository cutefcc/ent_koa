import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import * as $ from 'jquery'
import { Loading } from 'mm-ent-ui'
import { getFr } from 'utils'
import UpgradeMemberTip from './UpgradeMemberTip'
import DynamicDetailModal from './DynamicDetailModal'
import EmptyTip from 'componentsV2/Common/EmptyTip'
import UnCopy from 'componentsV2/Common/UnCopy'
import { TABTYPEMAP } from 'constants/talentDiscover'
import CompanyFansHoverEmpty from 'componentsV3/CompanyFansHover/CompanyFansHoverEmpty'
import Title from './Title'
import Card from './Card'
import { Affix } from 'antd'
import * as styles from './index.less'

export interface Props {
  loading: boolean
  data: object
  currentUser: object
  trackParam: object
  pagination: object
  currentTab: string
  sid: string
  auth: object
  refRight: HTMLBaseElement
}

export interface State {
  userInfo: object
  // showDetailModal: boolean,
}

@connect((state) => ({
  loading: state.loading.effects['groups/fetchData'],
  data: state.groups.dynamic,
  pagination: state.groups.paginationParam,
  sid: state.groups.sid,
  checkboxGroup: state.groups.checkboxGroup,
  currentUser: state.global.currentUser,
  currentTab: state.groups.currentTab,
  auth: state.global.auth,
  urlPrefix: state.global.urlPrefix,
}))
export default class DynamicContainer extends React.PureComponent<
  Props,
  State
> {
  state = {
    userInfo: {},
    dynamicContainerHeight: '',
    titleRefAffix: false,
    // showDetailModal: false,
  }

  componentDidMount() {}

  handleUserInfoChange(data) {
    this.setState({
      userInfo: data,
    })
  }

  renderContent = () => {
    const { data, loading, pagination, auth } = this.props
    const { page, size } = pagination
    const { list = [], pos = 0 } = data
    // 默认要切完整的每页总数

    const currentShow = R.max(0, pos - (page - 1) * size)

    // 是否低权限
    const { limitDynamicCount } = auth
    const firstList = limitDynamicCount ? list.slice(0, currentShow) : list
    const lastList = limitDynamicCount ? list.slice(currentShow) : []
    const showMemberTip = limitDynamicCount && lastList.length > 0

    return (
      <div>
        {!loading && firstList.map((talent, i) => this.renderCard(talent, i))}
        {!loading && showMemberTip && <UpgradeMemberTip />}
        {!loading &&
          lastList.map((talent, i) => this.renderCard(talent, i, true))}
        {this.renderDefault()}
      </div>
    )
  }

  renderDefault = () => {
    const { list = [] } = this.props.data
    const isEmpty = list.length === 0
    const { currentTab } = this.props
    const isLoading = this.props.loading
    const map = {
      talent: '暂无匹配人才',
      dynamic: '暂无匹配动态',
    }
    // 判断是否选中企业粉丝
    const isFans =
      R.pathOr([], ['props', 'checkboxGroup'], this).find(
        (item) => item === 'is_fans'
      ) !== undefined
    return [
      !isLoading && isEmpty && (
        <div className={styles.defaultTip}>
          <div>
            <p>{this.renderEmptyImg()}</p>
          </div>
          <p
            className={
              isFans ? styles.guideButtonTextV3 : styles.guideButtonText
            }
          >
            {map[currentTab]}
          </p>
          {isFans && <CompanyFansHoverEmpty />}
        </div>
      ),
      isLoading && (
        <p
          style={{ marginTop: '15%', paddingBottom: '30%' }}
          className="text-center margin-top-32"
        >
          <Loading />
          <span className="color-gray400 margin-left-8">加载中...</span>
        </p>
      ),
    ]
  }

  renderEmptyImg = () => (
    <img
      src={`${this.props.urlPrefix}/images/empty_subscription.png`}
      alt="emptyImage"
      className={styles.emptyImage}
    />
  )

  renderCard = (talent, pageIndex, mosaic = false) => {
    const { currentTab, sid, refRight } = this.props
    const param = {
      u2: talent.talent.id,
      type: TABTYPEMAP[currentTab],
      sid,
      page_position: pageIndex,
      fr: getFr(currentTab),
    }
    return (
      <Card
        data={talent}
        key={`${talent.id} card`}
        trackParam={param}
        mosaic={mosaic}
        // onShowDetailModal={this.handleShowDetailModal}
        onUserInfoChange={(data) => {
          this.handleUserInfoChange(data)
        }}
        scrollDom={refRight}
        fr="groupDynamicListForPc"
      />
    )
  }

  render() {
    const { currentTab, sid } = this.props
    const param = {
      type: TABTYPEMAP[currentTab],
      sid,
    }
    return (
      <UnCopy className={styles.dynamicContainer}>
        <Affix target={() => this.props.refRight} offsetTop={56}>
          <Title trackParam={param} />
        </Affix>

        <div className="padding-left-16 padding-right-16 position-relative">
          <div className={styles.content}>{this.renderContent()}</div>
        </div>
      </UnCopy>
    )
  }
}
