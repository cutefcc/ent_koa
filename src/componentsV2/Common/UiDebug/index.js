import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'
import urlParse from 'url'

export default function (img) {
  function UiDebug(WrapperComponent) {
    @connect((state) => ({
      env: state.global.env,
    }))
    @withRouter
    class Auth extends React.PureComponent {
      constructor(props) {
        super(props)
        const urlObj = urlParse.parse(props.location.search, true)
        const uidebug = R.trim(R.pathOr('', ['query', 'uidebug'], urlObj))
        this.uidebug = uidebug
      }

      render() {
        const { env } = this.props
        if (env !== 'development' || this.uidebug !== '1') {
          return <WrapperComponent {...this.props} />
        }
        return (
          <div>
            <img
              src={img}
              alt=""
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                display: 'block',
                width: '100%',
                opacity: '0.4',
                zIndex: '100000',
              }}
            />
            <WrapperComponent {...this.props} />
          </div>
        )
      }
    }

    return Auth
  }

  return UiDebug
}
