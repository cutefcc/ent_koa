import * as React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { SENTIMENT_SORT } from 'constants/sentiment'
import Tab from './Tab/index'
import * as styles from './index.less'

export interface Props {
  sortby: number
}

export interface State {}

@connect((state: any) => ({
  sortby: state.sentiment.sortby,
}))
export default class TabContainer extends React.PureComponent<Props, State> {
  handleChangeSortBy = (id) => {
    this.props.dispatch({
      type: 'sentiment/setSort',
      payload: id,
    })
    this.props.dispatch({
      type: 'sentiment/fetchSentimentData',
    })
  }
  renderSortBy = () => {
    const { sortby } = this.props
    return (
      <div className={`${styles.sortByWrapper} flex flex-align-center`}>
        {SENTIMENT_SORT.map((v) => {
          const { id, value } = v
          const isActive = id === sortby
          return (
            <div
              className={`${styles.sortByItem} ${
                isActive ? styles.active : ''
              }`}
              onClick={() => this.handleChangeSortBy(id)}
              key={`${id}-${value}`}
            >
              {value}
            </div>
          )
        })}
      </div>
    )
  }
  render() {
    return (
      <div className={R.propOr('', 'className', this.props)}>
        <div
          className={`${styles.tabCon} flex-align-center flex-justify-space-between`}
        >
          <Tab />
          {this.renderSortBy()}
        </div>
      </div>
    )
  }
}
