import * as React from 'react'
import * as R from 'ramda'
import {
  getCompanyNameByKey,
  getPieColorByIndex,
  companyKeyList,
} from 'utils/talentReport'
import { toPoint } from 'utils/numbers'
import * as styles from './index.less'
import HalfPieDoughnutItem from './HalfPieDoughnutItem'

export interface Props {
  dataObj: Object
  topFlag?: boolean
  topList?: Array<Object>
  positionIndex?: number
  notCompany?: boolean
}

export interface State {}

export default class HalfPieDoughnut extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  getDataList = list => {
    const reultList = []
    list instanceof Array &&
      list.forEach(item => {
        reultList.push({
          value: toPoint(item.per),
          name: item.per,
          title: item.name,
        })
      })

    // 空数据展示
    if (reultList.length === 0) {
      reultList.push({
        value: 1,
        name: '暂无数据',
        title: '暂无数据',
      })
    }

    return reultList
  }

  getTips = list => {
    if (!(list instanceof Array)) return

    const reultList = list.map(item => {
      return <div>{`${item.name}：${item.per}`}</div>
    })

    // 空数据展示
    if (reultList.length === 0) {
      return <div>{`暂无数据`}</div>
    }

    return reultList
  }

  render() {
    const { dataObj, topFlag, topList, positionIndex, notCompany } = this.props
    const left = Object.keys(dataObj).length % 3
    return (
      <div className={styles.main}>
        {topFlag && (
          <div className={styles.topContentStyle}>
            {topList instanceof Array &&
              topList.map((item, index) => (
                <div key={index} className={styles.showIconContent}>
                  <div
                    className={styles.showIconColor}
                    style={{ backgroundColor: getPieColorByIndex(index) }}
                  />
                  <div className={styles.showIconWord}>
                    {R.pathOr('', ['name'], item)}
                  </div>
                </div>
              ))}
          </div>
        )}
        <div className={styles.halfPieDoughnutContentStyle}>
          {!notCompany &&
            companyKeyList.map(key => {
              if (!dataObj[key]) {
                return null
              }
              return (
                <div key={key} className={styles.halfPieDoughnutItemStyle}>
                  <HalfPieDoughnutItem
                    dataList={this.getDataList(R.pathOr([], [key], dataObj))}
                    title={getCompanyNameByKey(key)}
                    dataIndex={positionIndex}
                  />
                  <div className={styles.halfPieDoughnutItemHoverStyle}>
                    <div className={styles.notifyTooltips}>
                      <div className={styles.titleStyle}>
                        {getCompanyNameByKey(key)}
                      </div>
                      <div className={styles.contentStyle}>
                        {this.getTips(R.pathOr([], [key], dataObj))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          {notCompany &&
            Object.keys(dataObj).map(key => {
              if (!dataObj[key]) {
                return null
              }
              return (
                <div key={key} className={styles.halfPieDoughnutItemStyle}>
                  <HalfPieDoughnutItem
                    dataList={this.getDataList(R.pathOr([], [key], dataObj))}
                    title={key}
                    dataIndex={positionIndex}
                  />
                  <div className={styles.halfPieDoughnutItemHoverStyle}>
                    <div className={styles.notifyTooltips}>
                      <div className={styles.titleStyle}>{key}</div>
                      <div className={styles.contentStyle}>
                        {this.getTips(R.pathOr([], [key], dataObj))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          {left <= 2 && left !== 0 && (
            <div className={styles.halfPieDoughnutItemStyle} />
          )}
          {left <= 1 && left !== 0 && (
            <div className={styles.halfPieDoughnutItemStyle} />
          )}
        </div>
      </div>
    )
  }
}
