import React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Row, Col } from 'antd'
import WaterMark from 'componentsV2/Common/WaterMark'

@connect((state) => ({
  currentUser: state.global.currentUser,
}))
export default class Recommend extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.setWaterMark(this.props)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.currentUser !== newProps.currentUser) {
      this.setWaterMark(newProps)
    }
  }

  setWaterMark(props) {
    const { currentUser } = props
    if (R.isEmpty(currentUser)) {
      return
    }
    const name = R.pathOr('', ['ucard', 'name'], currentUser)
    const phone = R.pathOr('', ['ucard', 'mobile_last_four'], currentUser)
    if (!name && !phone) {
      return
    }
    WaterMark({
      text: name + phone,
      container: this.refRight,
    })
  }

  render() {
    return (
      <div className="ent-v3-main-grid">
        <Row gutter={16}>
          <Col span={19}>
            <div style={{ backgroundColor: 'red' }}>middle</div>
          </Col>
          <Col span={5}>
            <div style={{ backgroundColor: 'red' }}>right</div>
          </Col>
        </Row>
      </div>
    )
  }
}
