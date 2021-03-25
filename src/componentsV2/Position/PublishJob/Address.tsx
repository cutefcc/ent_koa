import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import classnames from 'classnames'
import { Icon } from 'mm-ent-ui'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Cascader, Input } from 'antd'
import * as styles from './index.less'

class AddressInput extends React.Component<{
  value: object
  constData: object
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

  formatOptions = (items = []) => {
    return items.map((v) => ({
      value: v.value,
      label: v.value,
      children: v.childs ? this.formatOptions(v.childs) : null,
    }))
  }

  render() {
    const { value = {}, constData } = this.props
    const locations = this.formatOptions(constData.location)

    return (
      <div>
        <Cascader
          options={locations}
          value={value.provinceCity}
          style={{
            display: 'inline-block',
            width: '128px',
            marginRight: '16px',
          }}
          placeholder="选择工作城市"
          filterOption={false}
          allowClear={false}
          onChange={(e) => this.triggerChange(e, 'provinceCity')}
          displayRender={(label) => label.join('-')}
        />
        <Input
          value={value.address}
          style={{
            display: 'inline-block',
            width: '272px',
          }}
          placeholder="输入详细地址"
          onChange={(e) => this.triggerChange(e.target.value, 'address')}
        />
      </div>
    )
  }
}

export interface Props {
  id: string
  optType: string
  label: string
  reg: object
  needEmptyEjid: boolean
  regMsg: object
  defaultValue: string
  onChange: (value: object) => any
}

@connect((state) => ({
  constData: state.positions.constData,
}))
export default class Address extends React.Component<Props> {
  state = {
    options: [],
  }

  onChange = (v, id) => {
    const { address } = this.props.params

    if (id == 'provinceCity') {
      this.props.onChange({ province: v[0], city: v[1] })
      this.props.form.setFieldsValue({
        address: {
          address,
          [id]: v,
        },
      })
    } else {
      this.props.onChange({ [id]: v })
    }
  }

  valid = (rule, value, callback) => {
    if (value.address && value.provinceCity.length) {
      return callback()
    }
    callback('请输入工作地址')
  }

  render() {
    const { id, label, needEmptyEjid, required, constData } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <Form.Item label={label} className={styles.combineForm}>
        {getFieldDecorator(id, {
          rules: [{ required }, { validator: this.valid }],
        })(<AddressInput constData={constData} handleChange={this.onChange} />)}
      </Form.Item>
    )
  }
}
