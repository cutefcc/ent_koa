import * as React from 'react'
import { Loading } from 'mm-ent-ui'
import * as styles from './index.less'
import DefaultReport from 'componentsV3/TalentReport/DefaultReport'

export interface Props {
  tips?: string | any
  height?: string
  marginBottom?: string
  showDefault?: boolean
}

export interface State {}
export default class CommonLoading extends React.PureComponent<Props, State> {
  render() {
    const {
      tips,
      height = '300px',
      marginBottom = '0px',
      showDefault,
    } = this.props

    if (showDefault) {
      return <DefaultReport />
    }

    return (
      <div
        style={{ height: height, marginBottom: marginBottom }}
        className={styles.main}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ width: '90px', margin: '0 auto' }}>
            <div>
              <Loading /> {tips || '加载中...'}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
