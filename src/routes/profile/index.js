import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import urlParse from 'url'

import AddFriendButton from 'components/Common/AddFriendButton'
// import InviteButton from 'components/Common/InviteButton'
import DirectChatButton from 'components/Common/DirectChatButton'
import Avatar from 'components/Common/Avatar'

import styles from './index.less'

@connect()
export default class Profile extends React.PureComponent {
  constructor(props) {
    super(props)
    const { uid } = props.match.params
    const urlObj = urlParse.parse(props.location.search, true)
    const source = R.trim(R.pathOr('', ['query', 'source'], urlObj))
    this.state = {
      uid,
      data: {},
      source,
    }
  }
  componentDidMount() {
    this.fetchProfile()
    this.fetchJobs()
  }

  fetchProfile = () => {
    this.props
      .dispatch({
        type: 'talents/fetchProfile',
        payload: {
          profile_uid: this.state.uid,
        },
      })
      .then(({ data }) => {
        this.setState({
          data,
        })
        document.title = `${data.name}(${data.position})的主页-脉脉企业招聘`
      })
  }

  fetchJobs = () =>
    this.props.dispatch({
      type: 'global/fetchJobs',
    })

  handleAddFriendFinish = () => {
    this.setState({
      data: {
        ...this.state.data,
        is_friend_add: true,
      },
    })
  }

  handleInviteFinish = () => {
    this.setState({
      data: {
        ...this.state.data,
        is_archive: true,
      },
    })
  }

  handleDirectImFinish = () => {
    this.setState({
      data: {
        ...this.state.data,
        is_direct_im: true,
      },
    })
  }

  handleGroupFinish = (talentIds, groupName) => {
    this.setState({
      data: {
        ...this.state.data,
        groups: [...R.propOr([], 'groups', this.state.data), groupName],
      },
    })
  }

  handleViewDetail = (data) => () =>
    window.open(`/ent/profile/${data.id}?source=profile`)

  renderSectionTitle = (title) => (
    <h3 className={styles.sectionTitle} key="title">
      {title}
    </h3>
  )

  renderSectionItem = ({ logo, line1, line2, line3 = '', line4 }) => {
    const line3Content = line3.split('\n').map((item) => (
      <p className={styles.line3} key={item}>
        {item}
      </p>
    ))
    return (
      <div className={styles.sectionItem}>
        <div>
          <img src={logo} className={styles.logo} alt="logo" />
        </div>
        <div className={styles.info}>
          <p className={styles.line1}>{line1}</p>
          <p className={styles.line2}>{line2}</p>
          {line3Content}
          {line4 && <p className={styles.line4}>{line4}</p>}
        </div>
      </div>
    )
  }

  renderFriends = (friends = []) => {
    return friends.map((friend) => (
      <a href={`/ent/profile/${friend.uid}`} key={friend.uid}>
        <Avatar
          avatar={R.propOr('', 'avatar', friend)}
          name={R.propOr('', 'name', friend)}
          style={{
            width: '30px',
            height: '30px',
            fontSize: '24px',
            lineHeight: '30px',
            borderRadius: '15px',
          }}
          className={styles.friendAvatar}
        />
      </a>
    ))
  }

  renderGroup = (group) => {
    return (
      <span key={group} className={styles.group}>
        <span>{group}</span>
      </span>
    )
  }

  renderBasic = () => {
    const { data } = this.state
    const infoFields = {
      地区: 'city',
      性别: 'gender_str',
      年龄: 'age',
      学历: 'sdegree',
      经验: 'worktime',
      期望薪资: 'intend_salary',
      状态: 'intention',
    }
    const format = {
      age: (v) => (v ? `${v}岁` : '保密'),
    }

    const getData = (label) => {
      const field = infoFields[label]
      const formatFunc = format[field]
      return formatFunc ? formatFunc(data[field]) : data[field]
    }

    const avatarStyle = {
      width: '80px',
      height: '80px',
      fontSize: '56px',
      lineHeight: '80px',
      borderRadius: '40px',
    }

    return (
      <div className={styles.basic}>
        <div className={styles.line1}>
          <div className={styles.info}>
            <Avatar
              avatar={data.avatar}
              name={R.propOr('', 'name', data)}
              style={avatarStyle}
              className={styles.avatar}
            />
            <span className={styles.name}>
              <span style={{ display: 'flex', lineHeight: '25px' }}>
                <h5>{data.name}</h5>
                {R.propOr([], 'groups', data).map(this.renderGroup)}
              </span>
              <span style={{ marginTop: '8px' }}>({data.position})</span>
            </span>
          </div>
          {this.state.source !== 'channel' && (
            <div className={styles.operations}>
              {/* <GroupButton
                key="groupButton"
                talents={[data]}
                buttonText="分组"
                onGroupFinish={this.handleGroupFinish}
                className={`${styles.groupButton} ${styles.commonButton}`}
              /> */}
              <AddFriendButton
                key="addfr"
                talents={[data]}
                source={this.state.source}
                onAddFinish={this.handleAddFriendFinish}
                disabled={!!data.is_friend_add}
                buttonText={
                  data.is_friend_add ? '已申请' : `加好友` // ${/* R.propOr(0, 'add_fr_price', data) */ }`
                }
                className={`${styles.addFriendButton} ${styles.commonButton}`}
              />
              <DirectChatButton
                key="DirectChatButton"
                talents={[data]}
                source={this.state.source}
                onInviteFinish={this.handleDirectImFinish}
                disabled={!!data.is_direct_im}
                buttonText="极速联系"
                className={`${styles.groupButton} ${styles.commonButton}`}
              />
            </div>
          )}
        </div>
        <div className={styles.line2}>
          {Object.keys(infoFields).map((label) => (
            <span key={label}>
              {label}: {getData(label)}
            </span>
          ))}
        </div>
      </div>
    )
  }

