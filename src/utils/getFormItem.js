/* eslint-disable complexity */
import React from 'react'
import {
  Input,
  InputNumber,
  Radio,
  Checkbox,
  Select,
  DatePicker,
  AutoComplete,
  Cascader,
} from 'antd'

import {
  defaultSelectStyle,
  defaultInputStyle,
  defaultDateRangeStyle,
} from 'constants/styles'

// 此组件 负责: 接收 类型 和 options 返回一个 表单控件
// 如果在 antd getFieldDecorator 中使用的时候请 Item() 执行 否则报错
const getFormItem = (props) => {
  // props.type  控件类型 回头此处补个  对应关系
  // props.options  可选 如果是 单选按钮, 单选下拉框, 多选按钮, 多选下拉框 则需要传它；
  // props.options 格式 [{key: 11, label: '我是label'}]
  // props.config 传递给antd控件的 属性

  const { type = '', options, config = {} } = props

  const renderOptions = (optionType) => {
    return (
      options &&
      options.map((item) => {
        const { key, label } = item
        switch (optionType) {
          case 'select':
            return (
              <Select.Option key={key} value={key}>
                {label}
              </Select.Option>
            )
          case 'radio':
            return (
              <Radio key={key} value={key}>
                {label}
              </Radio>
            )
          case 'checkbox':
            return (
              <Checkbox key={key} value={key}>
                {label}
              </Checkbox>
            )
          default:
            return (
              <Select.Option key={key} value={key}>
                {label}
              </Select.Option>
            )
        }
      })
    )
  }

  let FieldItem

  switch (type) {
    case 'Preview':
      FieldItem = <span className="ant-form-text">{config.value}</span>
      break
    case 'Input':
      FieldItem = <Input style={defaultInputStyle} {...config} />
      break
    case 'TextArea':
      FieldItem = <Input.TextArea {...config} />
      break
    case 'InputNumber':
      FieldItem = <InputNumber style={defaultInputStyle} {...config} />
      break
    case 'RadioGroup':
      FieldItem = (
        <Radio.Group style={defaultInputStyle} {...config}>
          {renderOptions('radio')}
        </Radio.Group>
      )
      break
    case 'CheckboxGroup':
      FieldItem = (
        <Checkbox.Group style={defaultInputStyle} {...config}>
          {renderOptions('checkbox')}
        </Checkbox.Group>
      )
      break
    case 'Select':
      FieldItem = (
        <Select style={defaultSelectStyle} placeholder="请选择" {...config}>
          {renderOptions('select')}
        </Select>
      )
      break
    case 'Cascader':
      FieldItem = (
        <Cascader
          style={defaultSelectStyle}
          placeholder="请选择"
          options={options}
          {...config}
        />
      )
      break
    case 'DateDay':
      FieldItem = <DatePicker style={defaultDateRangeStyle} {...config} />
      break
    case 'DateRange':
      FieldItem = (
        <DatePicker.RangePicker style={defaultDateRangeStyle} {...config} />
      )
      break
    case 'AutoComplete':
      FieldItem = <AutoComplete style={defaultDateRangeStyle} {...config} />
      break
    // case 'Upload':
    //     FieldItem = <AutoComplete style={defaultDateRangeStyle} {...config} />
    //     break
    default:
      FieldItem = <Input style={defaultInputStyle} {...config} />
  }

  return FieldItem
}

export default getFormItem
