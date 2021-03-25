import * as React from 'react'
import { connect } from 'react-redux'
import { getMMTimeStr } from 'utils/date'
import { Icon, Modal, Loading } from 'mm-ent-ui'
import Avatar from 'componentsV2/Common/Avatar'
import PreviewButton from 'componentsV2/Common/RightButton/PreviewButton'
import * as R from 'ramda'
import * as styles from './dynamicDetailModal.less'

export interface Props {
  isLoading: boolean
  currentUser: object
  urlPrefix: string
}

export interface State {
  last_time: string
  list: object[]
  pageNum: number
  hasMore: boolean
}

@connect((state) => ({
  currentUser: state.global.currentUser,
  urlPrefix: state.global.urlPrefix,
  isLoading: state.loading.effects['talentDiscover/fetchDynamicDetails'],
}))
export default class DynamicDetailModal extends React.Component<Props, State> {
  state = {
    hasMore: true,
    list: [],
    last_time: null,
    pageNum: 20,
  }
  componentDidMount = () => {
    this.fetchDynamicDetail()
  }

  getDetailByEventType = (item, userInfo) => {
    const { list } = this.state
    // const [currentItem] = list.filter(items => items.id === item.id)
    const currentItem = list.find((eachItem) => eachItem.id === item.id)
    if (!currentItem.isShowChild && [5, 9].includes(currentItem.event_type)) {
      this.props
        .dispatch({
          type: 'talentDiscover/fetchDynamicDetailsByEventType',
          payload: {
            to_uid: userInfo.id,
            size: 100,
            event_type: item.event_type,
          },
        })
        .then(({ data }) => {
          this.setState({
            list: list.map((each) => {
              const itemObj = each
              if (itemObj.id === item.id) {
                itemObj.childs = Array.isArray(data.list) ? data.list : []
                itemObj.isShowChild = !currentItem.isShowChild
              }
              return itemObj
            }),
          })
        })
    } else {
      currentItem.isShowChild = false
      this.setState({ list })
    }
  }

  listenScrollEvent = (dom) => {
    if (dom) {
      dom.addEventListener(
        'scroll',
        this.handleControlFlow(this.calculateOffset, 800)
      )
    }
  }

  // 获取外层数据
  fetchDynamicDetail = () => {
    const { userInfo = {}, version = '' } = this.props
    const { list: lists, pageNum, last_time } = this.state
    this.props
      .dispatch({
        type:
          version === '3.0'
            ? 'talentDiscover/fetchDynamicDetailsNew'
            : 'talentDiscover/fetchDynamicDetails',
        payload: {
          to_uid: userInfo.id,
          size: pageNum,
          start_time: last_time,
          version_type: 2,
        },
      })
      .then(({ data }) => {
        const { count, list, last_time: lastTime } = data
        this.setState({
          last_time: lastTime,
          hasMore: !!(count === pageNum && lastTime),
          list: lists.concat(
            list.map((each) => ({ ...each, isShowChild: false }))
          ),
        })
      })
  }

  calculateOffset = (event) => {
    const {
      target: { scrollTop, scrollHeight, offsetHeight },
    } = event
    // 是否滚动到底
    if (scrollTop === scrollHeight - offsetHeight) {
      this.handleLoadMore()
    }
  }

  // 节流函数
  handleControlFlow = (fn, tm) => {
    let canRun = true
    // eslint-disable-next-line no-unused-vars
    let timer = null
    return (...argu) => {
      if (!canRun) return
      canRun = false
      timer = setTimeout(() => {
        canRun = true
        timer = null
        fn.call(this, ...argu)
      }, tm)
    }
  }

  handleLoadMore = () => {
    const { hasMore, isLoading } = this.state
    if (hasMore && !isLoading) {
      this.fetchDynamicDetail()
    }
  }

  renderList = (list, userInfo) => {
    return list.map((item) => {
      return (
        <div
          key={`${item.describe}${item.uptime}`}
          className={`${styles.dynamicDetailItem} font-size-14`}
        >
          <div
            onClick={() => {
              this.getDetailByEventType(item, userInfo)
            }}
            className={`${styles.dynamicDetailItemEvent}`}
          >
            {item.describe}
            {[5, 9].includes(item.event_type) && (
              <Icon
                type={item.isShowChild ? 'arrow_up' : 'arrow-down-2'}
                className="color-dilution font-size-14 margin-left-10"
              />
            )}
          </div>

          <div className={`${styles.time}`}>{getMMTimeStr(item.uptime)}</div>
          {item.childs &&
            item.isShowChild &&
            item.childs.map((it, index) => {
              return (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${it.describe}${it.event_time}-${index}`}
                  className={`${styles.child} font-size-14 ${
                    index === 0 ? styles.firstChild : ''
                  }`}
                >
                  <div className={`${styles.childDesc}`}>{it.describe}</div>
                  <div className={`${styles.childTime}`}>
                    {getMMTimeStr(it.event_time)}
                  </div>
                </div>
              )
            })}
        </div>
      )
    })
  }

  render() {
    const {
      userInfo = {},
      trackParam,
      isLoading,
      onHiddenDetailModal,
    } = this.props
    const { name, company, position, avatar } = userInfo
    const { list } = this.state
    return (
      <Modal
        title="人才动态明细"
        className={styles.dynamicDetailTip}
        width={578}
        onCancel={() => {
          onHiddenDetailModal()
        }}
        visible
        noFooter
        destroyOnClose
      >
        <div className={styles.dynamicDetail} ref={this.listenScrollEvent}>
          <div className={`${styles.header}`}>
            <Avatar
              avatar={avatar}
              name={R.propOr('保密', 'name', userInfo)}
              className={styles.avatar}
              key="avatar"
            />
            <div className={styles.userInfo}>
              <div className={`${styles.name} font-size-16`}>{name}</div>
              <div className={`${styles.company} font-size-14`}>
                {company}·{position}
                {userInfo.judge === 1 && (
                  <Icon
                    type="v"
                    className="color-orange2 margin-left-4 font-size-12"
                  />
                )}
              </div>
            </div>
          </div>
          {this.renderList(list, userInfo)}
          {isLoading && (
            <div className={`${styles.isLoading}`}>
              <Loading />
              <span className="color-dilution font-size-12 margin-left-8">
                正在加载...
              </span>
            </div>
          )}
        </div>
      </Modal>
    )
  }
}
