import * as React from 'react'
import { connect } from 'react-redux'
import * as R from 'ramda'
import classnames from 'classnames'
import { Icon } from 'mm-ent-ui'
import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Select } from 'antd'
import * as styles from './index.less'
const { Option } = Select

let timeout
let currentValue

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
    showHunter: false,
  }

  curSugTs = 0

  getSug = (v) => {
    let startTs = new Date() * 1
    this.props
      .dispatch({
        type: 'positions/fetchSug',
        payload: {
          u: window.uid,
          type: 7,
          chars: v,
          job_add_comp: this.props.params.company,
        },
      })
      .then((res) => {
        if (this.curSugTs <= startTs) {
          this.curSugTs = startTs
          if (res.result == 'ok' && res.data && res.data.length > 0) {
            this.setState({
              options: res.data,
            })
          }
        }
      })
  }

  handleSearch = (v) => {
    if (v) {
      this.getSug(v)
    } else {
      this.setState({ options: [] })
    }
  }

  onChange = (v, option) => {
    const params = this.state.options.filter((o) => v === o.data)[0] || {}
    this.props.onChange({
      position: v,
      profession_new: params.top_pf || '',
      profession_text: params.top_pf_name || '',
      profession_path_new: params.top_pf || '',
      major_new: params.mj_lv2 || params.top_mj || '',
      major_text: params.top_mj_name || '',
      // major_new_lv2: params.mj_lv2 || '',
      major_name_lv2: params.mj_name_lv2 || '',
      is_regular:
        (params.top_pf || params.mj_lv2 || params.top_mj) && v ? 1 : 0, // 是否是标准职位
    })
    this.props.form.setFieldsValue({
      profession_new: params.top_pf ? [params.top_pf] : undefined,
      major_new: params.top_mj_name || undefined,
      major_new_lv2: params.mj_name_lv2 || undefined,
    })
  }

  renderOption(sug, index) {
    let { id, data, thumbnail } = sug
    const descText = [sug.top_pf_name, sug.top_mj_name, sug.mj_name_lv2]
      .filter((word) => word)
      .join('>')
    return (
      <Option
        className={styles.positionSug}
        key={index}
        value={data}
        title={data}
        label={data}
      >
        <p>{data}</p>
        <span>{descText || '-'}</span>
      </Option>
    )
  }

  validateNotEmoji = (rule, value, callback) => {
    const { reg } = this.props
    if (reg.test(value)) {
      callback('请勿输入emoji表情')
    } else {
      callback()
    }
  }

  render() {
    const {
      id,
      optType,
      label,
      reg,
      needEmptyEjid,
      regMsg,
      defaultValue,
      formType,
    } = this.props
    const { getFieldDecorator, setFieldValue } = this.props.form
    return (
      <Form.Item label={label}>
        {getFieldDecorator(id, {
          initialValue: defaultValue,
          rules: [
            { required: true, message: `请输入${label}` },
            {
              validator: this.validateNotEmoji,
            },
          ],
        })(
          <Select
            showSearch
            disabled={formType == 'edit'}
            optionLabelProp="label"
            placeholder={optType}
            showArrow={false}
            filterOption={false}
            onSearch={this.handleSearch}
            onChange={this.onChange}
            notFoundContent={null}
          >
            {this.state.options.map(this.renderOption)}
          </Select>
        )}
      </Form.Item>
    )
  }
}
