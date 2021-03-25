/**
 * 贡献排行榜
 */
import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Avatar from 'components/Common/Avatar'
import * as R from 'ramda'
import { Icon } from 'mm-ent-ui'
import Title from './Title'
import styles from './rank.less'
// import {withRouter} from 'react-router-dom'
// import * as R from 'ramda'

@connect((state) => ({
  loading: state.loading.effects['talentPool/fetchContribution'],
}))
export default class Rank extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  state = {
    data: [],
  }

  componentDidMount() {
    this.fetchContributors()
  }

  fetchContributors = () => {
    this.props
      .dispatch({
        type: 'talentPool/fetchContribution',
      })
      .then(({ data }) => {
        this.setState({
          data: R.propOr([], 'list', data),
        })
      })
  }

  renderItem = (item) => {
    return (
      <li
        className={`flex space-between ${styles.item} flex-align-center`}
        key={item.name}
      >
        <span className="flex flex-1 overflow-hidden flex-align-center">
          <Avatar
            avatar={item.avatar}
            name={R.propOr('保密', 'name', item)}
            className={styles.avatar}
            key="avatar"
          />
          <span
            className="color-stress font-size-14 margin-left-16 ellipsis"
            title={item.name}
          >
            {item.name}
          </span>
        </span>
        <span className="color-common font-size-14 margin-left-8">
          {item.count}人
        </span>
      </li>
    )
  }

  render() {
    return (
      <div className={this.props.className}>
        <Title title="贡献榜单" />
        <ul className="ul-without-style padding-24">
          {this.props.loading ? (
            <p className="flex flex-justify-center padding-24">
              <Icon type="loading" />
            </p>
          ) : (
            this.state.data.map(this.renderItem)
          )}
        </ul>
      </div>
    )
  }
}
