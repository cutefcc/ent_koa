import * as React from 'react'
import { Popover } from 'antd'
import { connect } from 'react-redux'
import * as R from 'ramda'
import * as styles from './index.less'

export interface Props {
  urlPrefix?: string
  data: Array<Object>
  name: string
  insertKey: string
  number: number
  position: string // left or right
}

export interface State {}
@connect((state: any) => ({
  urlPrefix: state.global.urlPrefix,
}))
export default class SourceItem extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
  }

  getNumberList = () => {
    const { number, data } = this.props
    const numberList = []
    const tempNum = number - data.length
    for (let i = 1; i <= tempNum; i++) {
      numberList.push(i)
    }
    return numberList
  }

  render() {
    const { data, name, position, number, urlPrefix } = this.props
    const numberList = this.getNumberList()

    return (
      <div className={styles.sourceItemMain}>
        <div
          className={
            number > 3 ? styles.sourceItemName : styles.sourceItemNameLess
          }
        >
          <div
            className={
              number > 3
                ? styles.sourceItemNameStyle
                : styles.sourceItemNameStyleLess
            }
          >
            {name}
          </div>
          {position === 'left' ? (
            <img
              className={
                number > 3 ? styles.sourceItemImage : styles.sourceItemImageLess
              }
              src={`${urlPrefix}/images/icon_left.png`}
            />
          ) : (
            <img
              className={
                number > 3 ? styles.sourceItemImage : styles.sourceItemImageLess
              }
              src={`${urlPrefix}/images/icon_right.png`}
            />
          )}
        </div>
        {data &&
          data.map((item, index) => {
            if (index >= number) {
              return null
            }
            return (
              <div key={index} className={styles.singleContentStyle}>
                <Popover
                  autoAdjustOverflow={false}
                  placement="topLeft"
                  content={R.pathOr('', ['name'], item)}
                  trigger={'hover'}
                >
                  {R.pathOr(null, ['logo'], item) ? (
                    <img
                      className={
                        number > 3
                          ? styles.sourceIconImage
                          : styles.sourceIconImageLess
                      }
                      src={R.pathOr('', ['logo'], item)}
                    />
                  ) : (
                    <img
                      className={
                        number > 3
                          ? styles.sourceIconImage
                          : styles.sourceIconImageLess
                      }
                      src={'https://i9.taou.com/maimai/c/offlogo/default.png'}
                    />
                  )}
                </Popover>
              </div>
            )
          })}
        {numberList &&
          numberList.map((item, index) => {
            return (
              <div
                key={index}
                className={
                  number > 3
                    ? styles.sourceIconImage
                    : styles.sourceIconImageLess
                }
              />
            )
          })}
      </div>
    )
  }
}
