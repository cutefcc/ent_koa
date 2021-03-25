import React from 'react'
import { Tab } from 'mm-ent-ui'
import { connect } from 'react-redux'
import PositionList from './PositionList'

function Position() {
  const tabsConfig = [
    {
      title: '职位展台',
      key: 1,
    },
  ]

  return (
    <div style={{ background: '#ffffff' }}>
      <Tab
        tabs={tabsConfig}
        activeKeys={[1]}
        type="large"
        style={{ borderBottom: '1px solid #F2F4F8', paddingLeft: '24px' }}
      />
      <PositionList />
    </div>
  )
}

export default connect((state, dispatch) => ({
  currentUser: state.global.currentUser,
  dispatch,
}))(Position)
