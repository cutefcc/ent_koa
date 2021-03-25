import React, { useState } from 'react'
import * as R from 'ramda'
import { Cascader, message, Tag, Input } from 'antd'
import styles from './commonFormModal.less'

export default function CustomCascader({
  item,
  options,
  params,
  className,
  onChange,
}) {
  const [inputValue, setInputValue] = useState()
  const { provinces = '', cities = '' } = params
  const tags = R.without([''], provinces.split(',').concat(cities.split(',')))

  const handleChange = (v) => {
    if (tags.length > 10) {
      message.warn('最多添加十个条件')
      return
    }
    const newValue = tags.concat(R.takeLast(1, v))
    onChange(item.id, R.uniq(newValue).join(','))
    setInputValue('')
  }

  const onBlur = (e) => {
    if (e.target.value.trim() === '') {
      setInputValue('')
    }
  }

  const onClose = (v) => {
    onChange(item.id, R.without([v], tags).join(','))
  }
  const onSearch = (e) => {
    setInputValue(e.target.value)
  }

  const onKeyDown = (e) => {
    e.stopPropagation()
  }

  const filterOptions = []
  options.forEach((o) => {
    if (
      !tags.includes(o.value) &&
      (!inputValue || o.value.includes(inputValue)) &&
      !filterOptions.some((item) => item.value === o.value)
    ) {
      filterOptions.push({
        ...o,
        children: o.children.filter(
          (child) =>
            !tags.includes(String(child.label)) &&
            (!inputValue || child.value.includes(inputValue))
        ),
      })
      return
    }

    o.children.forEach((c) => {
      if (
        !tags.includes(o.value) &&
        (!inputValue || c.value.includes(inputValue)) &&
        !filterOptions.some((item) => item.value === o.value)
      ) {
        filterOptions.push({
          ...o,
          children: o.children.filter(
            (child) =>
              !tags.includes(String(child.label)) &&
              (!inputValue || child.value.includes(inputValue))
          ),
        })
      }
    })
  })

  return (
    <div className={className}>
      <p>{item.label}</p>
      <Cascader
        expandTrigger="hover"
        options={filterOptions}
        changeOnSelect
        onChange={handleChange}
      >
        <div className={styles.cascaderInput}>
          {tags.map((v) => {
            return (
              <Tag
                className="ant-select-selection__choice"
                key={v}
                closable
                onClose={() => onClose(v)}
              >
                {v}
              </Tag>
            )
          })}
          <Input
            placeholder={tags.length ? '' : '请选择'}
            value={inputValue}
            onChange={onSearch}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
          />
        </div>
      </Cascader>
    </div>
  )
}
