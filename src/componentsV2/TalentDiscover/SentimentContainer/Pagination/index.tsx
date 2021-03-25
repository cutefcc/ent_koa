import * as React from 'react'
import { Pagination } from 'antd'
import { connect } from 'react-redux'
import { PaginationParam } from './types/index'
import * as R from 'ramda'
import * as styles from './index.less'

export interface Props {
  paginationParam: PaginationParam
  dispatch?: (obj: object) => any
}

export interface State {}

@connect((state: any) => ({
  paginationParam: state.sentiment.paginationParam,
}))
export default class PaginationContainer extends React.PureComponent<
  Props,
  State
> {
  handlePageChange = (page: number, pageSize: number) => {
    this.handlePaginationParamChange(page, pageSize)
  }

  handlePageSizeChange = (currentPage: number, pageSize: number) => {
    this.handlePaginationParamChange(currentPage, pageSize)
  }

  handlePaginationParamChange = (page: number, pageSize: number) => {
    this.props.dispatch({
      type: 'sentiment/setPaginationParam',
      payload: {
        ...this.props.paginationParam,
        page,
        size: pageSize,
      },
    })
    this.props.dispatch({
      type: 'sentiment/fetchSentimentData',
    })
  }

  render() {
    const { total, size, page } = this.props.paginationParam
    return (
      <div
        className={styles.paginationContainer}
        style={{
          textAlign: 'right',
          height: '80px',
          lineHeight: '80px',
          paddingTop: '28px',
        }}
      >
        <Pagination
          total={total}
          pageSize={size}
          current={page}
          size="small"
          showSizeChanger={true}
          pageSizeOptions={['20']}
          showQuickJumper
          onChange={this.handlePageChange}
          onShowSizeChange={this.handlePageSizeChange}
        />
      </div>
    )
  }
}
