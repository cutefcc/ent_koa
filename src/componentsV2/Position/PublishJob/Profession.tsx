import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import classnames from 'classnames'
import { Icon } from 'mm-ent-ui'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Cascader } from 'antd'

export interface Props {
  id: string
  optType: string
  label: string
  reg: object
  needEmptyEjid: boolean
  regMsg: object
  defaultValue: string
  params: object
}

@connect((state) => ({
  jobs: state.global.jobs,
}))
export default class Position extends React.Component<Props> {
  state = {
    options: [],
  }

  componentDidMount() {
    this.props
      .dispatch({
        type: 'positions/fetchProfession',
      })
      .then((res) => {
        this.setState({
          options: this.formatOptions(res.profession),
        })
      })
  }

  formatOptions = (data) => {
    return data.map((v) => {
      return {
        value: v.code,
        label: v.name,
        children: v.sub ? this.formatOptions(v.sub) : null,
      }
    })
  }

  onChange = (value, option) => {
    const param = option[option.length - 1]
    this.props.onChange({
      profession_new: param.value,
      profession_text: param.label,
      profession_path_new: value.join(','),
      major_new: '',
      major_text: '',
      major_new_lv2: '',
      major_name_lv2: '',
      major_code_lv1: '',
    })
    this.props.form.setFieldsValue({
      major_new: undefined,
      major_new_lv2: undefined,
    })
  }

  render() {
    const { id, optType, label, formType } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form.Item label={label}>
        {getFieldDecorator(id, {
          // initialValue: defaultValue,
          rules: [{ required: true, message: `请输入${label}` }],
        })(
          <Cascader
            disabled={formType == 'edit'}
            changeOnSelect
            allowClear={false}
            options={this.state.options}
            placeholder={optType}
            onChange={this.onChange}
            displayRender={(label) => label.join('-')}
          />
        )}
      </Form.Item>
    )
  }
}
