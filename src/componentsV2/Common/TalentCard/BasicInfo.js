/* eslint-disable max-lines */
import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { isEmpty, formatArea } from 'utils'
import { Popover } from 'antd'
import { Icon } from 'mm-ent-ui'
import PreviewButton from 'componentsV2/Common/RightButton/PreviewButton'
import Highlighter from 'react-highlight-words'
// import {getMMTimeStr} from 'utils/date'
import {
  fomatJobsToPopoverData,
  fomatEduToPopoverData,
} from 'utils/talentDiscover'
import { connect } from 'react-redux'
import NormalWrapPopover from './NormalWrapPopover'
import ExpandItem from './ExpandItem'
import ExpectationItem from './ExpectationItem'
import AsyncWrapPopover from './AsyncWrapPopover'
import IntentionsItem from './IntentionsItem'
import LabelItem from './LabelItem'
import CompanyFans from './CompanyFans'
import CompanyFansV3 from './CompanyFansV3'
import ExcellentTalent from './ExcellentTalent'
import DynamicDetail from './DynamicDetail'
import styles from './commonCard.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  auth: state.global.auth,
  highLight: state.talentDiscover.highLight,
}))
export default class BasicInfo extends React.PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
    trackParam: PropTypes.object.isRequired,
    // showExpectation: PropTypes.bool,
  }

  static defaultProps = {
    // showExpectation: false,
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
              <span key={item.v}>
                <Highlighter
                  highlightClassName="search_high_light"
                  searchWords={highLight}
                  autoEscape
                  textToHighlight={item.v}
                />
              </span>
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
    const {
      data,
      auth: { isTalentBankStable },
    } = this.props
    const area = formatArea({
      province: data.province,
      city: data.city,
    })
    const baseInfoFields = [
      'area',
      'sdegree',
      'worktime',
      'age',
      'gender_str',
      isTalentBankStable ? '' : 'intention', // remove temporarily in v 3.0
      'salary',
    ]

    const baseInfo = R.evolve(
      {
        age: (v) => `${v}岁`,
      },
      R.compose(
        R.pickBy((v) => !R.isNil(v) && !R.isEmpty(v) && !R.equals(v, '不限')),
        R.pickAll(baseInfoFields)
      )({
        ...data,
        area,
      })
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
            >
              {`${data.name}` || '保密'}
            </PreviewButton>
            {data.judge === 1 && (
              <Icon
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

    const companys = this.formatCompanys() || '-'
    const highLight = R.pathOr([], ['props', 'highLight'], this)
    // const currCompanyPosition = `${R.propOr(
    //   '公司信息保密',
    //   'company',
    //   data
    // )}·${R.propOr('公司信息保密', 'position', data)}`
    let currCompanyPosition
    const expFirst = R.pathOr(null, ['exp', 0], data)
    if (expFirst) {
      const tempList = []
      if (R.pathOr('', ['company'], expFirst)) {
        tempList.push(R.pathOr('', ['company'], expFirst))
      }
      if (R.pathOr('', ['position'], expFirst)) {
        tempList.push(R.pathOr('', ['position'], expFirst))
      }
      if (R.pathOr('', ['worktime'], expFirst)) {
        tempList.push(R.pathOr('', ['worktime'], expFirst))
      }
      currCompanyPosition = tempList.join('·')
      if (R.pathOr(0, ['is_leave'], expFirst) === 1) {
        currCompanyPosition += '（离职）'
      }
      if (!currCompanyPosition) {
        currCompanyPosition = '-'
      }
    } else {
      currCompanyPosition = '-'
    }

    const empty = currCompanyPosition === ''
    return (
      <div
        key="line2"
        className={`${styles.line2} ${styles.commonLine}`}
        ref={(dom) => {
          this.line2 = dom
        }}
      >
        <span className={styles.item}>
          <span className={styles.label}>现任</span>
          {!empty ? (
            <Popover
              // trigger="click"
              placement="bottomLeft"
              content={this.renderNormalWrapPopover({
                data: fomatJobsToPopoverData(exp),
                bigTitle: '工作经历',
                childComponent: ExpandItem,
              })}
              className={`ellipsis ${styles.content}`}
              getPopupContainer={() => this.line2}
              autoAdjustOverflow={false}
            >
              <span className={`ellipsis ${styles.content}`}>
                <Highlighter
                  highlightClassName="search_high_light"
                  searchWords={highLight}
                  autoEscape
                  textToHighlight={currCompanyPosition}
                />
              </span>
            </Popover>
          ) : (
            '无'
          )}
        </span>
        <span className={`${styles.item} ${styles.popoverCon}`}>
          <span className={styles.label}>就职</span>
          {companys === '-' ? (
            companys
          ) : (
            <Popover
              // trigger="click"
              placement="bottomLeft"
              content={this.renderNormalWrapPopover({
                data: fomatJobsToPopoverData(exp),
                bigTitle: '工作经历',
                childComponent: ExpandItem,
              })}
              className={`ellipsis ${styles.content}`}
              getPopupContainer={() => this.line2}
              autoAdjustOverflow={false}
            >
              {companys}
            </Popover>
          )}
        </span>
      </div>
    )
  }
  renderLine3 = () => {
    const { data } = this.props
    const edu = R.propOr([], 'edu', data)
    const tag = isEmpty(data.tags) ? '-' : data.tags.split(',').join('、')
    const schools = this.formatSchools() || '-'
    const highLight = R.pathOr([], ['props', 'highLight'], this)
    return (
      <div
        key="line3"
        className={`${styles.line3} ${styles.commonLine}`}
        ref={(dom) => {
          this.line3 = dom
        }}
      >
        <span className={styles.item}>
          <span className={styles.label}>学校</span>
          {schools === '-' ? (
            schools
          ) : (
            <Popover
              // trigger="click"
              placement="bottomLeft"
              content={this.renderNormalWrapPopover({
                data: fomatEduToPopoverData(edu),
                bigTitle: '教育经历',
                childComponent: ExpandItem,
              })}
              className={`ellipsis ${styles.content}`}
              getPopupContainer={() => this.line3}
              autoAdjustOverflow={false}
            >
              {schools}
            </Popover>
          )}
        </span>
        <span className={styles.item}>
          <span className={styles.label}>标签</span>
          {tag === '-' ? (
            tag
          ) : (
            <Popover
              // trigger="click"
              placement="bottomLeft"
              content={this.renderNormalWrapPopover({
                data: tag,
                bigTitle: '技能标签',
                childComponent: LabelItem,
              })}
              className={`ellipsis ${styles.tag}`}
              getPopupContainer={() => this.line3}
              autoAdjustOverflow={false}
            >
              <Highlighter
                highlightClassName="search_high_light"
                searchWords={highLight}
                autoEscape
                textToHighlight={tag}
              />
            </Popover>
          )}
        </span>
      </div>
    )
  }
  renderLine4 = () => {
    const { data, auth } = this.props
    const content = R.propOr('-', 'job_preferences', data)
    const match_experience = R.pathOr('', ['match_experience'], data)
    const highLight = R.pathOr([], ['props', 'highLight'], this)
    return (
      <div
        className={`${styles.line4} ${styles.commonLine}`}
        ref={(dom) => {
          this.line4 = dom
        }}
      >
        <span className={styles.item}>
          <span className={styles.label}>期望</span>
          {['', '-'].includes(content) ? (
            '-'
          ) : (
            <Popover
              // trigger="click"
              placement="bottomLeft"
              content={
                <AsyncWrapPopover
                  // bigTitle=""
                  ChildComponent={ExpectationItem}
                  dispatchQuery={{
                    type: 'talents/fetchExpect',
                    payload: {
                      to_uid: data.id,
                    },
                  }}
                />
              }
              className={`ellipsis ${
                content !== '-' ? styles.content : styles.emptyContent
              }`}
              getPopupContainer={() => this.line4}
              autoAdjustOverflow={false}
            >
              {content}
            </Popover>
          )}
        </span>
        {/* 意愿 */}
        {!!data.willingness && (
          <span className={styles.item}>
            <span className={styles.label}>
              {auth.showWillingText && '意愿'}
              {auth.showResponseRateText && '回复率'}
            </span>
            <Popover
              placement="bottomLeft"
              content={data.willingness}
              className={`ellipsis ${styles.content}`}
              getPopupContainer={() => this.line4}
              autoAdjustOverflow={false}
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
    const {
      data,
      auth: { isTalentBankStable },
      currentUser: { isV3 },
    } = this.props
    const isShow =
      data.is_company_fans ||
      data.has_intention ||
      data.is_high_growth ||
      data.is_high_quality ||
      (data.is_job_hunting_dynamic && isTalentBankStable) ||
      data.is_corp_friend
    const className = `${styles.tag} ellipsis`
    if (!isShow) return null
    return (
      <p
        className={styles.line5}
        ref={(dom) => {
          this.line5 = dom
        }}
      >
        {data.is_high_growth ? (
          <Popover
            placement="bottomLeft"
            content={
              <AsyncWrapPopover
                icon={{
                  type: 'lightning',
                  style: {
                    color: '#FFBD08',
                  },
                }}
                ChildComponent={ExcellentTalent}
                WrapperComponent={NormalWrapPopover}
                dispatchQuery={{
                  type: 'talentDiscover/fetchHighQualityTalent',
                  payload: {
                    to_uid: data.id,
                  },
                }}
                deepBigTitle="高速成长型人才"
                dataType="high_growth"
              />
            }
            getPopupContainer={() => this.line5}
            autoAdjustOverflow={false}
          >
            <span className={className}>
              <Icon
                type="lightning"
                style={{
                  color: '#FFBD08',
                  marginRight: 4,
                }}
              />
              高速成长
            </span>
          </Popover>
        ) : null}
        {data.is_job_hunting_dynamic && isTalentBankStable
          ? this.renderLatestActive()
          : null}
        {data.is_high_quality ? (
          <Popover
            placement="bottomLeft"
            content={
              <AsyncWrapPopover
                icon={{
                  type: 'gem',
                  style: {
                    color: '#6A9BFF',
                  },
                }}
                ChildComponent={ExcellentTalent}
                WrapperComponent={NormalWrapPopover}
                dispatchQuery={{
                  type: 'talentDiscover/fetchHighQualityTalent',
                  payload: {
                    to_uid: data.id,
                  },
                }}
                deepBigTitle="优质人才"
                dataType="high_quality"
              />
            }
            getPopupContainer={() => this.line5}
            autoAdjustOverflow={false}
          >
            <span className={className}>
              <Icon
                type="gem"
                style={{
                  color: '#6A9BFF',
                  marginRight: 4,
                }}
              />
              优质人才
            </span>
          </Popover>
        ) : null}
        {data.is_company_fans ? (
          <Popover
            placement="bottomLeft"
            content={
              isV3
                ? this.renderNormalWrapPopoverV3(data)
                : this.renderNormalWrapPopover({
                    data: {
                      title: '关注了你公司',
                      time: data.concern_company_time,
                    },
                    bigTitle: '企业粉丝是你公司潜在的高意向人才',
                    childComponent: CompanyFans,
                  })
            }
            getPopupContainer={() => this.line5}
            autoAdjustOverflow={false}
          >
            <span className={className}>企业粉丝</span>
          </Popover>
        ) : null}
        {data.has_intention ? (
          <Popover
            // trigger="click"
            placement="bottomLeft"
            content={
              <AsyncWrapPopover
                bigTitle={['对你公司表达过', '次意向行为']}
                ChildComponent={IntentionsItem}
                dispatchQuery={{
                  type: 'talents/fetchHasIntention',
                  payload: {
                    to_uid: data.id,
                  },
                }}
                total="count"
              />
            }
            getPopupContainer={() => this.line5}
            autoAdjustOverflow={false}
          >
            <span className={className}>有过意向</span>
          </Popover>
        ) : null}
        {data.is_corp_friend ? this.renderCorpFriend() : null}
      </p>
    )
  }

  renderLatestActive = () => {
    const { data } = this.props
    const className = `${styles.tag} ellipsis`
    return (
      <Popover
        placement="bottomLeft"
        content={
          <AsyncWrapPopover
            bigTitle={'近期有动向'}
            ChildComponent={DynamicDetail}
            dispatchQuery={{
              type: 'talents/fetchDynamicDetail',
              payload: {
                to_uid: data.id,
                event_types: '1,2,3,11',
              },
            }}
          />
        }
        getPopupContainer={() => this.line5}
        autoAdjustOverflow={false}
      >
        <span className={className} style={{ color: '#956935' }}>
          <Icon
            type="active"
            style={{
              color: '#956935',
              marginRight: 4,
            }}
          />
          近期有动向
        </span>
      </Popover>
    )
  }

  renderCorpFriend() {
    const className = `${styles.tag} ellipsis`
    return <span className={className}>员工好友</span>
  }

  renderNormalWrapPopover = ({ icon, data, bigTitle, childComponent }) => {
    const ExpandPopoverContent = NormalWrapPopover(childComponent) // 高阶组件，静态带标题容器
    return <ExpandPopoverContent icon={icon} data={data} bigTitle={bigTitle} />
  }

  renderNormalWrapPopoverV3 = (data) => {
    return (
      <AsyncWrapPopover
        bigTitle={'企业粉丝是你公司潜在的高意向人才'}
        ChildComponent={CompanyFansV3}
        dispatchQuery={{
          type: 'talents/fetchCompanyFansDetails',
          payload: {
            to_uid: data.id,
            uid: window.uid,
          },
        }}
      />
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
