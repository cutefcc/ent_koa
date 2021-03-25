import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import classnames from 'classnames'
import { Icon } from 'mm-ent-ui'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Input } from 'antd'

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
  state = {}

  onChange = (e) => {
    this.props.onChange({ [this.props.id]: e.target.value })
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
    } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <Form.Item label={label}>
        {getFieldDecorator(id, {
          initialValue: defaultValue,
          rules: [
            { required, message: `请输入${label}` },
            {
              type: regType,
              message: regMsg,
            },
          ],
        })(
          <Input
            placeholder={optType}
            onChange={this.onChange}
            maxLength={maxLength}
          />
        )}
      </Form.Item>
    )
  }
}
