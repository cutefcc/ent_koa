import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { getModuleName } from 'utils'
import { FeedCard, Icon, FeedMultiImg, Loading, RichText } from 'mm-ent-ui'
import CompanyFansHoverEmpty from 'componentsV3/CompanyFansHover/CompanyFansHoverEmpty'
import * as styles from './index.less'

@connect((state) => ({
  currentUser: state.global.currentUser,
  realPathname: state.global.realPathname,
  talentDiscoverLoading: state.loading.effects[`talentDiscover/fetchData`],
  groupsLoading: state.loading.effects[`groups/fetchData`],
  subscribeLoading: state.loading.effects[`subscribe/fetchData`],
  urlPrefix: state.global.urlPrefix,
}))
export default class FeedListContainer extends React.PureComponent {
  renderFeeds = (item, index) => {
    const avatar = R.pathOr('', ['user', 'avatar'], item)
    const name = R.pathOr('', ['user', 'name'], item)
    const company = R.pathOr('脉脉', ['user', 'company'], item)
    const position = R.pathOr('', ['user', 'position'], item)
    const judge = R.pathOr('', ['user', 'judge'], item)
    const crtime = R.pathOr('', ['crtime'], item)
    const text = R.pathOr('', ['text'], item)
    const pics = R.pathOr([], ['pics'], item)
    const id = R.pathOr('', ['user', 'id'], item)
    // eslint-disable-next-line no-param-reassign
    item.uid = id
    return (
      <div className={styles.itemCon}>
        <FeedCard
          data={item}
          logoProps={{
            name: '脉脉',
            src: avatar,
            onClick: () => {},
          }}
          line1={[
            name,
            <span
              style={{ color: 'rgba(0,0,0,0.65)', paddingLeft: '8px' }}
              key={`${name}${company}${index}`}
            >
              {`${company}·${position}`}
            </span>,
            judge === 1 ? (
              <Icon type="v" key="v" style={{ marginLeft: '4px' }} />
            ) : null,
          ]}
          line2={crtime}
          line3={<RichText text={text} />}
          line4={pics.length > 0 ? <FeedMultiImg pics={pics} /> : null}
        />
      </div>
    )
  }

  renderLoading = () => {
    return (
      <p
        className="text-center margin-top-32"
        style={{ marginTop: '15%', paddingBottom: '25%' }}
      >
        <Loading />
        <span className="color-gray400 margin-left-8">加载中...</span>
      </p>
    )
  }
  defaultTip = () => {
    // 判断是否选中企业粉丝
    const isFans =
      R.pathOr([], ['props', 'checkboxGroup'], this).find(
        (item) => item === 'is_fans'
      ) !== undefined
    return (
      <div>
        <img
          src={`${this.props.urlPrefix}/images/empty_subscription.png`}
          alt="emptyImage"
          style={{
            display: 'block',
            width: '198px',
            margin: '167px auto',
            marginBottom: '0',
          }}
        />
        <div className={isFans ? styles.emptyTextV3 : styles.emptyText}>
          暂无实名动态
        </div>
        {isFans && <CompanyFansHoverEmpty />}
      </div>
    )
  }
  render() {
    // const { data, realPathname } = this.props
    // const loading = this.props[`${getModuleName(realPathname)}Loading`]
    const { data } = this.props
    const loading = this.props[
      `${getModuleName(window.location.pathname)}Loading`
    ]
    return (
      <div
        className={styles.feedListContainer}
        style={{ position: 'relative' }}
      >
        {loading && this.renderLoading()}
        {!loading && data.map(this.renderFeeds)}
        {!loading && !data.length && this.defaultTip()}
      </div>
    )
  }
}
