import * as React from 'react'
import { Pagination } from 'antd'
import { asyncExtraData } from 'utils'
import { connect } from 'react-redux'
import { PaginationParam } from './types/index'
// import {CURRENT_TAB} from 'constants/talentDiscover'
import * as R from 'ramda'
import * as styles from './index.less'

export interface Props {
  paginationParam: PaginationParam
  dispatch?: (obj: object) => any
  version: string
  mappingTags: object[]
}

export interface State {}

@connect((state: any) => ({
  paginationParam: state.talentDiscover.paginationParam,
  mappingTags: state.talentDiscover.mappingTags,
}))
export default class PaginationContainer extends React.PureComponent<
  Props,
  State
> {
  handlePageChange = (page: number, pageSize: number) => {
    const { refRight } = this.props
    if (refRight) {
      refRight.scrollTop = 0
    }
    this.handlePaginationParamChange(page, pageSize)
  }

  handlePageSizeChange = (currentPage: number, pageSize: number) => {
    this.handlePaginationParamChange(currentPage, pageSize)
  }

  handlePaginationParamChange = (page: number, pageSize: number) => {
    const { version, mappingTags = [], dispatch } = this.props
    this.props.dispatch({
      type: 'talentDiscover/setPaginationParam',
      payload: {
        ...this.props.paginationParam,
        page,
        size: pageSize,
      },
    })
    if (version === '3.0') {
      let payload = {}
      if (mappingTags.length !== 0) {
        payload = {
          data_version: '3.0',
          search_type: 'mapping',
          pagination: true,
        }
      } else {
        payload = { data_version: '3.0', pagination: true }
      }
      dispatch({
        type: 'talentDiscover/fetchData',
        payload,
      }).then((data) => {
        if (data) {
          const { list = [] } = data
          asyncExtraData(dispatch, list)
        }
      })
    } else {
      dispatch({
        type: 'talentDiscover/fetchData',
        payload: {
          isNewSid: false,
        },
      }).then((data) => {
        if (data) {
          const { list = [] } = data
          asyncExtraData(dispatch, list)
        }
      })
    }
  }

  render() {
    const { total, size, page } = this.props.paginationParam
    return (
      <div className={styles.paginationContainer}>
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
