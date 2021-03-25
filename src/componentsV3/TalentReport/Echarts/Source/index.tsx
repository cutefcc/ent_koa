import * as React from 'react'
import * as R from 'ramda'
import SourceItem from './SourceItem'
import { getCompanyNameByKey, companyKeyList } from 'utils/talentReport'
import * as styles from './index.less'

export interface Props {
  dataObj: Object
  number: number
  position: string // left or right
}

export interface State {}
export default class Source extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  getNumberList = () => {
    const { number } = this.props
    const numberList = []
    for (let i = 1; i <= number; i++) {
      numberList.push(i)
    }
    return numberList
  }

  render() {
    const { dataObj, number, position } = this.props
    const numberList = this.getNumberList()

    return (
      <div className={styles.sourceMain}>
        <div
          className={
            number > 3
              ? styles.sourceTitleContent
              : styles.sourceTitleContentLess
          }
        >
          {numberList &&
            numberList.map(item => {
              return (
                <div
                  key={item}
                  style={number > 3 ? null : { marginRight: '40px' }}
                  className={
                    item <= 3
                      ? styles.sourceTitleTop3Style
                      : styles.sourceTitleLast7Style
                  }
                >
                  Top{item}
                </div>
              )
            })}
        </div>
        {companyKeyList.map(key => {
          const tempList = R.pathOr(null, [key], dataObj)
          if (tempList === null) {
            return null
          }
          return (
            <SourceItem
              data={tempList}
              key={key}
              insertKey={key}
              name={getCompanyNameByKey(key)}
              number={number}
              position={position}
            />
          )
        })}
      </div>
    )
  }
}
