import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import classnames from 'classnames'
import { Icon } from 'mm-ent-ui'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Input } from 'antd'
import * as styles from './index.less'

const { TextArea } = Input

export interface Props {
  key: string
  optType: string
  label: string
  reg: object
  needEmptyEjid: boolean
  regMsg: object
  defaultValue: string
}

export default class CommonInput extends React.Component<Props> {
  state = {
    textValue: '',
  }

  onChange = (e) => {
    this.props.onChange({ [this.props.id]: e.target.value })
    this.setState({
      textValue: e.target.value,
    })
  }

  render() {
    const {
      id,
      optType,
      label,
      regType = '',
      needEmptyEjid,
      regMsg,
      defaultValue,
      required,
      rows,
      maxLength,
      minLength,
    } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <div style={{ width: '100%' }}>
        <Form.Item label={label}>
          {getFieldDecorator(id, {
            initialValue: defaultValue,
            rules: [
              {
                required,
                message: `请输入${label}`,
              },
              // {
              //   min: minLength,
              //   message: '最少20个字符',
              // },
              {
                type: regType,
                message: regMsg,
              },
            ],
          })(
            <TextArea
              rows={rows}
              placeholder={optType}
              onChange={this.onChange}
              maxLength={maxLength}
            />
          )}
        </Form.Item>
        <p className={styles.descCount}>
          {this.state.textValue.length || this.props.params[id].length}/
          {maxLength}
        </p>
      </div>
    )
  }
}
