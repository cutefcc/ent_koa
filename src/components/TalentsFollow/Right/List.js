import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import PropTypes from 'prop-types'

import Table from 'components/TalentsFollow/Right/Table'
import { rightTypeMap } from 'constants/right'

@connect((state) => ({
  loading: state.loading.effects['personalAsset/fetchUsedRight'],
}))
export default class UsedRight extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    filter: PropTypes.object.isRequired,
    onFilterChange: PropTypes.func.isRequired,
  }

  state = {
    data: [],
    pageSize: 20,
    page: 0,
    remain: 0,
    pos_time: '',
  }

  componentDidMount() {
    this.refreshData()
  }

  componentWillReceiveProps(newProps) {
    if (
      !R.eqProps('type', newProps, this.props) ||
      !R.eqProps('filter', newProps, this.props)
    ) {
      this.refreshData(newProps)
    }
  }

  refreshData = (newProps) => {
    this.setState(
      {
        page: 0,
        data: [],
        pos_time: '',
      },
      () => {
        this.loadData(newProps).then(({ data = {} }) => {
          this.setState({
            data: data.list || [],
            remain: data.remain,
            pos_time: data.pos_time,
          })
        })
      }
    )
  }

  loadData = (newProps) => {
    const props = newProps || this.props
    const { type, filter } = props
    const formatFilter = R.pickAll(
      R.pathOr([], [type, 'filterFields'], rightTypeMap),
      filter
    )
    return this.props.dispatch({
      type: 'personalAsset/fetchUsedRight',
      payload: {
        page: this.state.page,
        pos_time: this.state.page === 0 ? undefined : this.state.pos_time,
        size: this.state.pageSize,
        type: R.pathOr('', [type, 'value'], rightTypeMap),
        ...formatFilter,
      },
    })
  }

  appendData = (newProps) => {
    this.loadData(newProps).then(({ data }) => {
      this.setState({
        // data: R.uniqBy(R.prop('id'), [...this.state.data, ...data.list]),
        data: [...this.state.data, ...data.list],
        remain: data.remain,
      })
    })
  }

  loadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      this.appendData
    )
  }

  handlePageChange = (page) => {
    this.setState(
      {
        page: page - 1,
      },
      this.refreshData
    )
  }

  handlePageSizeChange = (page, pageSize) => {
    this.setState(
      {
        pageSize,
      },
      this.refreshData
    )
  }

  render() {
    const { data, remain } = this.state
    const style = {
      width: '100%',
      lineHeight: '50px',
      display: 'inline-block',
    }
    return (
      <div>
        <Table
          data={data}
          loading={this.props.loading}
          source={`right_${this.props.type}`}
          filter={this.props.filter}
          onFilterChange={this.props.onFilterChange}
          trackParam={this.props.trackParam}
        />
        {remain === 1 ? (
          <span
            onClick={this.loadMore}
            className="color-blue text-center cursor-pointer"
            style={style}
          >
            点击加载更多数据...
          </span>
        ) : (
          <span className="color-dilution text-center" style={style}>
            没有更多数据
          </span>
        )}
      </div>
    )
  }
}
