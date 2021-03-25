import React from 'react'
import { connect } from 'react-redux'
import TalentCard from 'components/Common/TalentCard/CommonCard'
import Avatar from 'components/Common/Avatar'
import PreviewButton from 'components/Common/RightButton/PreviewButton'
import { Typography, Icon, Popover, Loading, Empty } from 'mm-ent-ui'
import { getMMTimeStr } from 'utils/date'
// import {Popover} from 'antd'
import * as R from 'ramda'

import styles from './card.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
  dynamicDetaillLoading:
    state.loading.effects['talentPool/fetchDynamicDetails'],
}))
export default class Card extends React.Component {
  state = {
    // trackParam: {
    //   source: 'talent_pool_index',
    // },
    dynamicDetail: {
      list: [],
      size: 100,
      start_time: 0,
    },
    isShowViewDetail: false,
    visible: false,
  }
  getTalentButtons = () => {
    const {
      data: { talent = {} },
      currentUser: { isV3 },
    } = this.props
    return [
      'aiCall',
      talent.direct_contact_st === 1 || isV3 ? 'directContact' : 'directIm',
    ]
  }

  getTalentFooterButtons = () => {
    const {
      data,
      currentUser: { isV3 },
    } = this.props
    const talent = R.propOr({}, 'talent', data)
    return isV3
      ? [
          'addRemark',
          'editGroup',
          talent.friend_state === 2 ? 'communicate' : '', // addFriend 去掉加好友
          // 'askForPhone',
        ]
      : [
          'addRemark',
          'editGroup',
          talent.friend_state === 2 ? 'communicate' : 'addFriend',
          // 'askForPhone',
        ]
  }

  setDom = (dom) => {
    this.dom = dom
  }

  fetchDynamicDetail = () => {
    const { onUserInfoChange } = this.props
    const userInfo = R.propOr({}, 'talent', this.props.data)
    this.props
      .dispatch({
        type: 'talentPool/fetchDynamicDetails',
        payload: {
          to_uid: this.props.data.talent.id,
          // start_time: this.state.dynamicDetail.lastTime || 0,
          size: this.state.dynamicDetail.size,
        },
      })
      .then(({ data }) => {
        const dynamicDetail = {
          ...this.state.dynamicDetail,
          list: data.list,
        }
        this.setState({
          dynamicDetail,
          isShowViewDetail: Array.isArray(data.list)
            ? data.list.some((item) => [5, 9].includes(item.event_type))
            : false,
        })
        // this.props.renderDetailJsx({...dynamicDetail, userInfo})
        onUserInfoChange({ userInfo })
      })
  }

  handleGynamicDetailVisibleChange = (visible) => {
    this.setState({ visible })
    if (visible) {
      this.fetchDynamicDetail()
    }
  }

  handleShowUpgradeMember = () => {
    this.props.dispatch({
      type: 'global/setMemberUpgradeTip',
      payload: {
        show: true,
      },
    })
  }

  handleSpreadChange = () => {
    const { mosaic, data } = this.props
    if (mosaic) {
      this.handleShowUpgradeMember()
      return
    }
    this.props.onSpreadChange(data)
  }

  renderTitle = () => {
    const { data, mosaic } = this.props
    const userInfo = R.propOr({}, 'talent', data)
    const title = mosaic ? (
      <img
        src={`${this.props.urlPrefix}/images/blurBg/${Math.floor(
          Math.random() * 6 + 1
        )}.png`}
        alt=""
        height="26px"
      />
    ) : (
      <span className="margin-left-16 font-size-14 color-stress font-weight-bold">
        {`${userInfo.company}·${userInfo.position}·${userInfo.name}`}
      </span>
    )
    return (
      <span className="flex-1 ellipsis flex flex-align-center">
        {title}
        {userInfo.judge === 1 && (
          <Icon type="v" className="color-orange2 margin-left-4 font-size-12" />
        )}
        <span className="margin-left-10 font-size-14 color-common ellipsis">
          {this.renderDescribe()}
        </span>
      </span>
    )
  }

