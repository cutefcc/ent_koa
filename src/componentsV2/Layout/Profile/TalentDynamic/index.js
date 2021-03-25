import React from 'react'
import { connect } from 'react-redux'
import { Button } from 'mm-ent-ui'
import TalentDynamicItem from './TalentDynamicItem'
import styles from './index.less'

const LoadMore = (data) => {
  const { onloadMore } = data
  return (
    <div style={{ textAlign: 'center', margin: '20px 0 0 0' }}>
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
      talentDynamic: {
        start_time: '',
        list: [],
      },
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentUid !== this.props.currentUid) {
      this.setState(
        {
          talentDynamic: {
            start_time: '',
            list: [],
          },
        },
        () => {
          this.fetchData()
        }
      )
    }
  }

  fetchData = () => {
    const {
      talentDynamic: { start_time },
    } = this.state
    this.props
      .dispatch({
        type: 'talentDiscover/fetchDynamicDetailsNew',
        payload: {
          to_uid: this.props.currentUid,
          size: 5,
          version_type: 2,
          start_time,
        },
      })
      .then(({ data = {} }) => {
        const {
          talentDynamic,
          talentDynamic: { list: oldList = [] },
        } = this.state
        const { remain, list = [], last_time } = data
        this.setState({
          talentDynamic: Object.assign({}, talentDynamic, {
            remain,
            list: [...oldList, ...list],
            start_time: last_time,
          }),
        })
      })
  }

  handleLoadMore = () => {
    this.fetchData()
  }

  render() {
    const {
      talentDynamic: { list = [], remain = 0 },
    } = this.state
    if (list.length === 0) return null
    return (
      <div className={styles.talentDynamic}>
        <div className={styles.title}>人才动态</div>
        <TalentDynamicItem data={list} />
        {remain > 0 && <LoadMore onloadMore={this.handleLoadMore} />}
      </div>
    )
  }
}
