import React from 'react'
import { Table } from 'antd'
import PropTypes from 'prop-types'

import styles from './dealRecord.less'

export default class List extends React.PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired,
    hasMore: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    loading: PropTypes.bool,
  }

  static defaultProps = {
    loading: false,
  }

  getColumns = () => {
    return [
      {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
        width: 200,
      },
      {
        title: '项目',
        dataIndex: 'deal_remark',
        key: 'deal_remark',
      },
      {
        title: '收支',
        dataIndex: 'coin',
        key: 'coin',
        width: 150,
      },
      {
        title: '余量',
        dataIndex: 'balance',
        key: 'balance',
        render: (value) => `${value} 点`,
        width: 150,
      },
    ]
  }

  render() {
    return (
      <div className={styles.main}>
        <h4>明细</h4>
        <div className={styles.data}>
          <Table
            dataSource={this.props.data}
            columns={this.getColumns()}
            rowKey="id"
            pagination={false}
            className={styles.table}
            loading={this.props.loading}
            scroll={{ y: 500 }}
          />
          {this.props.hasMore && (
            <span onClick={this.props.onLoadMore} className={styles.more}>
              点击加载更多明细...
            </span>
          )}
        </div>
      </div>
    )
  }
}