  renderDynamicDetail = () => {
    const { list = [] } = this.state.dynamicDetail
    const { isShowViewDetail } = this.state
    const { onShowDetailModal } = this.props
    if (this.props.dynamicDetaillLoading) {
      return (
        <div>
          <Loading />
          <span className="color-dilution font-size-12 margin-left-8">
            正在加载...
          </span>
        </div>
      )
    }

    if (list.length === 0) {
      return <Empty className={styles.dynamicDetailEmpty} />
    }

    // const testList =  R.range(0, 21).map(() => ([
    //   {
    //     describe: "更新了个人信息",
    //     crtime: "2019-06-21 17:33:07"
    //   }
    // ]))

    return (
      <div className={`${styles.dynamicDetailCon}`}>
        <ul className={`margin-top-8 ${styles.dynamicDetail}`}>
          {list.map((item) => (
            <li className="flex space-between" key={`${item.uptime}popOver`}>
              <Typography.Text className="ellipsis">
                {item.describe}
              </Typography.Text>
              <Typography.Text
                type="secondary"
                className="margin-left-32 ellipsis"
              >
                {getMMTimeStr(item.uptime)}
              </Typography.Text>
            </li>
          ))}
        </ul>
        {isShowViewDetail && (
          <div
            onClick={() => {
              onShowDetailModal()
              this.setState({ visible: false })
            }}
            className={`${styles.viewDetail} color-blue font-size-12`}
          >
            查看明细
          </div>
        )}
      </div>
    )
  }

  renderDescribe = () => {
    const { data } = this.props
    // const visitHistory = R.propOr([], 'visit_company_home_page_history', data)
    // const content = (
    //   <div>
    //     <Typography.Text type="stress" strong size="14">
    //       访问记录
    //     </Typography.Text>
    //     <ul style={{padding: 0}} className="margin-top-8">
    //       {visitHistory.map(item => (
    //         <li className="flex space-between" key={item}>
    //           <Typography.Text>{item.split(' ')[0]}</Typography.Text>
    //           <Typography.Text type="secondary" className="margin-left-24">
    //             {item.split(' ')[1]}
    //           </Typography.Text>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // )
    // return visitHistory.length === 0 ? (
    //   data.describe
    // ) : (
    //   <Popover
    //     content={content}
    //     placement="bottom"
    //     getPopupContainer={() => this.dom || window}
    //   >
    //     {data.describe}
    //   </Popover>
    // )
    return data.describe
  }

  renderPreviewButton = () => {
    const { data, urlPrefix, mosaic } = this.props
    const userInfo = R.propOr({}, 'talent', data)
    return (
      <PreviewButton
        showDetail={false}
        data={userInfo}
        trackParam={this.props.trackParam}
        fr={this.props.fr}
        content={
          <Avatar
            avatar={
              mosaic
                ? `${urlPrefix}/images/avatar/${Math.floor(
                    Math.random() * 16 + 1
                  )}.png`
                : userInfo.avatar
            }
            name={R.propOr('保密', 'name', userInfo)}
            className={styles.avatar}
            key="avatar"
          />
        }
      />
    )
  }

  render() {
    const { data } = this.props
    const spread = this.props.spread || false
    const buttons = this.getTalentButtons()
    const footerButtons = this.getTalentFooterButtons()
    const userInfo = R.propOr({}, 'talent', data)

    const card = (
      <TalentCard
        data={userInfo}
        key={data.id}
        opButtons={buttons}
        footerButtons={footerButtons}
        trackParam={this.props.trackParam}
        fr={this.props.fr}
        showAvatar={false}
        showPhone
        showSource
        showExpectation
      />
    )

    const time = (
      <span className="color-dilution padding-left-16">
        <Popover
          content={this.renderDynamicDetail()}
          placement="bottom"
          visible={this.state.visible}
          onVisibleChange={this.handleGynamicDetailVisibleChange}
          getPopupContainer={() => this.dom || window}
        >
          <span className={styles.dynamicDetailButton}>查看Ta的动态</span>
        </Popover>
        {getMMTimeStr(data.uptime)}
        <Icon
          type={spread ? 'arrow-down-2' : 'arrow-right-2'}
          className="color-dilution font-size-14 margin-left-16"
        />
      </span>
    )
    return (
      <div
        className={`${styles.item} ${spread ? styles.active : ''}`}
        key={data.id}
        ref={this.setDom}
      >
        <div
          className="flex cursor-pointer flex-align-center"
          onClick={this.handleSpreadChange}
        >
          {this.renderPreviewButton()}
          {this.renderTitle()}
          {time}
        </div>
        {spread && <div className={styles.detail}>{card}</div>}
      </div>
    )
  }
}
