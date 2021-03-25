import React from 'react'
import { CloseCircleOutlined } from '@ant-design/icons'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
// import { connect } from 'react-redux'
import { Row, Col, Input } from 'antd'
import * as R from 'ramda'
import styles from './index.less'
// import PropTypes from 'prop-types'
// import * as R from 'ramda'

export default class UserForm extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      err: props.err,
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.err !== this.props.err) {
      this.setState({
        err: newProps.err,
      })
    }
  }

  checkPhone = (rule, value, callback) => {
    const len = R.propOr(0, 'length', value)
    if (len < 7 || [9, 10].includes(len) || len > 20) {
      callback('电话格式有误，请检查后重新填写')
    } else {
      callback()
    }
  }

  handleResetErr = (field) => () => {
    this.setState({
      err: null,
    })
    this.props.form.setFields({
      [field]: {
        // value: values.user,
        errors: undefined,
      },
    })
  }

  renderError = () => {
    const errors = R.flatten(
      R.map(R.propOr([], 'errors'), R.values(this.state.err))
    )
    return (
      <div className={styles.errorTip}>
        <CloseCircleOutlined />
        {R.pathOr('表单填写有误', [0, 'message'], errors)}
      </div>
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { err } = this.state
    return (
      <Form className={styles.form}>
        <h5 className={styles.title}>填写以下信息，1V1专属顾问竭诚为您服务</h5>
        {err && err !== null && this.renderError()}
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="姓名">
              {getFieldDecorator('realname', {
                rules: [
                  {
                    required: true,
                    message: '请填写真实姓名',
                  },
                  {
                    max: 10,
                    message: '姓名长度不能超过10位',
                  },
                ],
                validateTrigger: 'onBlur',
                onChange: this.handleResetErr('realname'),
                // trigger: 'onBlur',
              })(<Input placeholder="真实姓名(必填)" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="电话">
              {getFieldDecorator('mobile', {
                rules: [
                  {
                    required: true,
                    message: '请填写电话',
                  },
                  {
                    validator: this.checkPhone,
                  },
                ],
                onChange: this.handleResetErr('mobile'),
                validateTrigger: 'onBlur',
              })(<Input type="number" placeholder="手机号或座机号(必填)" />)}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="邮箱">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: '请填写邮箱',
                  },
                  {
                    type: 'email',
                    message: '邮箱格式有误，请检查后重新填写',
                  },
                  {
                    max: 50,
                    message: '邮箱长度不能超过50位',
                  },
                ],
                validateTrigger: 'onBlur',
                onChange: this.handleResetErr('email'),
              })(<Input placeholder="常用电子邮箱(必填)" />)}
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={16}>
            <Form.Item label="公司">
              {getFieldDecorator('company', {
                rules: [
                  {
                    required: true,
                    message: '请填写公司',
                  },
                  {
                    max: 50,
                    message: '公司名称不能超过50位',
                  },
                ],
                validateTrigger: 'onBlur',
                onChange: this.handleResetErr('company'),
              })(<Input placeholder="公司名称(必填)" />)}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }
}
