import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import classnames from 'classnames'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import * as styles from './index.less'
import CombineSelect from './CombineSelect'

export interface Props {
  id: string
  optType: string
  label: string
  reg: object
  needEmptyEjid: boolean
  regMsg: object
  defaultValue: string
  constData: object
}

@connect((state) => ({
  constData: state.positions.constData,
  auth: state.global.auth,
}))
export default class WorkTimeDegree extends React.Component<Props> {
  onChange = (v, id) => {
    this.props.onChange({ [id]: v })
    const { work_time, degree } = this.props.params
    this.props.form.setFieldsValue({
      work_time_degree: {
        work_time,
        degree,
        [id]: v,
      },
    })
  }

  formatOptions = (items = []) => {
    return items.map((v) => ({
      value: v.id,
      label: v.value,
    }))
  }

  valid = (rule, value, callback) => {
    if (value.work_time !== undefined && value.degree !== undefined) {
      return callback()
    }
    callback('请选择经验学历')
  }

  render() {
    const {
      id,
      label,
      required,
      children = [],
      needEmptyEjid,
      defaultValue,
      constData,
    } = this.props
    const { getFieldDecorator } = this.props.form
    const options = {
      degree: this.formatOptions(constData.job_degrees),
      work_time: this.formatOptions(constData.work_times),
    }

    return (
      <Form.Item label={label} className={styles.combineForm}>
        {getFieldDecorator(id, {
          initialValue: defaultValue,
          rules: [{ required }, { validator: this.valid }],
        })(
          <CombineSelect
            options={options}
            children={children}
            handleChange={this.onChange}
          />
        )}
      </Form.Item>
    )
  }
}
