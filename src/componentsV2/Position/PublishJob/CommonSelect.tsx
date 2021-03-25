import * as React from 'react'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Select, message } from 'antd'
const { Option } = Select

export interface Props {
  id: string
  optType: string
  label: string
  reg: object
  needEmptyEjid: boolean
  regMsg: object
  defaultValue: string
  options: object
}

export default class CommonSelect extends React.Component<Props> {
  state = {
    options: [],
  }

  onChange = (v) => {
    const option = this.props.options.filter((o) => o.label == v)[0]
    this.props.onChange({ [this.props.id]: option.value })
  }

  onFocus = (v) => {
    if (this.props.id === 'major_new' && !this.props.options.length) {
      message.info('请先选择行业')
    }
  }

  renderOption(d, index) {
    return (
      <Option key={d.label} value={d.label}>
        {d.label}
      </Option>
    )
  }

  render() {
    const {
      id,
      optType,
      label,
      regType = '',
      options = [],
      needEmptyEjid,
      regMsg,
      defaultValue,
      required,
      formType,
    } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form.Item label={label}>
        {getFieldDecorator(id, {
          // initialValue: defaultValue,
          rules: [
            { required, message: `请选择${label}` },
            {
              type: regType,
              message: regMsg,
            },
          ],
        })(
          <Select
            disabled={formType == 'edit' && id === 'major_new' && defaultValue}
            filterOption={false}
            placeholder={optType}
            onChange={this.onChange}
            onFocus={this.onFocus}
          >
            {options.map(this.renderOption)}
          </Select>
        )}
      </Form.Item>
    )
  }
}
