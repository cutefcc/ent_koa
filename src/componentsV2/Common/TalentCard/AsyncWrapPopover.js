import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { Loading } from 'mm-ent-ui'
import styles from './AsyncWrapPopover.less'

/*
 *异步数据 带标题的 容器
 */
@connect(() => ({}))
export default class AsyncWrapPopover extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      data: null,
      total: 0,
    }
  }

  componentDidMount() {
    this.fetchdata()
  }

  componentWillReceiveProps(nextProps) {
    const { bigTitle } = nextProps
    const { bigTitle: oldBigTitle } = this.props
    if (bigTitle !== oldBigTitle) {
      this.refreshData()
    }
  }

  refreshData = () => {
    this.setState(
      {
        isLoading: true,
        data: null,
        total: 0,
      },
      () => {
        this.fetchdata()
      }
    )
  }

  fetchdata = () => {
    const { dispatchQuery, total, dataType = '' } = this.props
    this.props.dispatch(dispatchQuery).then(({ data }) => {
      const formatData = dataType
        ? {
            title: R.pathOr('', [[dataType], 'text'], data),
          }
        : data

      this.setState({
        data: formatData,
        total: total ? data[total] : 0,
        isLoading: false,
      })
    })
  }

  renderLoading = () => {
    const { type } = this.props
    if (type === 'resume') {
      return null
    }

    return (
      <p className="text-center margin-top-32">
        <Loading />
        <span className="color-gray400 margin-left-8">加载中...</span>
      </p>
    )
  }

  render() {
    const {
      ChildComponent,
      bigTitle = null,
      WrapperComponent,
      icon = {},
      deepBigTitle = null,
    } = this.props
    const bigTitleIsArray = Array.isArray(bigTitle)
    const [leftText, rightText] = bigTitleIsArray ? bigTitle : []
    const { data, total, isLoading } = this.state
    const ResComponent = WrapperComponent
      ? WrapperComponent(ChildComponent)
      : ChildComponent
    return (
      <div className={styles.popoverContainer}>
        {isLoading ? (
          this.renderLoading()
        ) : (
          <React.Fragment>
            {bigTitleIsArray && (
              <div className={styles.bigTitle}>
                {leftText}
                {total}
                {rightText}
              </div>
            )}
            {typeof bigTitle === 'string' && bigTitle.length > 0 && (
              <div className={styles.bigTitle}>{bigTitle}</div>
            )}
            <ResComponent data={data} icon={icon} bigTitle={deepBigTitle} />
          </React.Fragment>
        )}
      </div>
    )
  }
}
