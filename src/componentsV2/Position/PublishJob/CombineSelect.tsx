import * as React from 'react'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Select } from 'antd'
const { Option } = Select

export default class CombineSelect extends React.Component<{
  value: object
  children: object
  options: object
  onChange: (value: object) => any
  handleChange: (value: any, id: string) => any
}> {
  triggerChange = (changedValue, id) => {
    const { onChange, value } = this.props
    onChange({
      ...value,
      [id]: changedValue,
    })
    this.props.handleChange(changedValue, id)
  }

  renderOption = (d, index) => {
    return (
      <Option key={d.value} value={d.value}>
        {d.label}
      </Option>
    )
  }

  render() {
    const { value = {}, children, options } = this.props

    return (
      <div>
        {children.map((child, i) => (
          <Select
            value={value[child.id]}
            style={{
              display: 'inline-block',
              width: children.length == 2 ? '200px' : '128px',
              marginRight: children.length > i + 1 ? '16px' : '0px',
            }}
            placeholder={child.optType}
            filterOption={false}
            onChange={(e) => this.triggerChange(e, child.id)}
          >
            {options[child.id].map(this.renderOption)}
          </Select>
        ))}
      </div>
    )
  }
}
