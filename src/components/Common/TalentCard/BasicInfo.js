import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { isEmpty } from 'utils'
import { Icon as LegacyIcon } from '@ant-design/compatible'
import { Popover } from 'antd'
import PreviewButton from 'components/Common/RightButton/PreviewButton'
import { getMMTimeStr } from 'utils/date'
import { connect } from 'react-redux'
import Highlighter from 'react-highlight-words'
import styles from './commonCard.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  highLight: state.talentDiscover.highLight,
}))
export default class BasicInfo extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    trackParam: PropTypes.object.isRequired,
    showExpectation: PropTypes.bool,
  }

  static defaultProps = {
    showExpectation: false,
  }

  getMatchedStr = (matchs, value) => {
    if (matchs.length === 0) {
      return [
        {
          v: value,
          match: false,
        },
      ]
    }
    let index = 0
    const result = R.sortBy(R.prop('begin'), matchs).reduce((res, pointers) => {
      const { begin, end } = pointers
      if (end < begin || begin > value.length) {
        return res
      }

      if (begin > index) {
        res.push({
          v: value.substring(index, begin),
          match: false,
        })
      }
      res.push({
        v: value.substring(begin < index ? index : begin, end),
        match: true,
      })
      index = end
      return res
    }, [])

    if (index < value.length) {
      result.push({
        v: value.substr(index),
        match: false,
      })
    }
    return result
  }

  getMatchedValues = (data) => {
    return data.map((value, index) => {
      const { matchs = [], name = '' } = value
      const matchedStr = this.getMatchedStr(matchs, name)
      const highLight = R.pathOr('', ['props', 'highLight'], this)
      return (
        // eslint-disable-next-line react/no-array-index-key
        <span key={`name${index}`}>
          {index === 0 ? '' : ' / '}
          {matchedStr.map((item) =>
            item.match ? (
              <span
                style={{ fontFamily: 'PingFangSC-Medium', color: '#222' }}
                key={item.v}
              >
                <Highlighter
                  highlightClassName="search_high_light"
                  searchWords={highLight}
                  autoEscape
                  textToHighlight={item.v}
                />
              </span>
            ) : (
              <Highlighter
                highlightClassName="search_high_light"
                searchWords={highLight}
                autoEscape
                textToHighlight={item.v}
              />
            )
          )}
        </span>
      )
    })
  }

  formatCompanys = () => {
    const { data } = this.props
    const highLight = R.pathOr([], ['props', 'highLight'], this)
    const res = data.companys ? (
      this.getMatchedValues(R.propOr([], 'companys', data))
    ) : (
      <Highlighter
        highlightClassName="search_high_light"
        searchWords={highLight}
        autoEscape
        textToHighlight={data.large_comps}
      />
    )
    return res
  }

  formatSchools = () => {
    const { data } = this.props
    const highLight = R.pathOr('', ['props', 'highLight'], this)
    if (data.schools) {
      return this.getMatchedValues(
        R.propOr([], 'schools', data).map((item) => ({
          ...item,
          name: `${item.name}-${item.department}`,
        }))
      )
    }
    return R.propOr([], 'edu', data).length !== 0 ? (
      <span className={`ellipsis ${styles.content}`}>
        <Highlighter
          highlightClassName="search_high_light"
          searchWords={highLight}
          autoEscape
          textToHighlight={R.propOr([], 'edu', data)
            .map((item) => `${item.school}·${item.department}`)
            .join('/')}
        />
      </span>
    ) : (
      '-'
    )
  }

  renderLine1 = () => {
    const { data } = this.props
    const baseInfoFields = [
      'province',
      'sdegree',
      'worktime',
      'age',
      'gender_str',
      'intention',
      'salary',
    ]
    const baseInfo = R.evolve(
      {
        age: (v) => `${v}岁`,
      },
      R.compose(
        R.pickBy((v) => !R.isNil(v) && !R.isEmpty(v) && !R.equals(v, '不限')),
        R.pickAll(baseInfoFields)
      )(this.props.data)
    )
    return (
      <div className={styles.line1}>
        <span className={styles.line1Left} key="info">
          <p className="flex flex-align-center">
            <PreviewButton
              showDetail={false}
              data={data}
              trackParam={this.props.trackParam}
              fr={this.props.fr}
              className="font-weight-bold color-stress font-size-14 like-link-button"
              content={`${data.name}` || '保密'}
              onGetUserLimit={this.props.onGetUserLimit}
            />
            {data.judge === 1 && (
              <LegacyIcon
                type="v"
                className="color-orange2 margin-left-6 font-size-12"
              />
            )}
            {!!data.active_state && (
              <span className="color-dilution font-size-12 margin-left-8">
                {data.active_state === '在线'
                  ? '在线'
                  : `${data.active_state}来过`}
              </span>
            )}
            {/* <span className={styles.activeState}>{data.active_state}</span> */}
            <span className="flex flex-align-center">
              {this.props.extraButton}
            </span>
          </p>
          <p className="color-dilution">
            {Object.values(baseInfo).join(' / ')}
          </p>
        </span>
        <span className={styles.line1Right}>
          <span className={styles.buttons} key="buttons">
            {this.props.buttons}
          </span>
        </span>
      </div>
    )
  }
  renderLine2 = () => {
    const { data } = this.props
    const exp = R.propOr([], 'exp', data)
    const empty = R.propOr(0, 'length', exp) === 0
    const companys = this.formatCompanys() || '-'
    const highLight = R.pathOr([], ['props', 'highLight'], this)
    return (
      <div key="line2" className={`${styles.line2} ${styles.commonLine}`}>
        <span className={styles.item}>
          <span className={styles.label}>现任</span>
          {!empty ? (
            <span className={`ellipsis ${styles.content}`}>
              <Highlighter
                highlightClassName="search_high_light"
                searchWords={highLight}
                autoEscape
                textToHighlight={`${R.propOr(
                  '公司信息保密',
                  'company',
                  data
                )}·${R.propOr('公司信息保密', 'position', data)}`}
              />
            </span>
          ) : (
            '无'
          )}
        </span>
        <span className={styles.item}>
          <span className={styles.label}>就职</span>
          <Popover content={companys} className={`ellipsis ${styles.content}`}>
            {companys}
          </Popover>
        </span>
      </div>
    )
  }
  renderLine3 = () => {
    const { data } = this.props
    const tag = isEmpty(data.tags) ? '-' : data.tags.split(',').join('、')
    const schools = this.formatSchools() || '-'
    const highLight = R.pathOr([], ['props', 'highLight'], this)
    return (
      <div key="line3" className={`${styles.line3} ${styles.commonLine}`}>
        <span className={styles.item}>
          <span className={styles.label}>学校</span>
          <Popover content={schools} className={`ellipsis ${styles.content}`}>
            {schools}
          </Popover>
        </span>
        <span className={styles.item}>
          <span className={styles.label}>标签</span>
          <Popover content={tag} className={`ellipsis ${styles.tag}`}>
            <Highlighter
              highlightClassName="search_high_light"
              searchWords={highLight}
              autoEscape
              textToHighlight={tag}
            />
          </Popover>
        </span>
      </div>
    )
  }
  renderLine4 = () => {
    const {
      data,
      showExpectation,
      currentUser: { role = '' },
    } = this.props
    const hasHighlight =
      !R.isNil(data.highlights) && !R.isEmpty(data.highlights)
    const highlights = hasHighlight
      ? R.propOr([], 'highlights', data).map(R.prop('name')).join('·')
      : '-'
    const expectation = data.recent_job_event_data || '-'
    const content = showExpectation ? expectation : highlights
    const match_experience = R.pathOr('', ['match_experience'], data)
    const highLight = R.pathOr([], ['props', 'highLight'], this)
    return (
      <div className={`${styles.line4} ${styles.commonLine}`}>
        <span className={styles.item}>
          <span className={styles.label}>
            {showExpectation ? '期望' : '亮点'}
          </span>
          <Popover
            content={content}
            className={`ellipsis ${
              content !== '-' ? styles.content : styles.emptyContent
            }`}
          >
            {content}
          </Popover>
        </span>
        {!!data.willingness && (
          <span className={styles.item}>
            <span className={styles.label}>
              {role === 'enterpriseRecruiter' ? '意愿' : '回复率'}
            </span>
            <Popover
              content={data.willingness}
              className={`ellipsis ${styles.content}`}
            >
              {data.willingness}
            </Popover>
          </span>
        )}
        {match_experience && (
          <span
            className={styles.item}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'inline-block',
            }}
          >
            <span className={styles.label}>经历</span>
            <span>
              <Highlighter
                highlightClassName="search_high_light"
                searchWords={highLight}
                autoEscape
                textToHighlight={match_experience}
              />
            </span>
          </span>
        )}
      </div>
    )
  }

  renderLine5 = () => {
    const { data } = this.props
    if (
      !data.is_company_fans &&
      !data.is_delivery &&
      (!data.op_state === 1 || !data.op_name)
    ) {
      return null
    }
    const className = `${styles.tag} ellipsis`
    const positions = R.propOr('', 'delivery_position', data).split(',')
    const showPositions = positions.slice(0, 3).join(' / ')
    const showMore = positions.length > 3 ? `等${positions.length}个` : ''
    return (
      <p className={styles.line5}>
        {data.is_company_fans ? (
          <span className={className}>企业粉丝</span>
        ) : null}
        {!!data.is_delivery && (
          <span className={className}>
            {`曾经投递过你公司“${showPositions}”${showMore}岗位`}
          </span>
        )}
        {data.op_state === 1 && !!data.op_name && (
          <span className={className}>
            {`已被${data.op_name}在${getMMTimeStr(data.op_time)}标记为不合适`}
          </span>
        )}
      </p>
    )
  }

  render() {
    return (
      <div className={styles.info}>
        {this.renderLine1()}
        {this.renderLine2()}
        {this.renderLine3()}
        {this.renderLine4()}
        {this.renderLine5()}
      </div>
    )
  }
}
