import React from 'react'
import { connect } from 'react-redux'

@connect((state) => ({
  checkCurrentUserVer: state.global.checkCurrentUserVer,
}))
export default class Beisen extends React.PureComponent {
  componentDidMount() {
    this.props
      .dispatch({
        type: 'global/checkCurrentUserVer',
      })
      .then((data) => {
        if (data && data.ver) {
          const { ver } = data
          if (ver === 1) {
            window.location.href = 'https://maimai.cn/zp'
            return
          }
          window.location.href = 'https://maimai.cn/ent'
        }
      })
  }

  render() {
    return <div>正在跳转......</div>
  }
}
