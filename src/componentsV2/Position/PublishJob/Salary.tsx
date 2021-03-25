import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import classnames from 'classnames'
import { Icon } from 'mm-ent-ui'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Select } from 'antd'
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
  params: object
}

@connect((state) => ({
  constData: state.positions.constData,
}))
export default class Salary extends React.Component<Props> {
  state = {
    salary_min: [],
    salary_share: [],
  }

  get salary_max() {
    try {
      if (this.props.params.salary_min) {
        return this.formatOptions(
          this.props.constData.salary.filter(
            (s) => s.id == this.props.params.salary_min
          )[0].childs
        )
      } else {
        return this.formatOptions(this.props.constData.salary[0].childs)
      }
    } catch (e) {
      return []
    }
  }

  componentDidMount() {
    let sslist = []
    for (let i = 12; i <= 24; i++) {
      sslist.push({
        value: i,
        label: i + '薪',
      })
    }

    this.setState({
      salary_min: this.formatOptions(this.props.constData.salary),
      salary_share: sslist,
    })
  }

  formatOptions = (data) => {
    return (
      data &&
      data.map((v) => {
        return {
          value: v.id,
          label: v.value,
        }
      })
    )
  }

  onChange = (v, id) => {
    if (id === 'salary_min') {
      this.props.onChange({ salary_min: v, salary_max: undefined })
      this.props.form.setFieldsValue({
        salary: {
          salary_min: v,
          salary_max: undefined,
          salary_share: this.props.params.salary_share,
        },
      })
    } else {
      this.props.onChange({ [id]: v })

      const { salary_min, salary_max, salary_share } = this.props.params
      this.props.form.setFieldsValue({
        salary: {
          salary_min,
          salary_max,
          salary_share,
          [id]: v,
        },
      })
    }
  }

  valid = (rule, value, callback) => {
    if (
      value.salary_min &&
      value.salary_max &&
      value.salary_share !== undefined
    ) {
      return callback()
    }
    callback('请选择薪资范围')
  }

  render() {
    const {
      id,
      label,
      regType = '',
      required,
      children = [],
      needEmptyEjid,
      defaultValue,
    } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form.Item label={label} className={styles.combineForm}>
        {getFieldDecorator(id, {
          initialValue: defaultValue,
          rules: [{ required }, { validator: this.valid }],
        })(
          <CombineSelect
            options={{ ...this.state, salary_max: this.salary_max }}
            children={children}
            handleChange={this.onChange}
          />
        )}
      </Form.Item>
    )
  }
}