  renderExp = () => {
    return (
      <div className={styles.exp}>
        {this.renderSectionTitle('工作经历')}
        {R.pathOr([], ['data', 'exp'], this.state).map((item) => {
          const friends = R.propOr({}, 'friends', item)
          const line4 =
            R.propOr(0, 'total', friends) === 0 ? (
              ''
            ) : (
              <span>
                <span key="avatar">
                  {this.renderFriends(
                    R.pathOr([], ['card'], friends).slice(0, 5)
                  )}
                </span>
                <span key="tip">
                  &nbsp;&nbsp; 他有
                  <span className={styles.bold}>
                    {R.pathOr(0, ['total'], friends)}
                  </span>
                  个好友在此公司
                </span>
              </span>
            )
          return this.renderSectionItem({
            logo: R.pathOr('', ['company_info', 'clogo'], item),
            line1: R.propOr('', 'company', item),
            line2: `${R.pathOr('', ['v'], item)}, ${R.pathOr(
              '',
              ['position'],
              item
            )}`,
            line3: R.pathOr('', ['description'], item),
            line4,
          })
        })}
      </div>
    )
  }

  renderEdu = () => {
    return (
      <div className={styles.edu}>
        {this.renderSectionTitle('教育经历')}
        {R.pathOr([], ['data', 'edu'], this.state).map((item) => {
          return this.renderSectionItem({
            logo: R.pathOr('', ['school_url'], item),
            line1: R.propOr('', 'school', item),
            line2: `${R.pathOr('', ['v'], item)}, ${R.pathOr(
              '',
              ['department'],
              item
            )}, ${R.pathOr('', ['sdegree'], item)}`,
            line3: R.pathOr('', ['description'], item),
            line4:
              R.pathOr(0, ['friends', 'total'], item) === 0 ? (
                ''
              ) : (
                <span>
                  <span key="avatar">
                    {this.renderFriends(
                      R.pathOr([], ['friends', 'card'], item).slice(0, 5)
                    )}
                  </span>
                  <span key="tip">
                    &nbsp;&nbsp; 他有
                    <span className={styles.bold}>
                      {R.pathOr(0, ['friends', 'total'], item)}
                    </span>
                    个好友在此学校
                  </span>
                </span>
              ),
          })
        })}
      </div>
    )
  }

  renderTags = () => {
    return (
      <div className={styles.tags}>
        {this.renderSectionTitle('技能标签')}
        <div className={styles.info}>
          {R.pathOr('', ['data', 'tags'], this.state)
            .split(',')
            .map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
        </div>
      </div>
    )
  }

  renderTalentCard = (data) => {
    return data === null ? null : (
      <div className={styles.card} key={data.id}>
        <p>
          <Avatar
            avatar={data.avatar}
            name={R.propOr('', 'name', data)}
            className={styles.cardAvatar}
            style={{
              width: '50px',
              height: '50px',
              fontSize: '32px',
              lineHeight: '50px',
              borderRadius: '25px',
            }}
          />
        </p>
        <p className={styles.cardName}>{data.name}</p>
        <p className={styles.cardPosition}>{data.position}</p>
        <p className={styles.cardCompany}>
          {R.propOr('', 'large_comps', data).replace(/,/g, '/')}
        </p>
        <p className={styles.cardSchool}>{`${data.school}(${data.sdegree})`}</p>
        <span
          onClick={this.handleViewDetail(data)}
          className={styles.cardShowDetail}
        >
          查看详情
        </span>
      </div>
    )
  }

  renderFooter = () => {
    const data = R.pathOr([], ['data', 'see_more'], this.state).slice(0, 8)
    return [
      this.renderSectionTitle(`看过${this.state.data.name}的人还看了`),
      <div className={styles.cardItems} key="items">
        {data.map(this.renderTalentCard)}
      </div>,
    ]
  }

  render() {
    const more = R.pathOr([], ['data', 'see_more'], this.state)
    return [
      <div className={styles.main} key="main">
        {this.renderBasic()}
        {this.renderExp()}
        {this.renderEdu()}
        {this.renderTags()}
      </div>,
      more.length !== 0 && (
        <div className={styles.footer} key="footer">
          {this.renderFooter()}
        </div>
      ),
    ]
  }
}
