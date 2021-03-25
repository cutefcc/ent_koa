import React from 'react'
import { Select, message } from 'antd'

const { Option } = Select

export default function CommonSelect({
  item,
  className,
  options,
  value,
  onChange,
  onSearch,
}) {
  const handleChange = (values) => {
    if (values.length > 10) {
      message.warn('最多添加十个条件')
      return
    }
    onChange(item.id, values.join(','))
  }

  const children = options.map((v) => (
    <Option
      key={v.value}
      value={String(v.value)}
      label={v.label}
      title={v.label}
    >
      {v.label}
    </Option>
  ))

  return (
    <div className={className}>
      <p>{item.label}</p>
      <Select
        mode="multiple"
        style={{ width: 244 }}
        value={(value && value.split(',')) || []}
        placeholder="请选择"
        onChange={handleChange}
        onSearch={(v) => onSearch(item.id, v)}
        optionLabelProp="label"
      >
        {children}
      </Select>
    </div>
  )
}
