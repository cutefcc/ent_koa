import React from 'react'
import { PhoneOutlined } from '@ant-design/icons'
import { Popover, Checkbox } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as R from 'ramda'
import Avatar from 'components/Common/Avatar'

import styles from './talentCard_new.less'

class TalentCard extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    showPhone: PropTypes.bool,
    // showResume: PropTypes.bool,
    // showGroup: PropTypes.bool,
    showBlurAvatar: PropTypes.bool,
    // showVisitTime: PropTypes.bool,
    showDetail: PropTypes.bool,
  }

  static defaultProps = {
    showPhone: false,
    // showResume: false,
    // showGroup: true,
    showBlurAvatar: false,
    // showVisitTime: false,
    showDetail: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      // isStar: props.star,
    }
  }

  stopPropagation = (e) => {
    e.stopPropagation()
  }

  PopLine = (props) => (
    <Popover content={props.content} trigger="hover">
      {this.props.children}
    </Popover>
  )

  // renderPosition = position => (
  //   <span className={styles.position}>
  //     沟通职位： <font className={styles.colorBlue}>{position}</font>
  //   </span>
  // )

  handleShowDetail = () => {
    if (this.props.showDetail) {
      window.open(
        `/ent/micro_resume/${this.props.data.id}?source=${this.props.source}`
      )
    }
  }

  handleCheck = (e) => {
    this.props.onCheck(e.target.checked)
    e.stopPropagation()
  }

  renderAvatar = () => {
    const {
      data: { avatar = '', name = '' },
      showBlurAvatar,
    } = this.props
    const style = {
      width: '42px',
      height: '42px',
      fontSize: '24px',
      lineHeight: '42px',
      borderRadius: '22px',
    }

    return (
      <Avatar
        avatar={avatar}
        name={name}
        style={style}
        blur={showBlurAvatar}
        onClick={this.handleShowDetail}
      />
    )
  }

  renderLine1 = () => {
    const { data } = this.props
    return (
      <p className={styles.line1}>
        <span className={styles.name}>{data.name}</span>
        <span className={styles.position}>{data.position}</span>
      </p>
    )
  }

  renderLine2 = () => {
    const fields = [
      'city',
      'gender_str',
      'age',
      'sdegree',
      'worktime',
      'intention',
    ]
    const data = R.evolve(
      {
        age: (v) => `${v}岁`,
      },
      R.compose(
        R.pickBy((v) => !R.isNil(v) && !R.isEmpty(v)),
        R.pickAll(fields)
      )(this.props.data)
    )
    return <p className={styles.line2}>{Object.values(data).join('/')}</p>
  }

  renderLine3 = () => {
    const { exp = [], tags = '' } = this.props.data
    const expPop = (
      <div className={styles.pop}>
        <h5 className={styles.popTitle}>就职</h5>
        <ul className={styles.popItems}>
          {exp.map((item) => (
            <li key={item.company}>
              {`${item.company} · ${item.position} · ${item.v} （${item.worktime}）`}
            </li>
          ))}
        </ul>
      </div>
    )

    const renderTag = (item) => (
      <li key={item.company} className={styles.label}>
        {item}
      </li>
    )
    const tagsPop = (
      <div className={styles.pop}>
        <h5 className={styles.popTitle}>标签</h5>
        <ul className={`${styles.popItems} ${styles.labelPopItems}`}>
          {R.is(String, tags) ? tags.split(',').map(renderTag) : null}
        </ul>
      </div>
    )

    return (
      <p className={styles.line3}>
        <Popover content={expPop} className={styles.flex1}>
          <span className={styles.label}>就职:</span>
          <span className={styles.text}>
            {exp.map(R.propOr('', 'company')).join('/')}
          </span>
        </Popover>
        <Popover content={tagsPop} className={styles.flex1}>
          <span className={styles.label}>标签:</span>
          <span className={styles.text}>
            {R.is(String, tags) ? tags.split(',').join('·') : ''}
          </span>
        </Popover>
      </p>
    )
  }

  renderLine4 = () => {
    const { edu = [] } = this.props.data
    const eduPop = (
      <div className={styles.pop}>
        <h5 className={styles.popTitle}>学历</h5>
        <ul className={styles.popItems}>
          {edu.map((item) => (
            <li key={`${item.school} ${item.sdegree}`}>
              {`${item.school} · ${item.sdegree} · ${item.v}`}
            </li>
          ))}
        </ul>
      </div>
    )
    return (
      <p className={styles.line4}>
        <Popover content={eduPop} className={styles.flex1}>
          <span className={styles.label}>学历:</span>
          <span className={styles.text}>
            {edu.map((item) => `${item.school}（${item.sdegree}）`).join('/')}
          </span>
        </Popover>
        <span className={styles.flex1}>
          {/* <span className={styles.cl9}>动向:</span>
          <span className={styles.ellipsis}>{tags.split(',').join('·')}</span> */}
        </span>
      </p>
    )
  }

  renderInfo = () => {
    return (
      <div className={styles.info}>
        <div className={styles.top}>
          <div className={styles.avatar}>{this.renderAvatar()}</div>
          <div className={styles.brief}>
            {this.renderLine1()}
            {this.renderLine2()}
          </div>
          {this.props.showPhone && this.props.data.mobile && (
            <span className={styles.phone}>
              <PhoneOutlined />
              {`  ${this.props.data.mobile}`}
            </span>
          )}
          <div className={styles.buttons}>{this.props.buttons}</div>
        </div>
        <div className={styles.bottom}>
          {this.renderLine3()}
          {this.renderLine4()}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.card}>
        {this.props.showCheckbox && (
          <Checkbox
            checked={this.props.checked}
            onChange={this.handleCheck}
            className={styles.checkbox}
            disabled={this.props.disabledCheck}
          />
        )}
        {this.renderInfo()}
      </div>
    )
  }
}

export default connect()(TalentCard)
