import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'mm-ent-ui'
import AddRemarkButton from 'componentsV2/Common/RightButton/AddRemarkButton'
import RemarksItem from './RemarksItem'
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
export default class Remarks extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      remarks: {},
      page: 0,
    }
  }

  componentDidMount() {
    this.fetchData()
    window.broadcast.bind('addRemarksSuccess', this.handleRefreshData)
  }

  // eslint-disable-next-line react/sort-comp
  componentWillUnmount() {
    window.broadcast.unbind('addRemarksSuccess', this.handleRefreshData)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUid !== this.props.currentUid) {
      this.handleRefreshData()
    }
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'talents/fetchRemarks',
        payload: {
          to_uid: this.props.currentUid,
          size: 5,
          page: this.state.page,
        },
      })
      .then(({ data = {} }) => {
        const {
          remarks,
          remarks: { list: oldList = [] },
        } = this.state
        const { total, remain, list = [] } = data
        this.setState({
          remarks: Object.assign({}, remarks, {
            remain,
            total,
            list: [...oldList, ...list],
          }),
        })
      })
  }

  handleRefreshData = () => {
    this.setState(
      {
        remarks: {},
        page: 0,
      },
      () => {
        this.fetchData()
      }
    )
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
      remarks: { list = [], remain = 0, total },
    } = this.state
    const { name = '' } = this.props
    if (!total) return null
    return (
      <div className={styles.remarks}>
        <div className={styles.top}>
          {total && <div className={styles.title}>{total}条备注</div>}
          <div className={styles.addRemarks}>
            <AddRemarkButton
              data={{ id: this.props.currentUid, name }}
              className="like-link-button font-size-13 margin-left-16"
              content="添加备注"
              key="addRemark"
            />
          </div>
        </div>
        <RemarksItem data={list} />
        {remain === 1 && <LoadMore onloadMore={this.handleLoadMore} />}
      </div>
    )
  }
}
