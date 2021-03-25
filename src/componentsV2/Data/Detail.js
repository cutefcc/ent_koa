/* eslint-disable no-param-reassign */
import React from 'react'
import { DatePicker, Radio, Pagination } from 'antd'
import { Text } from 'mm-ent-ui'
import { dateFormat } from 'utils/date'
import { connect } from 'react-redux'
import moment from 'moment'
import ClassificationChart from 'componentsV2/Data/ClassificationChart'
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
    startDate: undefined,
    endDate: undefined,
    radioValue: 2, // 1 本周 2 本月
    pagination: {
      page: 0,
      size: 20,
      total: 0,
    },
    tableData: [],
    // 数据汇总 total 沟通过-在招职位
    totalData: {
      has_contact_total: 0,
      addfr_total: 0,
      reach_total: 0,
      has_intention_total: 0,
      resume_total: 0,
      jobs_total: 0,
    },
  }

  componentDidMount() {
    this.handleSetThisMonthDate()
  }

  getTimestampToTime = (timestamp) => {
    const date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = `${date.getFullYear()}-`
    const M = `${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }-`
    const D = `${date.getDate()} `
    const h = `${date.getHours()}:`
    const m = `${date.getMinutes()}:`
    const s = date.getSeconds()
    return Y + M + D + h + m + s
  }

  getFormatStr = (date, formatStr) => {
    let str = formatStr
    str = str.replace(/yyyy|YYYY/, date.getFullYear())
    str = str.replace(
      /MM/,
      date.getMonth() + 1 > 9
        ? (date.getMonth() + 1).toString()
        : `0${date.getMonth() + 1}`
    )
    str = str.replace(
      /dd|DD/,
      date.getDate() > 9 ? date.getDate().toString() : `0${date.getDate()}`
    )
    return str
  }

  getCompanyTotal = () => {
    this.props
      .dispatch({
        type: 'statCompany/fetchCompanyTotal',
        payload: {
          start: this.state.startDate,
          end: this.state.endDate,
        },
      })
      .then(({ data }) => {
        // const {totalData} = this.state
        this.setState({
          totalData: data,
        })
      })
  }

  getLicenseDetail = () => {
    const {
      pagination,
      startDate,
      endDate,
      pagination: { page, size },
    } = this.state
    this.props
      .dispatch({
        type: 'statCompany/fetchLicenseDetail',
        payload: {
          start: startDate,
          end: endDate,
          page,
          size,
        },
      })
      .then(({ data = {} }) => {
        const { list = [] } = data
        if (list.length !== 0) {
          list.forEach((item) => {
            const [joinTime] = item.join_time.split(' ')
            item.join_time = joinTime
          })
        }
        this.setState({
          tableData: list,
          pagination: {
            ...pagination,
            total: data.total,
          },
        })
      })
  }

  getAllLicenseDetail = (columnsData) => {
    const {
      startDate,
      endDate,
      pagination: { total },
    } = this.state
    this.props
      .dispatch({
        type: 'statCompany/fetchLicenseDetail',
        payload: {
          start: startDate,
          end: endDate,
          page: 0,
          size: total,
        },
      })
      .then(({ data: res }) => {
        const { list = [] } = res
        if (list.length !== 0) {
          list.forEach((item) => {
            const [joinTime] = item.join_time.split(' ')
            item.join_time = joinTime
          })
        }
        const data = list
        const getTrData = (item) => {
          return columnsData
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

        const result = [
          columnsData.map(R.prop('title')).join(','),
          ...data.map(getTrData),
        ].join('\n')
        const a = document.createElement('a')
        a.href = `data:attachment/csv,${encodeURI(`\uFEFF${result}`)}`
        a.target = '_blank'
        a.download = `子账号使用情况${startDate} - ${endDate}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        return ''
      })
  }

  getDisabledDate(current) {
    return !(current < moment().subtract(1, 'day'))
  }

  fetchData = () => {
    this.getCompanyTotal()
    this.getLicenseDetail()
  }

  handleRadioChange = (e) => {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      radioValue: e.target.value,
    })
    if (e.target.value === 1) {
      this.handleSetThisWeekDate()
    } else {
      this.handleSetThisMonthDate()
    }
  }

  handleDateChange = ([start, end]) => {
    this.setState(
      {
        startDate: start ? start.format(dateFormat) : undefined,
        endDate: end ? end.format(dateFormat) : undefined,
        radioValue: 3,
      },
      this.fetchData
    )
  }

  handleSetThisMonthDate = () => {
    const endDate = this.getFormatStr(
      new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      'yyyy-MM-dd'
    )
    const startDate = this.getFormatStr(
      new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 30),
      'yyyy-MM-dd'
    )
    this.setState(
      {
        startDate,
        endDate,
      },
      () => {
        this.fetchData()
      }
    )
  }

  handleSetThisWeekDate = () => {
    const endDate = this.getFormatStr(
      new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      'yyyy-MM-dd'
    )
    const startDate = this.getFormatStr(
      new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * 7),
      'yyyy-MM-dd'
    )
    this.setState(
      {
        startDate,
        endDate,
      },
      this.fetchData
    )
  }

  handlePageChange = () => (page) => {
    const { pagination } = this.state
    this.setState(
      {
        pagination: {
          ...pagination,
          page: page - 1,
        },
      },
      this.getLicenseDetail
    )
  }

  render() {
    const {
      startDate,
      endDate,
      totalData,
      tableData,
      pagination,
      radioValue,
    } = this.state
    return (
      <div
        className={styles.main}
        style={{ height: 'auto', background: '#F3F4F8' }}
      >
        <div style={{ paddingTop: 16, paddingBottom: 16 }}>
          <h4 className={styles.commonTitle}>
            <span>
              <Text type="title" size={24}>
                招聘数据分析
              </Text>
            </span>
            <div>
              <Radio.Group onChange={this.handleRadioChange} value={radioValue}>
                <Radio value={1} style={{ marginRight: '15px' }}>
                  近七天
                </Radio>
                <Radio value={2}>近一月</Radio>
              </Radio.Group>
              <div style={{ width: '270px', display: 'inline-block' }}>
                <DatePicker.RangePicker
                  onChange={this.handleDateChange}
                  className="margin-left-16"
                  placeholder={['开始日期', '结束日期']}
                  disabledDate={this.getDisabledDate}
                  value={[moment(startDate), moment(endDate)]}
                  allowClear={false}
                  inputReadOnly
                />
              </div>
            </div>
          </h4>
        </div>
        <div className={`${styles.flex11}`}>
          <ClassificationChart
            totalData={totalData}
            tableData={tableData}
            onPageChange={this.handlePageChange()}
            pagination={pagination}
            startDate={startDate}
            endDate={endDate}
            handleExportExcel={this.getAllLicenseDetail}
          />
        </div>
        <div className={styles.classificationChartBottomPagintion}>
          <Pagination
            defaultCurrent={1}
            current={pagination.page + 1}
            total={pagination.total}
            onChange={this.handlePageChange()}
            pageSize={pagination.size}
          />
        </div>
      </div>
    )
  }
}
