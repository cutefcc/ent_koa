import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as R from 'ramda'

export default function (WrapperComponent) {
  @withRouter
  @connect((state) => ({
    auth: state.global.auth,
  }))
  class Auth extends React.PureComponent {
    componentDidMount() {
      this.judgeUrlAuth(this.props)
    }

    componentWillReceiveProps(newProps) {
      if (this.props.auth !== newProps.auth) {
        this.judgeUrlAuth(newProps)
      }
    }

    personalUserRedirectMap = {
      '/ent/v2/discover': '/ent/talents/discover/search_v2/',
      '/ent/v2/job/positions': '/ent/talents/recruit/positions/', // 职位列表
      '/ent/v2/job/resumes': '/ent/talents/recruit/resumes/', // 简历列表
      '/ent/v2/job/recommend': '/ent/talents/discover/recommend/', // 推荐人才
    }

    judgeUrlAuth = (props) => {
      if (R.isEmpty(props.auth)) {
        return
      }

      // if (!props.auth.isEnterpriseRecruiter) {
      //   props.history.push('/ent')
      //   return
      // }

      const {
        auth: { validUrls = [], isEnterpriseRecruiter },
        match: { path = '' },
      } = props

      // 如果不是企业会员，新版显示菜单，但是点击跳转至旧版
      if (!isEnterpriseRecruiter) {
        Object.keys(this.personalUserRedirectMap).forEach((key) => {
          if (path.startsWith(key)) {
            props.history.push(this.personalUserRedirectMap[key])
          }
        })
      }

      if (!validUrls.includes(path)) {
        props.history.push(validUrls[0])
      }
    }

    render() {
      return <WrapperComponent {...this.props} />
    }
  }

  return Auth
}
