import * as React from 'react'
import * as R from 'ramda'
import RankItem from './RankItem'
import { getCompanyNameByKey, companyKeyList } from 'utils/talentReport'
import * as styles from './index.less'

export interface Props {
  dataObj: Object
}

export interface State {}
export default class Rank extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  render() {
    const { dataObj } = this.props
    return (
      <div className={styles.rankMain}>
        {companyKeyList.map((key, index) => {
          const list = R.pathOr(null, [key], dataObj)
          if (list === null) {
            return null
          }
          return (
            <RankItem
              data={list.length > 5 ? list.slice(0, 5) : list}
              key={key}
              insertKey={key}
              showLine={index !== 0}
              name={getCompanyNameByKey(key)}
            />
          )
        })}
      </div>
    )
  }
}
