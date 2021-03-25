import React from 'react'
import { Tab } from 'mm-ent-ui'
import { connect } from 'react-redux'
import PhotoWrap from './PhotoWrap'
import VideoWrap from './VideoWrap'

function Album() {
  const tabsConfig = [
    {
      title: '企业相册',
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
      <PhotoWrap />
      <VideoWrap />
    </div>
  )
}

export default connect((state, dispatch) => ({
  currentUser: state.global.currentUser,
  dispatch,
}))(Album)
