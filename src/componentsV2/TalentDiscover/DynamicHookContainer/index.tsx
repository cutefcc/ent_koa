import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import * as $ from 'jquery'
import textToImage from 'utils/textToImage'
import { TABTYPEMAP } from 'constants/talentDiscover'
import Carousel from 'antd/lib/carousel'
import UnCopy from 'componentsV2/Common/UnCopy'

import Card from '../DynamicContainer/Card'
import * as styles from './index.less'
import 'antd/lib/carousel/style/index.less'

const backgroundImageStyle = {
  marginX: 45,
  marginY: 90,
  line2Coordinate: '73px 73px',
  line3Coordinate: '146px 146px',
}

export interface Props {
  loading: boolean
  data: object
  currentUser: object
  trackParam: object
  sid: string
  currentTab: string
}

export interface State {
  backgroundUrl: string
}

@connect((state) => ({
  loading: state.loading.effects['talentDiscover/fetchData'],
  data: state.talentDiscover.dynamicHook,
  sid: state.talentDiscover.sid,
  currentUser: state.global.currentUser,
  currentTab: state.talentDiscover.currentTab,
}))
export default class DynamicContainer extends React.PureComponent<
  Props,
  State
> {
  state = {
    backgroundUrl: '',
  }

  componentDidMount() {
    this.setBackgroundUrl(this.props)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.currentUser !== newProps.currentUser) {
      this.setBackgroundUrl(newProps)
    }
  }

  setBackgroundUrl = (props) => {
    const { currentUser } = props
    const name = R.pathOr('', ['ucard', 'name'], currentUser)
    const mobile = R.pathOr('', ['ucard', 'mobile_last_four'], currentUser)
    this.setState({
      backgroundUrl: textToImage(`${name} ${mobile}`, {
        textColor: '#EDEFF5',
        fontSize: 13,
        rotate: -30,
        fontFamily: 'PingFangSC-Thin',
        ...backgroundImageStyle,
      }),
    })
  }

  handleTrackProfilePanelShow = (item, index) => {
    if (R.isEmpty(item)) {
      return
    }
    const u2 = item.id
    if (window.voyager) {
      const param = {
        datetime: new Date().getTime(),
        uid: window.uid,
        u2,
        sid: this.props.sid,
        type: TABTYPEMAP[this.props.currentTab],
        page_position: index,
      }
      const key = 'jobs_pc_talent_dynamic_profile_carousel_panel_show'
      window.voyager.trackEvent(key, key, param)
    }
  }

  handleBeforeChange = (index) => {
    const { data } = this.props
    const { list = [] } = data
    let showList = list.length <= 20 ? list : list.slice(0, 20)
    const talent = R.pathOr({}, [index, 'talent'], showList)
    this.handleTrackProfilePanelShow(talent, index)
  }

  renderCard = (talent, pageIndex, mosaic = false) => {
    const { sid, currentTab, trackParam } = this.props
    const param = {
      sid,
      u2: talent.talent.id,
      type: TABTYPEMAP[currentTab],
      page_position: pageIndex,
      ...trackParam,
    }
    return (
      <Card
        data={talent}
        key={`${talent.id} card`}
        trackParam={param}
        mosaic={mosaic}
        showDynamicDetail={false}
        showGapLine={false}
        className={styles.card}
        avatarStyle={{
          width: 20,
          height: 20,
          lineHeight: '20px',
          fontSize: '12px',
          color: '#999',
        }}
        showIcon={false}
        fr="hook"
      />
    )
  }

  render() {
    const { data } = this.props
    const { list = [] } = data
    const showList = list.length <= 20 ? list : list.slice(0, 20)

    if (showList.length === 0) {
      return null
    }

    return (
      <UnCopy className={styles.carouselWrapper}>
        <div className={styles.triangle}></div>
        <Carousel
          dotPosition="right"
          autoplay
          className={styles.carousel}
          dots={false}
          beforeChange={this.handleBeforeChange}
        >
          {showList.map((talent, i) => this.renderCard(talent, i))}
        </Carousel>
      </UnCopy>
    )
  }
}
