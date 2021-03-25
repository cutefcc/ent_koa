import * as React from 'react'
import { connect } from 'react-redux'
import { Button } from 'mm-ent-ui'

import * as styles from './index.less'
import { url } from 'inspector'
// import * as R from 'ramda'

export interface Props {
  visible: boolean
  onCancel: Function
  currentInvitation: Object
}

export interface StoreGlobalState {
  urlPrefix: string
  currentUser: object
}

export interface GlobalState {
  // loading: Loading,
  global: StoreGlobalState
}

export interface State {}

@connect((state: GlobalState) => ({
  urlPrefix: state.global.urlPrefix,
}))
export default class StepThirdModal extends React.Component<
  Props & StoreGlobalState,
  State
> {
  render() {
    return (
      <React.Fragment>
        <img
          src={`${this.props.urlPrefix}/images/entInvite/stepThirdInstructNew.png`}
          className={styles.img}
        />
        <div className={styles.tip}>
          如目标人才表达了‘可以聊’，ta会同步回流到人才银行中。
        </div>
        <div className={styles.footer}>
          <Button type="primary-2" roundCorner onClick={this.props.onCancel}>
            我知道了
          </Button>
        </div>
      </React.Fragment>
    )
  }
}
