import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'mm-ent-ui'
import CommonFriendsItem from './CommonFriendsItem'
import styles from './index.less'

const LoadMore = (data) => {
  const { onloadMore } = data
  return (
    <div style={{ textAlign: 'center', margin: '13px 0 0 0' }}>
      <Button type="button_s_exact_link_bgray" onClick={onloadMore}>
        <span className="font-size-13">查看更多</span>
      </Button>
    </div>
  )
}

@connect((state) => ({
  currentUid: state.profile.currentUid,
}))
export default class CommonFriends extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      commonFriends: {},
      page: 0,
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUid !== this.props.currentUid) {
      this.setState(
        {
          page: 0,
          commonFriends: {},
        },
        () => {
          this.fetchData()
        }
      )
    }
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'global/fetchCommonFriends',
        payload: {
          to_uid: this.props.currentUid,
          size: 5,
          page: this.state.page,
        },
      })
      .then(({ data = {} }) => {
        const {
          commonFriends,
          commonFriends: { list: oldList = [] },
        } = this.state
        const { friends_cnt, remain, list = [] } = data
        this.setState({
          commonFriends: Object.assign({}, commonFriends, {
            remain,
            friends_cnt,
            list: [...oldList, ...list],
          }),
        })
      })
  }

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.fetchData()
      }
    )
  }

  render() {
    const {
      commonFriends: { list = [], remain = 0, friends_cnt: friendsCnt },
    } = this.state
    if (!friendsCnt) return null
    return (
      <div className={styles.commonFriends}>
        {friendsCnt && (
          <div className={styles.title}>{friendsCnt}个共同好友</div>
        )}
        <CommonFriendsItem data={list} />
        {remain === 1 && <LoadMore onloadMore={this.handleLoadMore} />}
      </div>
    )
  }
}
