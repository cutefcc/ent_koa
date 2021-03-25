import React from 'react'
import { Text, FeedCard, Popover, Loading, RichText, Icon } from 'mm-ent-ui'
import PropTypes from 'prop-types'
import { compact, handleDownload } from 'utils'
import Highlighter from 'react-highlight-words'
import * as R from 'ramda'
import { connect } from 'react-redux'
import styles from './index.less'

@connect((state) => ({
  urlPrefix: state.global.urlPrefix,
  basicInfoLoading: state.loading.effects['profile/fetchBasicInfo'],
  expLoading: state.loading.effects['profile/fetchWorkAndEduExp'],
  cardListLoading: state.loading.effects['profile/fetchCardList'],
  uids: state.profile.uids,
  highLight: state.talentDiscover.highLight,
}))
export default class BasicInfo extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object,
    userTag: PropTypes.object,
    // eslint-disable-next-line react/no-unused-prop-types
    uid: PropTypes.number,
    getTarget: PropTypes.func,
    exp: PropTypes.object,
  }

  static defaultProps = {
    data: {},
    userTag: {},
    uid: '',
    getTarget: () => document.body,
    exp: {},
  }

  state = {
    commonFriends: {
      remain: false,
      data: [],
      page: 0,
      size: 5,
      stdname: '',
      type: '',
    },
  }

  fetchCardList = () => {
    const { commonFriends } = this.state
    const { data } = this.props
    this.props
      .dispatch({
        type: 'profile/fetchCardList',
        payload: {
          u2: data.id,
          stdname: commonFriends.stdname,
          page: commonFriends.page,
          count: commonFriends.size,
          type: commonFriends.type,
        },
      })
      .then(({ data: cardData = {} }) => {
        this.setState({
          commonFriends: {
            ...this.state.commonFriends,
            remain: !!cardData.more,
            data: cardData.contacts || [],
          },
        })
      })
  }

  handleToNextCardPage = () => {
    const { commonFriends } = this.state
    this.setState(
      {
        commonFriends: {
          ...commonFriends,
          page: commonFriends.page + 1,
        },
      },
      this.fetchCardList
    )
  }

  handleToPrevCardPage = () => {
    const { commonFriends } = this.state
    this.setState(
      {
        commonFriends: {
          ...commonFriends,
          page: commonFriends.page - 1 || 0,
        },
      },
      this.fetchCardList
    )
  }

  handleShowCommonFriends = (type, stdname) => (visible) => {
    const { commonFriends } = this.state
    if (visible) {
      this.setState(
        {
          commonFriends: {
            ...commonFriends,
            page: 0,
            stdname,
            type,
          },
        },
        this.fetchCardList
      )
    }
  }

  handleToDetail = (uid) => () => {
    const { uids = [] } = this.props
    this.props.dispatch({
      type: 'profile/setInfo',
      payload: {
        currentUid: uid,
        uids: [...uids, uid],
        currentIndex: uids.length,
      },
    })
  }

  handleToCompany = (info = {}) => () => {
    const { shareUrl, webcid } = info
    if (webcid) {
      window.open(shareUrl || `https://maimai.cn/company?webcid=${webcid}`)
    }
  }

  renderExpCard = (info, key, type) => {
    return (
      <FeedCard
        logoProps={{
          name: info.name,
          src: info.logo,
          onClick: type === 'workExp' ? this.handleToCompany(info) : null,
        }}
        line1={info.line1}
        line2={<Text type="text_primary">{info.line2}</Text>}
        line3={!info.line3 ? '' : <RichText text={info.line3} />}
        line4={info.line4}
        key={key}
        className="margin-top-16"
      />
    )
  }

  retreiveFileName = (name, position, worktime) => {
    return (
      [name, position, worktime ? `${worktime}工作经验` : ''].join('-') + '.pdf'
    )
  }

  renderResumeAttachment = () => {
    const { data } = this.props
    if (!data.resume || JSON.stringify(data.resume) === '{}') return null
    const { name, position, worktime, id } = data
    const {
      file_url,
      is_delivery,
      file_name = this.retreiveFileName(name, position, worktime),
    } = data.resume
    const extTypeArray = file_name.split('.')
    const extType = extTypeArray[extTypeArray.length - 1]

    return (
      <div className={styles.resumeAttachment}>
        <div className={styles.resumeInfo}>
          <img
            src={`${
              this.props.urlPrefix
            }/images/resume/${extType.toUpperCase()}.png`}
            width={40}
            height={40}
          />
          <div className={styles.resumeDetail}>
            <h6 className={styles.resumeTitle}>附件简历：</h6>
            <h6 className={styles.resumeName}>{file_name}</h6>
          </div>
        </div>
        <div>
          <div>
            <Icon
              type="download_s"
              className="margin-right-3"
              style={{ color: '#50679A', fontSize: '14px' }}
            />
            <span
              className={styles.resumeAction}
              onClick={handleDownload.bind(
                this,
                file_url,
                'jobs_pc_talent_download_all_resume',
                { u2: id, fr: 'profile_detail', is_delivery }
              )}
            >
              下载简历
            </span>
          </div>
          <div style={{ visibility: 'hidden' }}>
            <a className={styles.resumeAction}>转发邮箱</a>
          </div>
        </div>
      </div>
    )
  }

  renderWorkExp = () => {
    const { exp: workExp = [], name, id } = this.props.data
    if (!workExp.length) {
      return null
    }

    const expDpms = workExp.map((cInfo, index) => {
      const { company_info: companyInfo = {} } = cInfo
      const fNum = R.pathOr(0, ['friends', 'total'], cInfo)
      const stdname = R.pathOr(
        companyInfo.stdname,
        ['friends', 'stdname'],
        cInfo
      )
      const line4 = fNum ? (
        <Text type="text_week" size={13}>
          {this.renderFriends(
            `ta有${fNum}个好友在此公司`,
            'work_card',
            stdname
          )}
        </Text>
      ) : (
        ''
      )
      const info = {
        name: companyInfo.name || '',
        logo: companyInfo.clogo || '',
        line1: (
          <React.Fragment>
            <Highlighter
              highlightClassName="search_high_light"
              searchWords={this.props.highLight}
              autoEscape
              textToHighlight={cInfo.company}
            />
            {cInfo.judge === 1 && <Icon type="v" className="margin-left-4" />}
          </React.Fragment>
        ),
        line2: (
          <Highlighter
            highlightClassName="search_high_light"
            searchWords={this.props.highLight}
            autoEscape
            textToHighlight={
              compact([cInfo.v, cInfo.position]).join('，') || '-'
            }
          />
        ),
        line3: (
          <Highlighter
            highlightClassName="search_high_light"
            searchWords={this.props.highLight}
            autoEscape
            textToHighlight={cInfo.description}
          />
        ),
        line4,
        webcid: cInfo.webcid,
        shareUrl: companyInfo.share_url,
      }
      const key = `${id}${name}${cInfo.company}${cInfo.position}${cInfo.v}${index}`
      return this.renderExpCard(info, key, 'workExp')
    })

    return (
      <div className={styles.facet}>
        <Text type="title" size={16} key="title">
          工作经历
        </Text>
        {expDpms}
      </div>
    )
  }

  renderFriendCard = (info, index) => {
    return (
      <FeedCard
        logoProps={{
          name: info.name,
          src: info.avatar,
          shape: 'circle',
          onClick: this.handleToDetail(info.id),
        }}
        line1={info.name}
        line2={
          <Text type="text_common">
            {info.line1}
            {info.judge === 1 && <Icon type="v" className="margin-left-4" />}
          </Text>
        }
        key={info.encode_mmid}
        className={index === 0 ? '' : 'margin-top-16'}
      />
    )
  }

  renderFriends = (desc, type, stdname) => {
    const {
      commonFriends: { remain, data = [], page },
    } = this.state
    const { cardListLoading, getTarget } = this.props
    const getContent = () => {
      if (cardListLoading) {
        return (
          <div className={styles.friendCardContainerEmpty}>
            <Loading />
          </div>
        )
      }
      if (data.length === 0) {
        return (
          <div className={styles.friendCardContainerEmpty}>
            <Text type="text_common">没有数据</Text>
          </div>
        )
      }
      return (
        <div className={styles.friendCardContainer}>
          {data.map(this.renderFriendCard)}
        </div>
      )
    }
    return (
      <Popover
        content={getContent()}
        onVisibleChange={this.handleShowCommonFriends(type, stdname)}
        pagination={{
          hasNextPage: !!remain,
          hasPrevPage: page > 0,
          onPrevPageClick: this.handleToPrevCardPage,
          onNextPageClick: this.handleToNextCardPage,
        }}
        trigger="click"
        getPopupContainer={() => getTarget()}
        title={desc}
        placement="bottomLeft"
        autoAdjustOverflow={false}
      >
        <span className="cursor-pointer">
          {desc}
          <Icon type="arrow-right" className="margin-left-4 font-size-10" />
        </span>
      </Popover>
    )
  }
  renderEducation = () => {
    const { edu: education = [], id, name } = this.props.data

    if (!education.length) {
      return null
    }
    const eduDoms = education.map((sInfo, index) => {
      const fNum = R.pathOr(0, ['friends', 'total'], sInfo)
      const stdname = R.pathOr(sInfo.school, ['friends', 'stdname'], sInfo)
      const line1 = (
        <React.Fragment>
          <Highlighter
            highlightClassName="search_high_light"
            searchWords={this.props.highLight}
            autoEscape
            textToHighlight={sInfo.school}
          />
          {sInfo.judge === 1 && <Icon type="v" className="margin-left-4" />}
        </React.Fragment>
      )
      const info = {
        name: sInfo.school,
        logo: sInfo.school_url,
        line1,
        line2: (
          <Highlighter
            highlightClassName="search_high_light"
            searchWords={this.props.highLight}
            autoEscape
            textToHighlight={
              compact([sInfo.v, sInfo.sdegree, sInfo.department]).join('，') ||
              '-'
            }
          />
        ),
        line3: (
          <Highlighter
            highlightClassName="search_high_light"
            searchWords={this.props.highLight}
            autoEscape
            textToHighlight={sInfo.description}
          />
        ),
        line4: fNum ? (
          <Text type="text_week" size={13}>
            {this.renderFriends(
              `ta有${fNum}个好友在此学校`,
              'education_card',
              stdname
            )}
          </Text>
        ) : (
          ''
        ),
      }
      const key = `${id}${name}${sInfo.school}${sInfo.sdegree}${sInfo.v}${sInfo.department}${index}`
      return this.renderExpCard(info, key, 'edu')
    })
    return (
      <div className={styles.facet}>
        <Text type="title" size={16} key="title">
          教育经历
        </Text>
        {eduDoms}
      </div>
    )
  }

  renderCareerTag = () => {
    const {
      userTag: { count, tags },
    } = this.props
    if (!count) {
      return null
    }

    return (
      <div className={styles.facet}>
        <Text type="title" size={16} key="title">
          职业标签
        </Text>
        <br key="sep" />
        <Text type="text_primary" key="desc" className="margin-top-16">
          <Highlighter
            highlightClassName="search_high_light"
            searchWords={this.props.highLight}
            autoEscape
            textToHighlight={tags.map(R.prop('tag')).join('，')}
          />
        </Text>
      </div>
    )
  }

  renderMoreInfo = () => {
    const {
      data: { user = {} },
    } = this.props
    const showFields = [
      {
        key: 'ht_province',
        label: '家乡',
        render: () => compact([user.ht_province, user.ht_city]).join(''),
      },
      {
        key: 'birthday',
        label: '生日',
      },
    ]
    const showData = showFields.map((conf) => user[conf.key])
    const renderItem = (conf) =>
      user[conf.key] ? (
        <div key={conf.key} className="margin-top-8">
          <Text type="text_week" size={14}>
            {conf.label}
          </Text>
          <Text type="text_primary" size={14} className="margin-left-8">
            {conf.render ? conf.render() : user[conf.key]}
          </Text>
        </div>
      ) : null

    if (compact(showData).length === 0) {
      return null
    }

    return (
      <div className={styles.facet}>
        <Text type="title" size={16} key="title" className="margin-bottom-16">
          更多资料
        </Text>
        {showFields.map(renderItem)}
      </div>
    )
  }

  render() {
    if (this.props.basicInfoLoading || this.props.expLoading) {
      return (
        <div className="margin-top-24 margin-bottom-24 flex flex-justify-center">
          <Loading />
        </div>
      )
    }
    return (
      <div className="mergin-bottom-24" id={this.props.id}>
        {this.renderResumeAttachment()}
        {this.renderWorkExp()}
        {this.renderEducation()}
        {this.renderCareerTag()}
        {this.renderMoreInfo()}
      </div>
    )
  }
}
