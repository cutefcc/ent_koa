import React from 'react'
import { Table, message, DatePicker } from 'antd'
import { Icon } from 'mm-ent-ui'
import { dateFormat } from 'utils/date'
import { connect } from 'react-redux'
// import ReactHTMLTableToExcel from 'react-html-table-to-excel';
// import {fixed} from 'utils/numbers'
import * as R from 'ramda'

import styles from './common.less'

@connect((state) => ({
  loading: state.loading.effects['statCompany/fetchDetail2'],
  currentUser: state.global.currentUser,
}))
export default class AssignedModal extends React.PureComponent {
  state = {
    data: [],
    startDate: undefined,
    endDate: undefined,
  }

  componentDidMount() {
    this.fetchData()
  }

  getColumns = () => {
    const {
      currentUser: { identity = 0 },
    } = this.props
    const inviteFields =
      identity === 2
        ? [
            {
              title: '人才邀约权益',
              dataIndex: 'ask_talent',
              key: 'ask_talent',
              render: (v, item) => {
                return this.renderItemDetail(
                  this.detailFieldsMap.ask_talent,
                  item
                )
              },
            },
          ]
        : []
    return [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '加入时间',
        dataIndex: 'join_time',
        key: 'join_time',
        width: 100,
      },
      {
        title: '有效职位数',
        dataIndex: 'jobs_total',
        key: 'jobs_total',
      },
      {
        title: '简历信息',
        dataIndex: 'resume',
        key: 'resume',
        render: (v, item) => {
          return this.renderItemDetail(this.detailFieldsMap.resume, item)
        },
      },
      {
        title: '加好友权益',
        dataIndex: 'addFr',
        key: 'addFr',
        render: (v, item) => {
          return this.renderItemDetail(this.detailFieldsMap.addFr, item)
        },
      },
      {
        title: '极速联系权益',
        dataIndex: 'uh',
        key: 'uh',
        render: (v, item) => {
          return this.renderItemDetail(this.detailFieldsMap.uh, item)
        },
      },
      {
        title: '极速曝光权益',
        dataIndex: 'exposure',
        key: 'exposure',
        render: (v, item) => {
          return this.renderItemDetail(this.detailFieldsMap.exposure, item)
        },
      },
      ...inviteFields,
      {
        title: '点数余量',
        dataIndex: 'mm_coin_balance',
        key: 'mm_coin_balance',
      },
    ]
  }

  detailFieldsMap = {
    ask_talent: [
      {
        label: '使用量',
        field: 'ask_talent_send',
      },
      {
        label: '余量',
        field: 'ask_talent_left',
      },
      {
        label: '通过率',
        field: 'ask_talent_rate',
        suffix: '%',
      },
    ],
    resume: [
      {
        label: '简历总数',
        field: 'resume_total',
      },
      {
        label: '感兴趣比例',
        field: 'resume_processing_rate',
        suffix: '%',
      },
    ],
    addFr: [
      {
        label: '使用量',
        field: 'addfr_used',
      },
      {
        label: '余量',
        field: 'addfr_left',
      },
      {
        label: '通过率',
        field: 'addfr_rate',
        suffix: '%',
      },
    ],
    uh: [
      {
        label: '使用量',
        field: 'uh_used',
      },
      {
        label: '余量',
        field: 'uh_left',
      },
      {
        label: '回复率',
        field: 'uh_rate',
        suffix: '%',
      },
    ],
    exposure: [
      {
        label: '使用量',
        field: 'exposure_used',
      },
      {
        label: '余量',
        field: 'exposure_left',
      },
    ],
  }

  fetchData = () => {
    this.props
      .dispatch({
        type: 'statCompany/fetchDetailV2',
        payload: {
          start: this.state.startDate,
          end: this.state.endDate,
        },
      })
      .then(({ data = [] }) => {
        this.setState({
          data,
        })
      })
  }

  exportExcel = () => {
    if (
      !('download' in document.createElement('a')) ||
      window.navigator.userAgent.indexOf('Chrome') === -1
    ) {
      message.error('请使用Chrome浏览器下载')
      return false
    }

    const { data } = this.state
    const columns = this.getColumns()
    const getTrData = (item) => {
      return columns
        .map((config) => {
          const { dataIndex } = config
          if (config.render) {
            const detailFields = R.propOr(
              [],
              config.dataIndex,
              this.detailFieldsMap
            )
            const values = detailFields
              .map((det) => {
                return `${det.label}:${item[det.field]}${det.suffix || ''}`
              })
              .join(`    `)
            return values
          }
          return item[dataIndex]
        })
        .join(',')
    }

    const res = [
      columns.map(R.prop('title')).join(','),
      ...data.map(getTrData),
    ].join('\n')
    const a = document.createElement('a')
    a.href = `data:attachment/csv,${encodeURI(`\uFEFF${res}`)}`
    a.target = '_blank'
    a.download = `企业使用概览.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    return ''
  }

  handleDateChange = ([start, end]) => {
    this.setState(
      {
        startDate: start ? start.format(dateFormat) : undefined,
        endDate: end ? end.format(dateFormat) : undefined,
      },
      this.fetchData
    )
  }

  renderItemDetail = (fields, values) => {
    return (
      <div className={styles.itemDetail}>
        {fields.map((item) => (
          <span key={item.field} className={styles.item}>
            <span className={styles.label}>{item.label}:</span>
            <span className={styles.value}>
              {`${values[item.field]}${item.suffix || ''}`}
            </span>
          </span>
        ))}
      </div>
    )
  }

  render() {
    return (
      <div className={styles.main} style={{ height: 'auto' }}>
        <div
          className={`${styles.ml24} ${styles.mr24}`}
          style={{ paddingTop: 16 }}
        >
          <h4 className={styles.commonTitle}>
            <span>
              子账号权益使用明细123
              <Icon
                type="download"
                onClick={this.exportExcel}
                className={styles.downloadIcon}
              />
            </span>
            <DatePicker.RangePicker
              onChange={this.handleDateChange}
              className="margin-left-16"
              placeholder={['开始日期', '结束日期']}
            />
          </h4>
          <Table
            dataSource={this.state.data}
            columns={this.getColumns()}
            size="middle"
            pagination={false}
            rowKey="name"
            loading={this.props.loading}
            className="margin-top-24"
            id="table"
          />
        </div>
      </div>
    )
  }
}
