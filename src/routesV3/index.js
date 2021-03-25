import React from 'react'
// import { connect } from "react-redux";
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Row, Col } from 'antd'
import TalentLibrary from 'componentsV3/talentLibrary/index'
import JobEffect from 'componentsV3/JobEffect/index'
import IndexSearch from 'componentsV3/IndexSearch/index'
import MoreCare from 'componentsV3/MoreCare/index'
import CareCompany from 'componentsV3/CareCompany/index'
import SubscribeTable from 'componentsV3/Recommend/Subscribe/CommonTable'

@connect((state, dispatch) => ({
  dispatch,
}))
export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="ent-v3-main-grid">
        <IndexSearch />
        <Row gutter={16}>
          <Col span={17}>
            <JobEffect />
            <SubscribeTable />
          </Col>
          <Col span={7}>
            <div style={{ backgroundColor: 'white' }}>
              <TalentLibrary />
              <div id="right-container">
                <MoreCare />
                <CareCompany />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}
