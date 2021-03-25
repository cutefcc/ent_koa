import React from 'react'
import { Input } from 'antd'

export default function CommonSelect({ item, className, onChange, value }) {
  const handleChange = (e) => {
    onChange(item.id, e.target.value)
  }
  return (
    <div className={className}>
      <p>{item.label}</p>
      <Input
        value={value}
        style={{ width: 244 }}
        placeholder="请输入"
        onChange={handleChange}
      />
    </div>
  )
}
