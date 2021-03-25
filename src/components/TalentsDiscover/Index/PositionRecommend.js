import React from 'react'
import classnames from 'classnames'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Button } from 'mm-ent-ui'
import { withRouter } from 'react-router-dom'
import TalentCard from 'components/Common/TalentCard/RecommendBrief'

import styles from './positionRecommend.less'

@connect((state) => ({
  jobs: state.global.jobs,
  loadingJobs: state.loading.effects['global/fetchJobs'],
  loadingList: false,
}))
@withRouter
export default class PositionRecommend extends React.PureComponent {
  state = {
    recommendList: [],
    currentJob: {},
    jobs: [],
  }

  componentDidMount() {
    this.fetchJobs()
  }

  componentWillReceiveProps(newProps) {
    const { jobs } = newProps
    if (R.prop('length', jobs) > 0 && newProps.jobs !== this.props.jobs) {
      const currentJobState = !this.state.currentJob.jid
        ? {
            currentJob: R.propOr({}, 0, jobs),
          }
        : {}

      this.setState(
        {
          jobs,
          ...currentJobState,
        },
        this.fetchRecommendList
      )
    }
  }

  fetchJobs = () => this.props.dispatch({ type: 'global/fetchJobs' })

  fetchRecommendList = () => {
    this.props
      .dispatch({
        type: 'recommends/fetch',
        payload: {
          page: 0,
          pageSize: 5,
          jid: this.state.currentJob.jid,
        },
      })
      .then((data) => {
        this.setState({
          recommendList: R.propOr([], 'contacts', data),
        })
      })
  }

  handleClick = (currentJob) => () => {
    this.setState(
      {
        currentJob,
        recommendList: [],
      },
      this.fetchRecommendList
    )
  }

  handleDirectToRecommend = () => {
    const { currentJob } = this.state
    this.props.history.push(
      `/ent/talents/discover/recommend?jid=${currentJob.jid}`
    )
  }

  handleRedirectToAddPosition = () => {
    this.props.history.push('/ent/talents/recruit/positions/add')
  }

  renderJob = (job) => {
    const active = this.state.currentJob.jid === job.jid

    return (
      <li
        key={job.jid}
        className={classnames({
          [styles.job]: true,
          [styles.active]: active,
        })}
      >
        <span onClick={this.handleClick(job)}>{job.position}</span>
      </li>
    )
  }

  renderTalentCard = (talent) => (
    <div key={talent.jid} className={styles.talentCard}>
      <TalentCard data={talent} />
    </div>
  )

  render() {
    const { recommendList } = this.state
    const { jobs } = this.state
    return (
      <div key="positionRecommend">
        <h5 className={styles.title}>
          <span className={styles.name}>推荐人才</span>
          <span
            className="font-size-14 color-dilution cursor-pointer"
            onClick={this.handleDirectToRecommend}
          >
            查看更多
          </span>
        </h5>
        {jobs.length === 0 && (
          <div className={styles.emptyTip}>
            {/* <p>今天发布的职位，明天才会有推荐哦!</p> */}
            <p>您还没有发布职位，请点击</p>
            <p>
              <Button onClick={this.handleRedirectToAddPosition} type="link">
                发布职位
              </Button>
            </p>
          </div>
        )}
        {jobs.length > 0 && (
          <div className={styles.content}>
            <ul className={styles.jobs}>{jobs.map(this.renderJob)}</ul>
            <div className={styles.list}>
              {recommendList.length === 0 ? (
                <p className={styles.tip}>当前职位暂无匹配人才</p>
              ) : (
                recommendList.slice(0, 5).map(this.renderTalentCard)
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
}
